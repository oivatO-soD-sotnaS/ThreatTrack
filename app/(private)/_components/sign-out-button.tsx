"use client"

import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/auth-client'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function SignOutButton() {
  const router = useRouter()

  const handleClick = () => {
    signOut()
    router.push("/sign-in")
  }

  return (
    <Button variant={'destructive'} size={'lg'} className='w-full' onClick={handleClick}>
        <LogOut />
        Sair
    </Button>
  )
}
