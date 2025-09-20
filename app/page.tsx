"use client";
import { AuthForm } from "@/components/auth-form";
import { useState } from "react";
import { HabitsApp } from "@/components/habits-app";
import { loginAction, registerAction } from "./actions";


interface User {
  id: string;
  email: string;
  name: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);


  const handleLogout = () => {
    setUser(null);
    setIsDemoMode(false);
  };

  const handleDemoMode = () => {
    setUser( {
      id: "demo",
      email: "demo@example.com",
      name: "Demo User",
    });
    setIsDemoMode(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <AuthForm
        loginAction={loginAction}
        registerAction={registerAction}
        onDemo={handleDemoMode}
      />
    );
  }

  return (
    <HabitsApp user={user} onLogout={handleLogout} isDemoMode={isDemoMode} />
  );
}
