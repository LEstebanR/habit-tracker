'use client'
import { SessionProvider } from 'next-auth/react'

import { AuthForm } from '@/components/auth-form'
import { useState, useEffect } from 'react'
import { HabitsApp } from '@/components/habits-app'
import { signInWithGoogle } from './actions'
import { useSession, signOut } from 'next-auth/react'

interface User {
  email: string
  id: string
  name: string
}

function HomeContent() {
  const [user, setUser] = useState<User | null>(null)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const { data: session, status } = useSession()

  useEffect(() => {
    if (session?.user) {
      // Safely check that all required fields are present before setting user
      if (session.user.id && session.user.email && session.user.name) {
        setUser({
          email: session.user.email,
          id: session.user.id,
          name: session.user.name,
        })
      }
    } else if (status === 'unauthenticated') {
      setUser(null)
    }
  }, [session, status])

  const handleLogout = () => {
    signOut()
    setIsDemoMode(false)
  }

  const handleDemoMode = () => {
    setUser({
      email: 'demo@example.com',
      id: 'demo',
      name: 'Demo User',
    })
    setIsDemoMode(true)
  }

  // Mostrar loading mientras NextAuth está verificando la sesión
  if (status === 'loading') {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <AuthForm onDemo={handleDemoMode} signInWithGoogle={signInWithGoogle} />
    )
  }

  return (
    <HabitsApp user={user} onLogout={handleLogout} isDemoMode={isDemoMode} />
  )
}

export default function Home() {
  return (
    <SessionProvider>
      <HomeContent />
    </SessionProvider>
  )
}
