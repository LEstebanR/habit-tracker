import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        // Check that required fields are present before proceeding
        if (!user.email || !user.name) {
          console.error("Missing required user fields:", {
            email: user.email,
            name: user.name,
          });
          return false;
        }

        // Verificar si el usuario ya existe
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
            },
          });
        }
      } catch (err) {
        console.error("DB error:", err);
        return false;
      }
      return true;
    },

    async jwt({ token, user }) {
      // Si es la primera vez que se loguea (user está disponible)
      if (user && user.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
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
