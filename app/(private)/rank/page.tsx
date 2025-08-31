import { getTopScorers } from '@/server/score'
import React from 'react'
import UserRankingPage from './_components/user-ranking-page'

export type User = {
  id: string
  name: string
  score: number
  image?: string | null
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export default async function Page() {
  const users = await getTopScorers(50)

  return <UserRankingPage users={users} />
}
