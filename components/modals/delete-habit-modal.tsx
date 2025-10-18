'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AlertTriangle } from 'lucide-react'

interface DeleteHabitModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  habitName: string
  isDeleting: boolean
}

export function DeleteHabitModal({
  isOpen,
  onClose,
  onConfirm,
  habitName,
  isDeleting,
}: DeleteHabitModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-destructive h-5 w-5" />
            <DialogTitle>Delete Habit</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to delete &quot;{habitName}&quot;? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="flex-1"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
