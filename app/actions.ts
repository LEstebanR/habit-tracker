"use server";
import { signIn, signOut } from "@/auth";

export async function signInWithGoogle(): Promise<void> {
  await signIn("google");
}

export async function signOutAction(): Promise<void> {
  await signOut();
}
