import { handlers } from "@/auth"; // Referring to the auth.ts we just created

export const runtime = "nodejs"; // Force Node.js runtime for Prisma compatibility

export const { GET, POST } = handlers;
