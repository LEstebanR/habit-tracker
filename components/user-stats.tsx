import { Card } from "@/components/ui/card";
import { Trophy, Target, Zap, Calendar, TrendingUp } from "lucide-react";

interface UserStatsProps {
  level: number;
  totalXP: number;
  completedToday: number;
  totalHabits: number;
  totalStreak?: number;
  weeklyCompletion?: number;
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
    <div className="space-y-4 mb-6">
      {/* Main Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <Trophy className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="text-lg font-bold text-foreground">{level}</div>
          <div className="text-xs text-muted-foreground">Nivel</div>
        </Card>

        <Card className="p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div className="text-lg font-bold text-foreground">{totalXP}</div>
          <div className="text-xs text-muted-foreground">XP Total</div>
        </Card>

        <Card className="p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <Target className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-lg font-bold text-foreground">
            {completedToday}/{totalHabits}
          </div>
          <div className="text-xs text-muted-foreground">Hoy</div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <Calendar className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-base font-bold text-foreground">
            {totalStreak}
          </div>
          <div className="text-xs text-muted-foreground">Racha Total</div>
        </Card>

        <Card className="p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-base font-bold text-foreground">
            {weeklyCompletion}%
          </div>
          <div className="text-xs text-muted-foreground">Esta Semana</div>
        </Card>
      </div>
    </div>
  );
}
