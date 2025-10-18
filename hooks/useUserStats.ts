'use client'

import { useState, useEffect, useCallback } from 'react'

export interface UserStats {
  totalXP: number
  level: number
  completedToday: number
  totalHabits: number
  totalStreak: number
  weeklyCompletion: number
}

interface UseUserStatsReturn {
  stats: UserStats | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  updateStats: (updates: Partial<UserStats>) => void
}

export function useUserStats(): UseUserStatsReturn {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const updateStats = (updates: Partial<UserStats>) => {
    setStats((prev) => (prev ? { ...prev, ...updates } : prev))
  }

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/user/stats')

      if (!response.ok) {
        throw new Error('Failed to fetch user stats')
      }

      const data = await response.json()
      setStats(data.stats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      console.error('Error fetching user stats:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
    updateStats,
  }
}
