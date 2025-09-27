import type React from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { User, Play } from 'lucide-react'

interface AuthFormProps {
  onDemo: () => void
  signInWithGoogle: () => Promise<void>
}

export function AuthForm({ onDemo, signInWithGoogle }: AuthFormProps) {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="bg-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <User className="text-primary-foreground h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
          <CardDescription>
            Enter your account to continue with your habits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-4 flex flex-col gap-2">
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={signInWithGoogle}
              type="button"
            >
              Sign in with Google
            </Button>
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={onDemo}
              type="button"
            >
              <Play className="mr-2 h-4 w-4" />
              View Demo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
