"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Crown, Check, X } from "lucide-react"

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubscribe: () => void
}

export function SubscriptionModal({ isOpen, onClose, onSubscribe }: SubscriptionModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubscribe = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    setTimeout(() => {
      onSubscribe()
      setIsProcessing(false)
      onClose()
    }, 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center">
            <Crown className="w-5 h-5 text-yellow-500" />
            Desbloquea Hábitos Ilimitados
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">$2 USD</div>
            <p className="text-sm text-muted-foreground">Pago único - Sin suscripciones</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-sm">Hábitos ilimitados</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-sm">Gráficas avanzadas</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-sm">Estadísticas detalladas</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-sm">Soporte prioritario</span>
            </div>
          </div>

          <div className="bg-muted p-3 rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              Actualmente tienes 3 hábitos gratuitos. Desbloquea hábitos ilimitados para personalizar completamente tu
              experiencia.
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={handleSubscribe}
              disabled={isProcessing}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {isProcessing ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Crown className="w-4 h-4 mr-2" />
              )}
              {isProcessing ? "Procesando..." : "Desbloquear"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
