import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: habitId } = await params
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Get the habit and verify ownership
    const habit = await prisma.habit.findFirst({
      where: {
        id: habitId,
        userId: session.user.id,
      },
      include: {
        entries: {
          where: {
            date: {
              gte: new Date(today.getTime() - 24 * 60 * 60 * 1000), // Last 24 hours
              lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Next 24 hours
            },
          },
          orderBy: { date: 'desc' },
        },
      },
    })

    if (!habit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 })
    }

    // Check if already completed today
    const todayEntry = habit.entries.find((entry) => {
      const entryDate = new Date(entry.date)
      entryDate.setHours(0, 0, 0, 0)
      return entryDate.getTime() === today.getTime()
    })

    if (todayEntry) {
      return NextResponse.json(
        {
          error: 'Habit already completed today',
          completed: todayEntry.completed,
        },
        { status: 400 }
      )
    }

    // Create today's entry
    await prisma.habitEntry.create({
      data: {
        habitId,
        date: today,
        completed: true,
      },
    })

    // Calculate new streak
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const yesterdayEntry = habit.entries.find((entry) => {
      const entryDate = new Date(entry.date)
      entryDate.setHours(0, 0, 0, 0)
      return entryDate.getTime() === yesterday.getTime() && entry.completed
    })

    let newCurrentStreak = 1
    if (yesterdayEntry) {
      // Consecutive day - increment streak
      newCurrentStreak = habit.currentStreak + 1
    }

    const newLongestStreak = Math.max(habit.longestStreak, newCurrentStreak)

    // Update habit with new streak values
    const updatedHabit = await prisma.habit.update({
      where: { id: habitId },
      data: {
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        lastCompleted: today,
      },
    })

    return NextResponse.json({
      success: true,
      habit: {
        id: updatedHabit.id,
        currentStreak: updatedHabit.currentStreak,
        longestStreak: updatedHabit.longestStreak,
        completedToday: true,
      },
    })
  } catch (error) {
    console.error('Error checking in habit:', error)
    return NextResponse.json(
      { error: 'Failed to check in habit' },
      { status: 500 }
    )
  }
}
