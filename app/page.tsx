"use client";
import { AuthForm } from "@/components/auth-form";
import { useState } from "react";
import { HabitsApp } from "@/components/habits-app";

interface User {
  id: string;
  email: string;
  name: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  function handleSubmit() {
    console.log("submit");
  }

  const handleLogin = () => console.log("login");
  const handleRegister = () => console.log("register");
  const handleLogout = () => {
    setUser(null);
    setIsDemoMode(false);
  };

  const handleDemoMode = () => {
    const demoUser = {
      id: "demo",
      email: "demo@example.com",
      name: "Demo User",
    };
    setUser(demoUser);
    setIsDemoMode(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <AuthForm
        onLogin={handleLogin}
        onRegister={handleRegister}
        onDemo={handleDemoMode}
      />
    );
  }

  return (
    <HabitsApp user={user} onLogout={handleLogout} isDemoMode={isDemoMode} />
  );
}
