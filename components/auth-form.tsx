import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Play } from "lucide-react";

interface AuthFormProps {
  onDemo: () => void;
  signInWithGoogle: () => Promise<void>;
}

export function AuthForm({ onDemo, signInWithGoogle }: AuthFormProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
          <CardDescription>
            Enter your account to continue with your habits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-4 flex flex-col gap-2  ">
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
              <Play className="w-4 h-4 mr-2" />
              View Demo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
