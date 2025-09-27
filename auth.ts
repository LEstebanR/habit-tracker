import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user }) {
      try {
        // Verificar si el usuario ya existe
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email as string },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email as string,
              name: user.name,
            },
          });
        }
      } catch (err) {
        console.error("DB error:", err);
        return true;
      }
      return true;
    },

    async jwt({ token, user }) {
      // Si es la primera vez que se loguea (user está disponible)
      if (user) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email as string },
          });

          if (dbUser) {
            token.id = dbUser.id;
          }
        } catch (err) {
          console.error("Error fetching user ID:", err);
        }
      }
      return token;
    },

    async session({ session, token }) {
      // Agregar el ID del usuario a la sesión
      if (token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
