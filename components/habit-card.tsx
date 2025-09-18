"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Habit } from "@/components/habits-app";

interface HabitCardProps {
  habit: Habit;
  onComplete: () => void;
}

const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    Heart: <Heart className="w-6 h-6" />,
    Zap: <Zap className="w-6 h-6" />,
    BookOpen: <BookOpen className="w-6 h-6" />,
    Target: <Target className="w-6 h-6" />,
    Trophy: <Trophy className="w-6 h-6" />,
    Coffee: <Coffee className="w-6 h-6" />,
    Moon: <Moon className="w-6 h-6" />,
    Smile: <Smile className="w-6 h-6" />,
    Music: <Music className="w-6 h-6" />,
    Camera: <Camera className="w-6 h-6" />,
  };
  return iconMap[iconName] || <Heart className="w-6 h-6" />;
};

export function HabitCard({ habit, onComplete }: HabitCardProps) {
  return (
    <Card
      className={cn(
        "p-4 transition-all duration-200 hover:shadow-md",
        habit.completedToday && "bg-muted/50 border-primary/20"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={cn(
              "p-2 rounded-full text-white flex items-center justify-center",
              habit.color
            )}
          >
            {getIconComponent(habit.iconName)}{" "}
            {/* Using icon mapping function */}
          </div>
          <div>
            <h3
              className={cn(
                "font-medium",
                habit.completedToday && "line-through text-muted-foreground"
              )}
            >
              {habit.name}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Flame className="w-4 h-4 text-orange-500" />
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
            "rounded-full w-10 h-10 p-0",
            habit.completedToday
              ? "bg-green-500 hover:bg-green-500"
              : "bg-primary hover:bg-primary/90"
          )}
        >
          <Check className="w-5 h-5" />
        </Button>
      </div>
    </Card>
  );
}
