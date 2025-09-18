"use client";
import { X } from "lucide-react"; // Added import for X icon
import { Crown } from "lucide-react"; // Added import for Crown icon
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
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useState, useEffect } from "react";
import { HabitCard } from "./habit-card";
import { UserStats } from "./user-stats";
import { LevelProgress } from "@/components/level-progress";
import { AddHabitModal } from "@/components/modals/add-habit-modal";
import { Button } from "@/components/ui/button";
import { SubscriptionModal } from "@/components/modals/subscription-modal";
import { HabitCalendar } from "./habit-calendar";

export interface Habit {
  id: string;
  name: string;
  iconName: string; // Changed from icon: React.ReactNode to iconName: string
  streak: number;
  completedToday: boolean;
  color: string;
  xpReward: number;
  isCustom?: boolean;
}

interface User {
  id: string;
  email: string;
  name: string;
}

interface HabitsAppProps {
  user: User;
  onLogout: () => void;
  isDemoMode?: boolean;
}

const defaultHabits: Habit[] = [
  {
    id: "1",
    name: "Drink 8 glasses of water",
    iconName: "Heart", // Using string identifier instead of React element
    streak: 0,
    completedToday: false,
    color: "bg-blue-500",
    xpReward: 10,
    isCustom: true,
  },
  {
    id: "2",
    name: "Exercise for 30 min",
    iconName: "Zap",
    streak: 0,
    completedToday: false,
    color: "bg-green-500",
    xpReward: 15,
    isCustom: true,
  },
  {
    id: "3",
    name: "Read 20 pages",
    iconName: "BookOpen",
    streak: 0,
    completedToday: false,
    color: "bg-purple-500",
    xpReward: 12,
    isCustom: true,
  },
];

const demoHabits: Habit[] = [
  {
    id: "1",
    name: "Drink 8 glasses of water",
    iconName: "Heart",
    streak: 5,
    completedToday: true,
    color: "bg-blue-500",
    xpReward: 10,
    isCustom: true,
  },
  {
    id: "2",
    name: "Exercise for 30 min",
    iconName: "Zap",
    streak: 3,
    completedToday: false,
    color: "bg-green-500",
    xpReward: 15,
    isCustom: true,
  },
  {
    id: "3",
    name: "Read 20 pages",
    iconName: "BookOpen",
    streak: 7,
    completedToday: true,
    color: "bg-purple-500",
    xpReward: 12,
    isCustom: true,
  },
];

