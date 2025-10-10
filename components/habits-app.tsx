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
import { HabitCalendar } from './habit-calendar'
// Removed database actions - using API endpoints instead

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
  const [habits, setHabits] = useState<Habit[]>([])
  const [totalXP, setTotalXP] = useState(0)
  const [level, setLevel] = useState(1)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [showAddHabit, setShowAddHabit] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [isPremium, setIsPremium] = useState(false)
  const [showSubscription, setShowSubscription] = useState(false)
  const [habitHistory, setHabitHistory] = useState<Record<string, number>>({})

  const loadHabitsFromDatabase = useCallback(async () => {
    try {
      const response = await fetch('/api/habits')
      if (!response.ok) {
        throw new Error('Failed to fetch habits')
      }

      const data = await response.json()
      setHabits(data.habits)

      // Load user data from localStorage for XP, level, etc.
      const userDataKey = `habit-tracker-data-${user.id}`
      const savedData = localStorage.getItem(userDataKey)

      if (savedData) {
        const data = JSON.parse(savedData)
        setTotalXP(data.totalXP || 0)
        setLevel(data.level || 1)
        setIsPremium(data.isPremium || false)
        setHabitHistory(data.habitHistory || {})
      } else {
        setTotalXP(0)
        setLevel(1)
        setIsPremium(false)
        setHabitHistory({})
      }
    } catch (error) {
      console.error('Error loading habits from database:', error)
      // Fallback to default habits
      setHabits([])
      setTotalXP(0)
      setLevel(1)
      setIsPremium(false)
      setHabitHistory({})
    }
  }, [user.id])

  useEffect(() => {
    if (user) {
      if (isDemoMode) {
        setHabits(demoHabits)
        setTotalXP(180) // Demo XP to show level 2
        setLevel(2)
        setIsPremium(false)
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
    if (user && habits.length > 0 && !isDemoMode) {
      const userDataKey = `habit-tracker-data-${user.id}`
      const dataToSave = {
        habitHistory,
        habits,
        isPremium,
        level,
        totalXP,
      }
      localStorage.setItem(userDataKey, JSON.stringify(dataToSave))
    }
  }, [user, habits, totalXP, level, isPremium, habitHistory, isDemoMode])

  const calculateLevel = (xp: number) => Math.floor(xp / 100) + 1
  const getXPForNextLevel = (currentLevel: number) => currentLevel * 100
  const getCurrentLevelXP = (xp: number, level: number) =>
    xp - (level - 1) * 100

  const calculateTotalStreak = () => {
    return habits.reduce((total, habit) => total + habit.streak, 0)
  }

  const calculateWeeklyCompletion = () => {
    if (habits.length === 0) return 0
    const completedHabits = habits.filter((h) => h.completedToday).length
    return Math.round((completedHabits / habits.length) * 100)
  }

  const completeHabit = async (habitId: string) => {
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
          // Toggle off if already completed
          await toggleHabitOff(habitId)
          return
        }
        throw new Error(error.error || 'Failed to complete habit')
      }

      const data = await response.json()

      // Update local state with new streak
      setHabits((prevHabits) =>
        prevHabits.map((habit) => {
          if (habit.id === habitId) {
            const today = new Date().toISOString().split('T')[0]
            setHabitHistory((prev) => ({
              ...prev,
              [today]: 1.0, // Full completion when habit is completed
            }))

            const newXP = totalXP + habit.xpReward
            const newLevel = calculateLevel(newXP)

            setTotalXP(newXP)

            if (newLevel > level) {
              setLevel(newLevel)
              setShowLevelUp(true)
              setTimeout(() => setShowLevelUp(false), 3000)
            }

            return {
              ...habit,
              completedToday: true,
              streak: data.habit.currentStreak,
            }
          }
          return habit
        })
      )
    } catch (error) {
      console.error('Error completing habit:', error)
    }
  }

  const toggleHabitOff = async (habitId: string) => {
    // For now, just update local state
    // In the future, you could create an endpoint to toggle off
    setHabits((prevHabits) =>
      prevHabits.map((habit) => {
        if (habit.id === habitId) {
          const today = new Date().toISOString().split('T')[0]
          setHabitHistory((prev) => ({
            ...prev,
            [today]: 0,
          }))

          return {
            ...habit,
            completedToday: false,
          }
        }
        return habit
      })
    )
  }

  const addCustomHabit = (habitData: {
    name: string
    iconName: string // Changed from icon to iconName
    color: string
    xpReward: number
  }) => {
    const totalHabitsCount = habits.length

    if (!isPremium && totalHabitsCount >= 3) {
      setShowSubscription(true)
      return
    }

    const newHabit: Habit = {
      color: habitData.color,
      completedToday: false,
      iconName: habitData.iconName, // Using iconName instead of icon
      id: Date.now().toString(),
      isCustom: true,
      name: habitData.name,
      streak: 0,
      xpReward: habitData.xpReward,
    }

    setHabits((prevHabits) => [...prevHabits, newHabit])
  }

  const deleteHabit = (habitId: string) => {
    setHabits((prevHabits) =>
      prevHabits.filter((habit) => habit.id !== habitId)
    )
  }

  const handleSubscribe = () => {
    setIsPremium(true)
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
    <div className="bg-background min-h-screen">
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
              {isPremium && <Crown className="h-5 w-5 text-yellow-500" />}
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
          level={level}
          totalXP={totalXP}
          completedToday={completedToday}
          totalHabits={totalHabits}
          totalStreak={calculateTotalStreak()}
          weeklyCompletion={calculateWeeklyCompletion()}
        />

        <LevelProgress
          currentXP={getCurrentLevelXP(totalXP, level)}
          xpForNextLevel={getXPForNextLevel(level)}
          level={level}
        />

        {showLevelUp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-card animate-bounce rounded-2xl p-8 text-center">
              <div className="mb-4 text-6xl">🎉</div>
              <h2 className="text-primary mb-2 text-2xl font-bold">
                Level {level}!
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
              {!isPremium && (
                <span className="text-muted-foreground text-xs">
                  {habits.length}/3
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
            <div key={habit.id} className="relative">
              <HabitCard
                habit={habit}
                onComplete={() => completeHabit(habit.id)}
                icon={getIconComponent(habit.iconName)}
              />
              {editMode && habit.isCustom && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 z-10"
                  onClick={() => deleteHabit(habit.id)}
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
      </div>
    </div>
  )
}
