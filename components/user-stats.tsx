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
            <Trophy className="w-8 h-8 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">{level}</div>
          <div className="text-md text-muted-foreground">Level</div>
        </Card>

        <Card className="p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <Zap className="w-8 h-8 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground">{totalXP}</div>
          <div className="text-md text-muted-foreground">XP Total</div>
        </Card>

        <Card className="p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <Target className="w-8 h-8 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {completedToday}/{totalHabits}
          </div>
          <div className="text-md text-muted-foreground">Today</div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <Calendar className="w-8 h-8 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {totalStreak}
          </div>
          <div className="text-md text-muted-foreground">Total Streak</div>
        </Card>

        <Card className="p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {weeklyCompletion}%
          </div>
          <div className="text-md text-muted-foreground">This Week</div>
        </Card>
      </div>
    </div>
  );
}
