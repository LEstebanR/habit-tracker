import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        habits: {
          include: {
            entries: {
              where: {
                date: {
                  gte: new Date(new Date().setDate(new Date().getDate() - 7)),
                },
                completed: true,
              },
            },
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Get today's completed habits
    const todayEntries = await prisma.habitEntry.findMany({
      where: {
        habit: {
          userId: session.user.id,
        },
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
        completed: true,
      },
    })

    const completedToday = todayEntries.length
    const totalHabits = user.habits.length

    // Calculate total streak (sum of all current streaks)
    const totalStreak = user.habits.reduce(
      (sum, habit) => sum + habit.currentStreak,
      0
    )

    // Calculate weekly completion (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    sevenDaysAgo.setHours(0, 0, 0, 0)

    const weeklyEntries = await prisma.habitEntry.groupBy({
      by: ['date'],
      where: {
        habit: {
          userId: session.user.id,
        },
        date: {
          gte: sevenDaysAgo,
        },
        completed: true,
      },
      _count: true,
    })

    // Calculate average daily completion for the week
    const totalDailyCompletions = weeklyEntries.reduce(
      (sum, day) => sum + day._count,
      0
    )
    const daysWithData = weeklyEntries.length || 1
    const avgDailyCompletions = totalDailyCompletions / daysWithData
    const weeklyCompletion =
      totalHabits > 0
        ? Math.round((avgDailyCompletions / totalHabits) * 100)
        : 0

    return NextResponse.json({
      stats: {
        totalXP: user.totalXP,
        level: user.level,
        completedToday,
        totalHabits,
        totalStreak,
        weeklyCompletion,
      },
    })
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user stats' },
      { status: 500 }
    )
  }
}

