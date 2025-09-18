import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface LevelProgressProps {
  currentXP: number;
  xpForNextLevel: number;
  level: number;
}

export function LevelProgress({
  currentXP,
  xpForNextLevel,
  level,
}: LevelProgressProps) {
  const progressPercentage = (currentXP / xpForNextLevel) * 100;

  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-md font-medium text-foreground">
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
  );
}
