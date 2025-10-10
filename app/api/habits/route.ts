import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const habits = await prisma.habit.findMany({
      where: { userId: session.user.id },
      include: {
        entries: {
          where: {
            date: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
              lt: new Date(new Date().setHours(23, 59, 59, 999)),
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    const formattedHabits = habits.map((habit) => ({
      id: habit.id,
      name: habit.title,
      iconName: habit.iconName, // Use the actual iconName from database
      streak: habit.currentStreak, // Use the calculated streak from database
      completedToday: habit.entries.length > 0 && habit.entries[0].completed,
      color: habit.color || 'bg-blue-500', // Use the actual color from database or default
      xpReward: habit.xpReward,
      isCustom: true,
    }))

    return NextResponse.json({ habits: formattedHabits })
  } catch (error) {
    console.error('Error fetching habits:', error)
    return NextResponse.json(
      { error: 'Failed to fetch habits' },
      { status: 500 }
    )
  }
}
