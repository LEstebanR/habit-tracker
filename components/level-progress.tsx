import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface LevelProgressProps {
  currentXP: number
  xpForNextLevel: number
  level: number
}

export function LevelProgress({
  currentXP,
  xpForNextLevel,
  level,
}: LevelProgressProps) {
  const progressPercentage = (currentXP / xpForNextLevel) * 100

  return (
    <Card className="mb-6 p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-md text-foreground font-medium">
          Level {level}
        </span>
        <span className="text-md text-muted-foreground">
          {currentXP}/{xpForNextLevel} XP
        </span>
      </div>
      <Progress value={progressPercentage} className="h-2" />
      <div className="text-md text-muted-foreground mt-1 text-center">
        {xpForNextLevel - currentXP} XP for the next level
      </div>
    </Card>
  )
}