export function HabitsApp({
  user,
  onLogout,
  isDemoMode = false,
}: HabitsAppProps) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [totalXP, setTotalXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [habitHistory, setHabitHistory] = useState<Record<string, number>>({});

  useEffect(() => {
    if (user) {
      if (isDemoMode) {
        setHabits(demoHabits);
        setTotalXP(180); // Demo XP to show level 2
        setLevel(2);
        setIsPremium(false);
        const demoHistory: Record<string, number> = {};
        const today = new Date();
        for (let i = 0; i < 365; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const dateString = date.toISOString().split("T")[0];

          const dayOfWeek = date.getDay();
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
          const weekNumber = Math.floor(i / 7);

          // Base completion percentage (much lower than before)
          let baseCompletion = Math.random() * 0.4 + 0.1; // 10% to 50% base

          if (isWeekend) baseCompletion *= 0.7; // Even lower on weekends
          if (weekNumber % 4 === 0) baseCompletion *= 1.3; // Slightly better some weeks
          if (weekNumber % 8 === 7) baseCompletion *= 0.5; // Really bad weeks occasionally

          // Add some randomness and ensure it stays within 0-1 range
          let finalCompletion = Math.min(
            1,
            baseCompletion + (Math.random() - 0.5) * 0.2
          );

          // Round to nearest 10% to make it cleaner
          finalCompletion = Math.round(finalCompletion * 10) / 10;

          demoHistory[dateString] = finalCompletion;
        }
        setHabitHistory(demoHistory);
      } else {
        const userDataKey = `habit-tracker-data-${user.id}`;
        const savedData = localStorage.getItem(userDataKey);

        if (savedData) {
          const data = JSON.parse(savedData);
          setHabits(data.habits || defaultHabits);
          setTotalXP(data.totalXP || 0);
          setLevel(data.level || 1);
          setIsPremium(data.isPremium || false);
          setHabitHistory(data.habitHistory || {});
        } else {
          setHabits(defaultHabits);
          setTotalXP(0);
          setLevel(1);
          setIsPremium(false);
          setHabitHistory({});
        }
      }
    }
  }, [user, isDemoMode]);

  useEffect(() => {
    if (user && habits.length > 0 && !isDemoMode) {
      const userDataKey = `habit-tracker-data-${user.id}`;
      const dataToSave = {
        habits,
        totalXP,
        level,
        isPremium,
        habitHistory,
      };
      localStorage.setItem(userDataKey, JSON.stringify(dataToSave));
    }
  }, [user, habits, totalXP, level, isPremium, habitHistory, isDemoMode]);

  const calculateLevel = (xp: number) => Math.floor(xp / 100) + 1;
  const getXPForNextLevel = (currentLevel: number) => currentLevel * 100;
  const getCurrentLevelXP = (xp: number, level: number) =>
    xp - (level - 1) * 100;

  const calculateTotalStreak = () => {
    return habits.reduce((total, habit) => total + habit.streak, 0);
  };

  const calculateWeeklyCompletion = () => {
    if (habits.length === 0) return 0;
    const completedHabits = habits.filter((h) => h.completedToday).length;
    return Math.round((completedHabits / habits.length) * 100);
  };

  const completeHabit = (habitId: string) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) => {
        if (habit.id === habitId && !habit.completedToday) {
          const today = new Date().toISOString().split("T")[0];
          setHabitHistory((prev) => ({
            ...prev,
            [today]: 1.0, // Full completion when habit is completed
          }));

          const newXP = totalXP + habit.xpReward;
          const newLevel = calculateLevel(newXP);

          setTotalXP(newXP);

          if (newLevel > level) {
            setLevel(newLevel);
            setShowLevelUp(true);
            setTimeout(() => setShowLevelUp(false), 3000);
          }

          return {
            ...habit,
            completedToday: true,
            streak: habit.streak + 1,
          };
        }
        return habit;
      })
    );
  };

  const addCustomHabit = (habitData: {
    name: string;
    iconName: string; // Changed from icon to iconName
    color: string;
    xpReward: number;
  }) => {
    const totalHabitsCount = habits.length;

    if (!isPremium && totalHabitsCount >= 3) {
      setShowSubscription(true);
      return;
    }

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: habitData.name,
      iconName: habitData.iconName, // Using iconName instead of icon
      streak: 0,
      completedToday: false,
      color: habitData.color,
      xpReward: habitData.xpReward,
      isCustom: true,
    };

    setHabits((prevHabits) => [...prevHabits, newHabit]);
  };

  const deleteHabit = (habitId: string) => {
    setHabits((prevHabits) =>
      prevHabits.filter((habit) => habit.id !== habitId)
    );
  };

  const handleSubscribe = () => {
    setIsPremium(true);
  };

  const completedToday = habits.filter((h) => h.completedToday).length;
  const totalHabits = habits.length;

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Heart":
        return <Heart className="w-6 h-6" />;
      case "Zap":
        return <Zap className="w-6 h-6" />;
      case "BookOpen":
        return <BookOpen className="w-6 h-6" />;
      case "Trophy":
        return <Trophy className="w-6 h-6" />;
      case "Target":
        return <Target className="w-6 h-6" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-md">
        {isDemoMode && (
          <div className="mb-4 p-3 bg-orange-100 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <div className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">
                Demo Mode - Changes are not saved
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              Hello, {user.name}!
              {isPremium && <Crown className="w-5 h-5 text-yellow-500" />}
            </h1>
            <p className="text-sm text-muted-foreground">Build your habits</p>
          </div>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={onLogout}>
                  <LogOut className="w-4 h-4" />
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
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-card p-8 rounded-2xl text-center animate-bounce">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-primary mb-2">
                Level {level}!
              </h2>
              <p className="text-muted-foreground">Keep it up, champion!</p>
            </div>
          </div>
        )}

        <HabitCalendar habitHistory={habitHistory} className="mb-6" />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              Habits of today
            </h2>
            <div className="flex items-center gap-2">
              {!isPremium && (
                <span className="text-xs text-muted-foreground">
                  {habits.length}/3
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditMode(!editMode)}
                className={editMode ? "text-destructive" : ""}
              >
                {editMode ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddHabit(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
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
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}

          {habits.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                You don't have any habits yet
              </p>
              <Button onClick={() => setShowAddHabit(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add your first habit
              </Button>
            </div>
          )}
        </div>

        <div className="mt-8 p-4 bg-card rounded-xl text-center">
          <p className="text-sm text-muted-foreground">
            {completedToday === totalHabits && totalHabits > 0
              ? "🎉 Incredible! You completed all your habits today"
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
  );
}
