"use server";
import { signIn, signOut } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function signInWithGoogle(): Promise<void> {
  await signIn("google");
}

export async function signOutAction(): Promise<void> {
  await signOut();
}
