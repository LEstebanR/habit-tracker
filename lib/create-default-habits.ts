// /lib/createDefaultHabits.ts
import { prisma } from '@/lib/prisma'

export async function createDefaultHabits(userId: string) {
  const defaultHabits = [
    { title: 'Drink water' },
    { title: 'Exercise' },
    { title: 'Read 10 pages' },
  ]

  await prisma.habit.createMany({
    data: defaultHabits.map((h) => ({ ...h, userId })),
  })
}
