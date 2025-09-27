import { PrismaClient, Prisma } from "../lib/generated/prisma";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    name: "Esteban",
    email: "lesteban.dev@gmail.com",
    createdAt: new Date(),
  },
];

export async function main() {
  for (const u of userData) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: u,
      create: u,
    });
  }
}

main();
