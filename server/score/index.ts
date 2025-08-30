'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const ScoreSchema = z.object({
  score: z.number().int().min(0, 'Score must be 0 or greater')
})

export type ScoreUpdateData = z.infer<typeof ScoreSchema>

// Read User Score
export async function getUserScore(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        id: true,
        name: true,
        email: true,
        score: true,
        updatedAt: true
      }
    })
    return user?.score
  } catch (error) {
    console.error('Failed to fetch user score:', error)
    return null
  }
}

// Read All User Scores (Leaderboard)
export async function getAllUserScores() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        score: true,
        updatedAt: true
      },
      orderBy: {
        score: 'desc'
      }
    })
    return users
  } catch (error) {
    console.error('Failed to fetch user scores:', error)
    return []
  }
}

// Update User Score (Set specific score)
export async function updateUserScore(userId: string, newScore: number) {
  const validatedFields = ScoreSchema.safeParse({ score: newScore })

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        score: validatedFields.data.score,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        score: true,
        updatedAt: true
      }
    })

    revalidatePath('/scores')
    revalidatePath(`/users/${userId}`)
    
    return { 
      success: true, 
      user: updatedUser 
    }
  } catch (error) {
    console.error('Failed to update user score:', error)
    return { 
      success: false, 
      errors: { _form: ['Failed to update score'] } 
    }
  }
}

// Add Points to User Score
export async function addPointsToUser(userId: string, points: number) {
  if (points < 0) {
    return {
      success: false,
      errors: { points: ['Points must be positive'] }
    }
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        score: {
          increment: points
        },
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        score: true,
        updatedAt: true
      }
    })

    revalidatePath('/scores')
    revalidatePath(`/users/${userId}`)
    
    return { 
      success: true, 
      user: updatedUser 
    }
  } catch (error) {
    console.error('Failed to add points:', error)
    return { 
      success: false, 
      errors: { _form: ['Failed to add points'] } 
    }
  }
}

// Subtract Points from User Score
export async function subtractPointsFromUser(userId: string, points: number) {
  if (points < 0) {
    return {
      success: false,
      errors: { points: ['Points must be positive'] }
    }
  }

  try {
    // First get current score to ensure it doesn't go below 0
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { score: true }
    })

    if (!currentUser) {
      return {
        success: false,
        errors: { _form: ['User not found'] }
      }
    }

    const newScore = Math.max(0, currentUser.score - points)

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        score: newScore,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        score: true,
        updatedAt: true
      }
    })

    revalidatePath('/scores')
    revalidatePath(`/users/${userId}`)
    
    return { 
      success: true, 
      user: updatedUser 
    }
  } catch (error) {
    console.error('Failed to subtract points:', error)
    return { 
      success: false, 
      errors: { _form: ['Failed to subtract points'] } 
    }
  }
}

// Reset User Score to 0
export async function resetUserScore(userId: string) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        score: 0,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        score: true,
        updatedAt: true
      }
    })

    revalidatePath('/scores')
    revalidatePath(`/users/${userId}`)
    
    return { 
      success: true, 
      user: updatedUser 
    }
  } catch (error) {
    console.error('Failed to reset score:', error)
    return { 
      success: false, 
      errors: { _form: ['Failed to reset score'] } 
    }
  }
}

// Get Top Scorers
export async function getTopScorers(limit: number = 10) {
  try {
    const topUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        score: true,
        image: true,
        updatedAt: true
      },
      orderBy: {
        score: 'desc'
      },
      take: limit
    })
    return topUsers
  } catch (error) {
    console.error('Failed to fetch top scorers:', error)
    return []
  }
}

// Get User Rank by Score
export async function getUserRank(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { score: true }
    })

    if (!user) return null

    const higherScoreCount = await prisma.user.count({
      where: {
        score: {
          gt: user.score
        }
      }
    })

    return {
      rank: higherScoreCount + 1,
      score: user.score
    }
  } catch (error) {
    console.error('Failed to get user rank:', error)
    return null
  }
}

// Bulk Update Scores (for admin operations)
export async function bulkUpdateScores(updates: Array<{ userId: string; score: number }>) {
  try {
    const results = await prisma.$transaction(
      updates.map(update => 
        prisma.user.update({
          where: { id: update.userId },
          data: { 
            score: update.score,
            updatedAt: new Date()
          },
          select: {
            id: true,
            name: true,
            score: true
          }
        })
      )
    )

    revalidatePath('/scores')
    
    return { 
      success: true, 
      updated: results 
    }
  } catch (error) {
    console.error('Failed to bulk update scores:', error)
    return { 
      success: false, 
      errors: { _form: ['Failed to update scores'] } 
    }
  }
}
