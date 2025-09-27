import { Card } from '@/components/ui/card'
import { Trophy, Target, Zap, Calendar, TrendingUp } from 'lucide-react'

interface UserStatsProps {
  level: number
  totalXP: number
  completedToday: number
  totalHabits: number
  totalStreak?: number
  weeklyCompletion?: number
}

export function UserStats({
  level,
  totalXP,
  completedToday,
  totalHabits,
  totalStreak = 0,
  weeklyCompletion = 0,
}: UserStatsProps) {
  return (
    <div className="mb-6 space-y-4">
      {/* Main Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3 text-center">
          <div className="mb-1 flex items-center justify-center">
            <Trophy className="h-8 w-8 text-yellow-500" />
          </div>
          <div className="text-foreground text-2xl font-bold">{level}</div>
          <div className="text-md text-muted-foreground">Level</div>
        </Card>

        <Card className="p-3 text-center">
          <div className="mb-1 flex items-center justify-center">
            <Zap className="text-primary h-8 w-8" />
          </div>
          <div className="text-foreground text-2xl font-bold">{totalXP}</div>
          <div className="text-md text-muted-foreground">XP Total</div>
        </Card>

        <Card className="p-3 text-center">
          <div className="mb-1 flex items-center justify-center">
            <Target className="h-8 w-8 text-green-500" />
          </div>
          <div className="text-foreground text-2xl font-bold">
            {completedToday}/{totalHabits}
          </div>
          <div className="text-md text-muted-foreground">Today</div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3 text-center">
          <div className="mb-1 flex items-center justify-center">
            <Calendar className="h-8 w-8 text-orange-500" />
          </div>
          <div className="text-foreground text-2xl font-bold">
            {totalStreak}
          </div>
          <div className="text-md text-muted-foreground">Total Streak</div>
        </Card>

        <Card className="p-3 text-center">
          <div className="mb-1 flex items-center justify-center">
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
          <div className="text-foreground text-2xl font-bold">
            {weeklyCompletion}%
          </div>
          <div className="text-md text-muted-foreground">This Week</div>
        </Card>
      </div>
    </div>
  )
}
