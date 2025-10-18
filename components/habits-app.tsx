'use client'
import { X } from 'lucide-react' // Added import for X icon
import { Crown } from 'lucide-react' // Added import for Crown icon
import {
  Trophy,
  Target,
  Zap,
  Heart,
  BookOpen,
  LogOut,
  Plus,
  Trash2,
  Eye,
  Coffee,
  Moon,
  Smile,
  Music,
  Camera,
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import { useState, useEffect, useCallback } from 'react'
import { HabitCard } from './habit-card'
import { UserStats } from './user-stats'
import { LevelProgress } from '@/components/level-progress'
import { AddHabitModal } from '@/components/modals/add-habit-modal'
import { Button } from '@/components/ui/button'
import { SubscriptionModal } from '@/components/modals/subscription-modal'
import { DeleteHabitModal } from '@/components/modals/delete-habit-modal'
import { HabitCalendar } from './habit-calendar'
import { useUser } from '@/hooks/useUser'
import { useUserStats } from '@/hooks/useUserStats'
import { toast } from 'sonner'

export interface Habit {
  id: string
  name: string
  iconName: string // Changed from icon: React.ReactNode to iconName: string
  streak: number
  completedToday: boolean
  color: string
  xpReward: number
  isCustom?: boolean
}

interface User {
  id: string
  email: string
  name: string
}

interface HabitsAppProps {
  user: User
  onLogout: () => void
  isDemoMode?: boolean
}

const demoHabits: Habit[] = [
  {
    color: 'bg-blue-500',
    completedToday: true,
    iconName: 'Heart',
    id: '1',
    isCustom: true,
    name: 'Drink 8 glasses of water',
    streak: 5,
    xpReward: 10,
  },
  {
    color: 'bg-green-500',
    completedToday: false,
    iconName: 'Zap',
    id: '2',
    isCustom: true,
    name: 'Exercise for 30 min',
    streak: 3,
    xpReward: 15,
  },
  {
    color: 'bg-purple-500',
    completedToday: true,
    iconName: 'BookOpen',
    id: '3',
    isCustom: true,
    name: 'Read 20 pages',
    streak: 7,
    xpReward: 12,
  },
]

export function HabitsApp({
  user,
  onLogout,
  isDemoMode = false,
}: HabitsAppProps) {
  const { user: userData } = useUser()
  const { stats, updateStats } = useUserStats()
  const [habits, setHabits] = useState<Habit[]>([])
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [showAddHabit, setShowAddHabit] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [showSubscription, setShowSubscription] = useState(false)
  const [habitHistory, setHabitHistory] = useState<Record<string, number>>({})
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadHabitsFromDatabase = useCallback(async () => {
    try {
      const response = await fetch('/api/habits')
      if (!response.ok) {
        throw new Error('Failed to fetch habits')
      }

      const data = await response.json()
      setHabits(data.habits)

      // Load habit history from localStorage
      const userDataKey = `habit-tracker-data-${user.id}`
      const savedData = localStorage.getItem(userDataKey)

      if (savedData) {
        const data = JSON.parse(savedData)
        setHabitHistory(data.habitHistory || {})
      } else {
        setHabitHistory({})
      }
    } catch (error) {
      console.error('Error loading habits from database:', error)
      // Fallback to default habits
      setHabits([])
      setHabitHistory({})
    }
  }, [user.id])

  useEffect(() => {
    if (user) {
      if (isDemoMode) {
        setHabits(demoHabits)
        const demoHistory: Record<string, number> = {}
        const today = new Date()
        for (let i = 0; i < 365; i++) {
          const date = new Date(today)
          date.setDate(today.getDate() - i)
          const dateString = date.toISOString().split('T')[0]

          const dayOfWeek = date.getDay()
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
          const weekNumber = Math.floor(i / 7)

          // Base completion percentage (much lower than before)
          let baseCompletion = Math.random() * 0.4 + 0.1 // 10% to 50% base

          if (isWeekend) baseCompletion *= 0.7 // Even lower on weekends
          if (weekNumber % 4 === 0) baseCompletion *= 1.3 // Slightly better some weeks
          if (weekNumber % 8 === 7) baseCompletion *= 0.5 // Really bad weeks occasionally

          // Add some randomness and ensure it stays within 0-1 range
          let finalCompletion = Math.min(
            1,
            baseCompletion + (Math.random() - 0.5) * 0.2
          )

          // Round to nearest 10% to make it cleaner
          finalCompletion = Math.round(finalCompletion * 10) / 10

          demoHistory[dateString] = finalCompletion
        }
        setHabitHistory(demoHistory)
      } else {
        // Load habits from database
        loadHabitsFromDatabase()
      }
    }
  }, [user, isDemoMode, loadHabitsFromDatabase])

  useEffect(() => {
    if (user && !isDemoMode) {
      const userDataKey = `habit-tracker-data-${user.id}`
      const dataToSave = {
        habitHistory,
      }
      localStorage.setItem(userDataKey, JSON.stringify(dataToSave))
    }
  }, [user, habitHistory, isDemoMode])

  const getXPForNextLevel = (currentLevel: number) => currentLevel * 100
  const getCurrentLevelXP = (xp: number, level: number) =>
    xp - (level - 1) * 100

  const completeHabit = async (habitId: string) => {
    const habit = habits.find((h) => h.id === habitId)
    if (!habit) return

    // Store original state for rollback
    const originalHabit = { ...habit }
    const currentLevel = stats?.level || 1
    const currentXP = stats?.totalXP || 0
    const currentCompletedToday = stats?.completedToday || 0
    const currentTotalStreak = stats?.totalStreak || 0

    // Optimistic update - update UI immediately
    const today = new Date().toISOString().split('T')[0]

    setHabits((prevHabits) =>
      prevHabits.map((h) =>
        h.id === habitId
          ? { ...h, completedToday: true, streak: h.streak + 1 }
          : h
      )
    )

    setHabitHistory((prev) => ({
      ...prev,
      [today]: 1.0,
    }))

    // Update stats optimistically
    const newXP = currentXP + habit.xpReward
    const newLevel = Math.floor(newXP / 100) + 1
    updateStats({
      totalXP: newXP,
      level: newLevel,
      completedToday: currentCompletedToday + 1,
      totalStreak: currentTotalStreak + 1,
    })

    // Make API call in background
    try {
      const response = await fetch(`/api/habits/${habitId}/checkin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const error = await response.json()
        if (error.error === 'Habit already completed today') {
          // Revert optimistic update
          setHabits((prevHabits) =>
            prevHabits.map((h) => (h.id === habitId ? originalHabit : h))
          )
          updateStats({
            totalXP: currentXP,
            level: currentLevel,
            completedToday: currentCompletedToday,
            totalStreak: currentTotalStreak,
          })
          toast.info('Already completed', {
            description: 'This habit was already completed today.',
          })
          return
        }
        throw new Error(error.error || 'Failed to complete habit')
      }

      const data = await response.json()

      // Validate response structure
      if (!data || !data.habit) {
        throw new Error('Invalid response from server')
      }

      // Update with server data (correct streak from server)
      setHabits((prevHabits) =>
        prevHabits.map((h) =>
          h.id === habitId ? { ...h, streak: data.habit.currentStreak } : h
        )
      )

      // Update stats with actual server data
      if (
        data.user &&
        data.user.totalXP !== undefined &&
        data.user.level !== undefined
      ) {
        updateStats({
          totalXP: data.user.totalXP,
          level: data.user.level,
        })

        // Check if leveled up
        if (data.user.level > currentLevel) {
          setShowLevelUp(true)
          setTimeout(() => setShowLevelUp(false), 3000)
          toast.success(`Level Up! You're now level ${data.user.level}! 🎉`)
        }
      }
    } catch (error) {
      console.error('Error completing habit:', error)

      toast.error('Failed to complete habit', {
        description:
          'There was an error updating your habit. Please try again.',
      })

      // Revert optimistic update on error
      setHabits((prevHabits) =>
        prevHabits.map((h) => (h.id === habitId ? originalHabit : h))
      )
      setHabitHistory((prev) => ({
        ...prev,
        [today]: 0,
      }))
      updateStats({
        totalXP: currentXP,
        level: currentLevel,
        completedToday: currentCompletedToday,
        totalStreak: currentTotalStreak,
      })
    }
  }

  const addCustomHabit = async (habitData: {
    name: string
    iconName: string // Changed from icon to iconName
    color: string
    xpReward: number
  }) => {
    const totalHabitsCount = habits.length
    const userPlan = userData?.plan || 'FREE'

    // Check plan limits: FREE = 3 habits, PREMIUM = 20 habits
    if (userPlan === 'FREE' && totalHabitsCount >= 3) {
      setShowSubscription(true)
      return
    }

    if (userPlan === 'PREMIUM' && totalHabitsCount >= 20) {
      alert(
        'You have reached the maximum limit of 20 habits for Premium users.'
      )
      return
    }

    try {
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(habitData),
      })

      if (!response.ok) {
        throw new Error('Failed to create habit')
      }

      const data = await response.json()

      setHabits((prevHabits) => [...prevHabits, data.habit])
      toast.success('Habit created!', {
        description: `"${habitData.name}" has been added to your habits.`,
      })
    } catch (error) {
      console.error('Error creating habit:', error)
      toast.error('Failed to create habit', {
        description:
          'There was an error creating your habit. Please try again.',
      })
    }
  }

  const deleteHabit = async () => {
    if (!habitToDelete) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/habits/${habitToDelete.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete habit')
      }

      setHabits((prevHabits) =>
        prevHabits.filter((habit) => habit.id !== habitToDelete.id)
      )

      toast.success('Habit deleted', {
        description: `"${habitToDelete.name}" has been removed from your habits.`,
      })

      setHabitToDelete(null)
      setEditMode(false)
    } catch (error) {
      console.error('Error deleting habit:', error)
      toast.error('Failed to delete habit', {
        description:
          error instanceof Error
            ? error.message
            : 'There was an error deleting your habit. Please try again.',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const promptDeleteHabit = (habit: Habit) => {
    setHabitToDelete(habit)
  }

  const handleSubscribe = () => {
    // Subscription handled elsewhere - just close modal and refetch user data
    setShowSubscription(false)
  }

  const completedToday = habits.filter((h) => h.completedToday).length
  const totalHabits = habits.length

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Heart':
        return <Heart className="h-6 w-6" />
      case 'Zap':
        return <Zap className="h-6 w-6" />
      case 'BookOpen':
        return <BookOpen className="h-6 w-6" />
      case 'Trophy':
        return <Trophy className="h-6 w-6" />
      case 'Target':
        return <Target className="h-6 w-6" />
      case 'Coffee':
        return <Coffee className="h-6 w-6" />
      case 'Moon':
        return <Moon className="h-6 w-6" />
      case 'Smile':
        return <Smile className="h-6 w-6" />
      case 'Music':
        return <Music className="h-6 w-6" />
      case 'Camera':
        return <Camera className="h-6 w-6" />
      default:
        return <Heart className="h-6 w-6" />
    }
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto max-w-md px-4 py-8">
        {isDemoMode && (
          <div className="mb-4 rounded-lg border border-orange-200 bg-orange-100 p-3 dark:border-orange-800 dark:bg-orange-900/20">
            <div className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
              <Eye className="h-4 w-4" />
              <span className="text-sm font-medium">
                Demo Mode - Changes are not saved
              </span>
            </div>
          </div>
        )}

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-foreground flex items-center gap-2 text-2xl font-bold">
              Hello, {user.name}!
              {userData?.plan === 'PREMIUM' && (
                <Crown className="h-5 w-5 text-yellow-500" />
              )}
            </h1>
            <p className="text-muted-foreground text-sm">Build your habits</p>
          </div>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={onLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Logout</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <UserStats
          level={stats?.level || 1}
          totalXP={stats?.totalXP || 0}
          completedToday={stats?.completedToday || 0}
          totalHabits={stats?.totalHabits || 0}
          totalStreak={stats?.totalStreak || 0}
          weeklyCompletion={stats?.weeklyCompletion || 0}
        />

        <LevelProgress
          currentXP={getCurrentLevelXP(stats?.totalXP || 0, stats?.level || 1)}
          xpForNextLevel={getXPForNextLevel(stats?.level || 1)}
          level={stats?.level || 1}
        />

        {showLevelUp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-card animate-bounce rounded-2xl p-8 text-center">
              <div className="mb-4 text-6xl">🎉</div>
              <h2 className="text-primary mb-2 text-2xl font-bold">
                Level {stats?.level || 1}!
              </h2>
              <p className="text-muted-foreground">Keep it up, champion!</p>
            </div>
          </div>
        )}

        <HabitCalendar habitHistory={habitHistory} className="mb-6" />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-foreground text-xl font-semibold">
              Habits of today
            </h2>
            <div className="flex items-center gap-2">
              {userData && (
                <span className="text-muted-foreground text-xs">
                  {habits.length}/{userData.plan === 'PREMIUM' ? '20' : '3'}
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditMode(!editMode)}
                className={editMode ? 'text-destructive' : ''}
              >
                {editMode ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddHabit(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </div>
          </div>

          {habits.map((habit) => (
            <div key={habit.id} className="group relative">
              <HabitCard
                habit={habit}
                onComplete={() => completeHabit(habit.id)}
                icon={getIconComponent(habit.iconName)}
              />
              {editMode && habit.isCustom && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="animate-in fade-in zoom-in absolute -top-2 -right-2 z-10 h-8 w-8 rounded-full border-2 border-red-200 bg-red-50 text-red-600 shadow-md transition-all duration-200 hover:border-red-300 hover:bg-red-100 hover:text-red-700 hover:shadow-lg dark:border-red-900 dark:bg-red-950/50 dark:text-red-400 dark:hover:border-red-800 dark:hover:bg-red-900/70 dark:hover:text-red-300"
                  onClick={() => promptDeleteHabit(habit)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}

          {habits.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-muted-foreground mb-4">
                You don&apos;t have any habits yet
              </p>
              <Button onClick={() => setShowAddHabit(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add your first habit
              </Button>
            </div>
          )}
        </div>

        <div className="bg-card mt-8 rounded-xl p-4 text-center">
          <p className="text-muted-foreground text-sm">
            {completedToday === totalHabits && totalHabits > 0
              ? '🎉 Incredible! You completed all your habits today'
              : `💪 ${completedToday}/${totalHabits} habits completed. Keep it up!`}
          </p>
        </div>

        <AddHabitModal
          isOpen={showAddHabit}
          onClose={() => setShowAddHabit(false)}
          onAddHabit={addCustomHabit}
        />
        <SubscriptionModal
          isOpen={showSubscription}
          onClose={() => setShowSubscription(false)}
          onSubscribe={handleSubscribe}
        />
        <DeleteHabitModal
          isOpen={habitToDelete !== null}
          onClose={() => setHabitToDelete(null)}
          onConfirm={deleteHabit}
          habitName={habitToDelete?.name || ''}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  )
}
