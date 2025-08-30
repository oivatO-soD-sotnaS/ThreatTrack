import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Crown } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { forbidden } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { getUserScore } from '@/server/score';

const ScoreBadge = () => {
  const [score, setScore] = useState<number>(0)
  const {data: session, isPending, error} = authClient.useSession()

  useEffect(() => {
    const getScore = async () => {
      if(!session?.user.id) return
      const userScore = await getUserScore(session.user.id)

      if(typeof userScore === 'number')
        setScore(userScore)
    }

    if(session) getScore()
  }, [session])

  if (isPending) return (
    <Skeleton className='h-4 w-12'/>
  )

  if (!session || error) return forbidden()
    
  return (
    <Badge 
      variant={'outline'}
      className="font-bold from-yellow-400 to-yellow-600 border-0"
      style={{
        boxShadow: `
          0 0 20px rgba(251, 191, 36, 0.5),
          0 0 40px rgba(251, 191, 36, 0.3),
          0 0 60px rgba(251, 191, 36, 0.1)
        `,
        animation: 'goldenGlow 2s ease-in-out infinite alternate'
      }}
    >
      {score} <Crown className='text-yellow-400 fill-yellow-400'/>
      <style jsx>{`
        @keyframes goldenGlow {
          0% {
            box-shadow: 
              0 0 20px rgba(251, 191, 36, 0.5),
              0 0 40px rgba(251, 191, 36, 0.3),
              0 0 60px rgba(251, 191, 36, 0.1);
          }
          100% {
            box-shadow: 
              0 0 30px rgba(251, 191, 36, 0.8),
              0 0 60px rgba(251, 191, 36, 0.5),
              0 0 90px rgba(251, 191, 36, 0.2);
          }
        }
      `}</style>
    </Badge>
  );
};

export default ScoreBadge;