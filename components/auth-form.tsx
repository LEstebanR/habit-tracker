"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, User, Mail, Lock, Play } from "lucide-react";

interface AuthFormProps {
  onLogin: () => void;
  onRegister: () => void;
  // onLogin: (email: string, password: string) => Promise<boolean>;
  // onRegister: (
  //   email: string,
  //   password: string,
  //   name: string
  // ) => Promise<boolean>;
  onDemo: () => void;
}

export function AuthForm({ onLogin, onRegister, onDemo }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    // e.preventDefault();
    // setError("");
    // if (!email || !password || (!isLogin && !name)) {
    //   setError("Por favor completa todos los campos");
    //   return;
    // }
    // setIsLoading(true);
    // const success = isLogin
    //   ? await onLogin(email, password)
    //   : await onRegister(email, password, name);
    // setIsLoading(false);
    // if (!success) {
    //   setError(
    //     isLogin
    //       ? "Email o contraseña incorrectos"
    //       : "Este email ya está registrado"
    //   );
    // }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {isLogin ? "Sign in" : "Sign up"}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? "Enter your account to continue with your habits"
              : "Create an account to start your journey of habits"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Loading..." : isLogin ? "Sign in" : "Sign up"}
            </Button>
          </form>

          <div className="mt-4">
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

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setEmail("");
                setPassword("");
                setName("");
              }}
              className="text-sm text-primary hover:underline cursor-pointer"
            >
              {isLogin
                ? "Don't have an account? Create one"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
