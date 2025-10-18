import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
  {
    createdAt: new Date(),
    email: 'lesteban.dev@gmail.com',
    name: 'Esteban',
  },
]

export async function main() {
  for (const u of userData) {
    await prisma.user.upsert({
      create: u,
      update: u,
      where: { email: u.email },
    })
  }
}

main()
