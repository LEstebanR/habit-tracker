"use client";
import { SessionProvider } from "next-auth/react";

import { AuthForm } from "@/components/auth-form";
import { useState, useEffect } from "react";
import { HabitsApp } from "@/components/habits-app";
import { signInWithGoogle, signOutAction } from "./actions";
import { useSession, signOut } from "next-auth/react";

interface User {
  id: string;
  email: string;
  name: string;
}

function HomeContent() {
  const [user, setUser] = useState<User | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session?.user) {
      setUser(session.user as User);
      console.log("session.user", session.user);
    } else if (status === "unauthenticated") {
      setUser(null);
    }
  }, [session, status]);

  const handleLogout = () => {
    signOut();
    setIsDemoMode(false);
  };

  const handleDemoMode = () => {
    setUser({
      id: "demo",
      email: "demo@example.com",
      name: "Demo User",
    });
    setIsDemoMode(true);
  };

  // Mostrar loading mientras NextAuth está verificando la sesión
  if (status === "loading") {
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
      <AuthForm onDemo={handleDemoMode} signInWithGoogle={signInWithGoogle} />
    );
  }

  return (
    <HabitsApp user={user} onLogout={handleLogout} isDemoMode={isDemoMode} />
  );
}

export default function Home() {
  return (
    <SessionProvider>
      <HomeContent />
    </SessionProvider>
  );
}
