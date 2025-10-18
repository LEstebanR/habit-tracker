import type React from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Check,
  Flame,
  Heart,
  Zap,
  BookOpen,
  Target,
  Trophy,
  Coffee,
  Moon,
  Smile,
  Music,
  Camera,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Habit } from '@/components/habits-app'

interface HabitCardProps {
  habit: Habit
  onComplete: () => void
  icon?: React.ReactNode
}

const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    BookOpen: <BookOpen className="h-6 w-6" />,
    Camera: <Camera className="h-6 w-6" />,
    Coffee: <Coffee className="h-6 w-6" />,
    Heart: <Heart className="h-6 w-6" />,
    Moon: <Moon className="h-6 w-6" />,
    Music: <Music className="h-6 w-6" />,
    Smile: <Smile className="h-6 w-6" />,
    Target: <Target className="h-6 w-6" />,
    Trophy: <Trophy className="h-6 w-6" />,
    Zap: <Zap className="h-6 w-6" />,
  }
  return iconMap[iconName] || <Heart className="h-6 w-6" />
}

export function HabitCard({ habit, onComplete, icon }: HabitCardProps) {
  return (
    <Card
      className={cn(
        'p-4 transition-all duration-200 hover:shadow-md',
        habit.completedToday &&
          'border-green-500/50 bg-green-50 dark:border-green-500/30 dark:bg-green-950/20'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={cn(
              'flex items-center justify-center rounded-full p-2 text-white',
              habit.color
            )}
          >
            {icon || getIconComponent(habit.iconName)}
          </div>
          <div>
            <h3
              className={cn(
                'font-medium',
                habit.completedToday && 'text-muted-foreground line-through'
              )}
            >
              {habit.name}
            </h3>
            <div className="text-muted-foreground flex items-center space-x-2 text-sm">
              <div className="flex items-center space-x-1">
                <Flame className="h-4 w-4 text-orange-500" />
                <span>{habit.streak}</span>
              </div>
              <span>•</span>
              <span>{habit.xpReward} XP</span>
            </div>
          </div>
        </div>

        <Button
          onClick={onComplete}
          disabled={habit.completedToday}
          size="sm"
          className={cn(
            'h-10 w-10 rounded-full p-0',
            habit.completedToday
              ? 'bg-green-500 hover:bg-green-500'
              : 'bg-primary hover:bg-primary/90'
          )}
        >
          <Check className="h-5 w-5" />
        </Button>
      </div>
    </Card>
  )
}
