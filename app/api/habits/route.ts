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
      iconName: habit.iconName,
      streak: habit.currentStreak,
      completedToday: habit.entries.length > 0 && habit.entries[0].completed,
      color: habit.color || 'bg-blue-500',
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

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, iconName, color, xpReward } = body

    if (!name || !iconName || !color || !xpReward) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const habit = await prisma.habit.create({
      data: {
        title: name,
        iconName,
        color,
        xpReward,
        userId: session.user.id,
      },
    })

    return NextResponse.json({
      habit: {
        id: habit.id,
        name: habit.title,
        iconName: habit.iconName,
        streak: habit.currentStreak,
        completedToday: false,
        color: habit.color,
        xpReward: habit.xpReward,
        isCustom: true,
      },
    })
  } catch (error) {
    console.error('Error creating habit:', error)
    return NextResponse.json(
      { error: 'Failed to create habit' },
      { status: 500 }
    )
  }
}
