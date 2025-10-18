'use client'

import type React from 'react'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
} from 'lucide-react'

interface AddHabitModalProps {
  isOpen: boolean
  onClose: () => void
  onAddHabit: (habit: {
    name: string
    iconName: string // Changed from icon to iconName
    color: string
    xpReward: number
  }) => void | Promise<void>
}

const iconOptions = [
  {
    color: 'bg-red-500',
    icon: <Heart className="h-6 w-6" />,
    iconName: 'Heart',
    name: 'Heart',
  },
  {
    color: 'bg-yellow-500',
    icon: <Zap className="h-6 w-6" />,
    iconName: 'Zap',
    name: 'Zap',
  },
  {
    color: 'bg-blue-500',
    icon: <BookOpen className="h-6 w-6" />,
    iconName: 'BookOpen',
    name: 'Book',
  },
  {
    color: 'bg-green-500',
    icon: <Target className="h-6 w-6" />,
    iconName: 'Target',
    name: 'Target',
  },
  {
    color: 'bg-purple-500',
    icon: <Trophy className="h-6 w-6" />,
    iconName: 'Trophy',
    name: 'Trophy',
  },
  {
    color: 'bg-orange-500',
    icon: <Coffee className="h-6 w-6" />,
    iconName: 'Coffee',
    name: 'Coffee',
  },
  {
    color: 'bg-indigo-500',
    icon: <Moon className="h-6 w-6" />,
    iconName: 'Moon',
    name: 'Moon',
  },
  {
    color: 'bg-pink-500',
    icon: <Smile className="h-6 w-6" />,
    iconName: 'Smile',
    name: 'Smile',
  },
  {
    color: 'bg-teal-500',
    icon: <Music className="h-6 w-6" />,
    iconName: 'Music',
    name: 'Music',
  },
  {
    color: 'bg-cyan-500',
    icon: <Camera className="h-6 w-6" />,
    iconName: 'Camera',
    name: 'Camera',
  },
]

export function AddHabitModal({
  isOpen,
  onClose,
  onAddHabit,
}: AddHabitModalProps) {
  const [habitName, setHabitName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState(iconOptions[0])
  const [xpReward, setXpReward] = useState(10)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!habitName.trim()) {
      setError('Por favor ingresa un nombre para el hábito')
      return
    }

    if (habitName.trim().length < 3) {
      setError('El nombre debe tener al menos 3 caracteres')
      return
    }

    if (xpReward < 5 || xpReward > 50) {
      setError('Los puntos XP deben estar entre 5 y 50')
      return
    }

    onAddHabit({
      color: selectedIcon.color,
      iconName: selectedIcon.iconName, // Using iconName instead of icon
      name: habitName.trim(),
      xpReward,
    })

    // Reset form
    setHabitName('')
    setSelectedIcon(iconOptions[0])
    setXpReward(10)
    setError('')
    onClose()
  }

  const handleClose = () => {
    setHabitName('')
    setSelectedIcon(iconOptions[0])
    setXpReward(10)
    setError('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Add New Habit</DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            Create a custom habit for your daily routine
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Habit Name */}
          <div className="space-y-2">
            <label className="text-foreground text-sm font-medium">
              Habit name
            </label>
            <Input
              type="text"
              placeholder="Ej: Take vitamins, Walk 15 min..."
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              maxLength={50}
            />
            <p className="text-muted-foreground text-xs">
              {habitName.length}/50 characters
            </p>
          </div>

          {/* Icon Selection */}
          <div className="space-y-3">
            <label className="text-foreground text-sm font-medium">
              Choose an icon
            </label>
            <div className="grid grid-cols-5 gap-2">
              {iconOptions.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedIcon(option)}
                  className={`rounded-lg border-2 p-3 transition-all ${
                    selectedIcon.name === option.name
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div
                    className={`h-8 w-8 rounded-full ${option.color} mx-auto flex items-center justify-center text-white`}
                  >
                    {option.icon}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* XP Reward */}
          <div className="space-y-2">
            <label className="text-foreground text-sm font-medium">
              XP Points (5-50)
            </label>
            <Input
              type="number"
              min="5"
              max="50"
              value={xpReward}
              onChange={(e) => setXpReward(Number(e.target.value))}
            />
            <p className="text-muted-foreground text-xs">
              More points for harder habits
            </p>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <label className="text-foreground text-sm font-medium">
              Preview
            </label>
            <Card className="p-3">
              <div className="flex items-center gap-3">
                <div
                  className={`h-12 w-12 rounded-full ${selectedIcon.color} flex items-center justify-center text-white`}
                >
                  {selectedIcon.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-foreground font-medium">
                    {habitName || 'Habit name'}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    +{xpReward} XP
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {error && (
            <div className="text-destructive bg-destructive/10 rounded-md p-3 text-sm">
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
  )
}
