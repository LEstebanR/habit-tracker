"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
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
  X,
} from "lucide-react";

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHabit: (habit: {
    name: string;
    iconName: string; // Changed from icon to iconName
    color: string;
    xpReward: number;
  }) => void;
}

const iconOptions = [
  {
    iconName: "Heart",
    name: "Heart",
    color: "bg-red-500",
    icon: <Heart className="w-6 h-6" />,
  },
  {
    iconName: "Zap",
    name: "Zap",
    color: "bg-yellow-500",
    icon: <Zap className="w-6 h-6" />,
  },
  {
    iconName: "BookOpen",
    name: "Book",
    color: "bg-blue-500",
    icon: <BookOpen className="w-6 h-6" />,
  },
  {
    iconName: "Target",
    name: "Target",
    color: "bg-green-500",
    icon: <Target className="w-6 h-6" />,
  },
  {
    iconName: "Trophy",
    name: "Trophy",
    color: "bg-purple-500",
    icon: <Trophy className="w-6 h-6" />,
  },
  {
    iconName: "Coffee",
    name: "Coffee",
    color: "bg-orange-500",
    icon: <Coffee className="w-6 h-6" />,
  },
  {
    iconName: "Moon",
    name: "Moon",
    color: "bg-indigo-500",
    icon: <Moon className="w-6 h-6" />,
  },
  {
    iconName: "Smile",
    name: "Smile",
    color: "bg-pink-500",
    icon: <Smile className="w-6 h-6" />,
  },
  {
    iconName: "Music",
    name: "Music",
    color: "bg-teal-500",
    icon: <Music className="w-6 h-6" />,
  },
  {
    iconName: "Camera",
    name: "Camera",
    color: "bg-cyan-500",
    icon: <Camera className="w-6 h-6" />,
  },
];

export function AddHabitModal({
  isOpen,
  onClose,
  onAddHabit,
}: AddHabitModalProps) {
  const [habitName, setHabitName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(iconOptions[0]);
  const [xpReward, setXpReward] = useState(10);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!habitName.trim()) {
      setError("Por favor ingresa un nombre para el hábito");
      return;
    }

    if (habitName.trim().length < 3) {
      setError("El nombre debe tener al menos 3 caracteres");
      return;
    }

    if (xpReward < 5 || xpReward > 50) {
      setError("Los puntos XP deben estar entre 5 y 50");
      return;
    }

    onAddHabit({
      name: habitName.trim(),
      iconName: selectedIcon.iconName, // Using iconName instead of icon
      color: selectedIcon.color,
      xpReward,
    });

    // Reset form
    setHabitName("");
    setSelectedIcon(iconOptions[0]);
    setXpReward(10);
    setError("");
    onClose();
  };

  const handleClose = () => {
    setHabitName("");
    setSelectedIcon(iconOptions[0]);
    setXpReward(10);
    setError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Add New Habit</DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <DialogDescription>
            Create a custom habit for your daily routine
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Habit Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Habit name
            </label>
            <Input
              type="text"
              placeholder="Ej: Take vitamins, Walk 15 min..."
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              maxLength={50}
            />
            <p className="text-xs text-muted-foreground">
              {habitName.length}/50 characters
            </p>
          </div>

          {/* Icon Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Choose an icon
            </label>
            <div className="grid grid-cols-5 gap-2">
              {iconOptions.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedIcon(option)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedIcon.name === option.name
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full ${option.color} flex items-center justify-center text-white mx-auto`}
                  >
                    {option.icon}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* XP Reward */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              XP Points (5-50)
            </label>
            <Input
              type="number"
              min="5"
              max="50"
              value={xpReward}
              onChange={(e) => setXpReward(Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              More points for harder habits
            </p>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Preview
            </label>
            <Card className="p-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full ${selectedIcon.color} flex items-center justify-center text-white`}
                >
                  {selectedIcon.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">
                    {habitName || "Habit name"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    +{xpReward} XP
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Habit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
