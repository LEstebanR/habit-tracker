import { prisma } from '@/lib/prisma'

export async function createDefaultHabits(userId: string) {
  const defaultHabits = [
    {
      title: 'Drink water',
      iconName: 'Heart',
      color: 'bg-red-500',
      xpReward: 10,
    },
    {
      title: 'Exercise',
      iconName: 'Zap',
      color: 'bg-yellow-500',
      xpReward: 15,
    },
    {
      title: 'Read 10 pages',
      iconName: 'BookOpen',
      color: 'bg-blue-500',
      xpReward: 12,
    },
  ]

  await prisma.habit.createMany({
    data: defaultHabits.map((h) => ({ ...h, userId })),
  })
}
