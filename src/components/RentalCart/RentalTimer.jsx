"use client"

import { useState, useEffect } from "react"
import { Clock, AlertTriangle, CheckCircle } from "lucide-react"
import { useRentalPricing } from "../../hooks/useRentalPricing.js"

const RentalTimer = ({ rental, onTimeUpdate, onOvertime }) => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isOvertime, setIsOvertime] = useState(false)
  const [overtimeMinutes, setOvertimeMinutes] = useState(0)
  const { formatPrice } = useRentalPricing(rental.vehicleType)

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now)

      const endTime = new Date(rental.endDateTime)
      const timeDiff = now - endTime

      if (timeDiff > 0) {
        const overtimeMinutes = Math.floor(timeDiff / (1000 * 60))
        setOvertimeMinutes(overtimeMinutes)
        setIsOvertime(true)

        // Calculate overtime price (50% more per minute)
        const baseHourlyRate = rental.pricing?.hourly || 0
        const overtimeRate = (baseHourlyRate * 1.5) / 60 // Per minute
        const overtimePrice = overtimeMinutes * overtimeRate

        onTimeUpdate({
          ...rental,
          isOvertime: true,
          overtimeMinutes,
          overtimePrice,
          currentTotalPrice: rental.totalPrice + overtimePrice,
        })

        if (overtimeMinutes > 0 && overtimeMinutes % 15 === 0) {
          onOvertime(rental, overtimeMinutes)
        }
      } else {
        setIsOvertime(false)
        setOvertimeMinutes(0)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [rental, onTimeUpdate, onOvertime])

  const getTimeRemaining = () => {
    const endTime = new Date(rental.endDateTime)
    const timeDiff = endTime - currentTime

    if (timeDiff <= 0) return null

    const hours = Math.floor(timeDiff / (1000 * 60 * 60))
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))

    return { hours, minutes }
  }

  const timeRemaining = getTimeRemaining()

  return (
    <div
      className={`p-4 rounded-lg border-2 ${
        isOvertime
          ? "border-destructive bg-destructive/5"
          : timeRemaining && timeRemaining.hours < 1
            ? "border-yellow-500 bg-yellow-50"
            : "border-accent bg-accent/5"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Clock className={`w-5 h-5 ${isOvertime ? "text-destructive" : "text-primary"}`} />
          <span className="font-semibold text-foreground">{rental.vehicleName}</span>
        </div>
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            isOvertime
              ? "bg-destructive text-destructive-foreground"
              : rental.status === "completed"
                ? "bg-accent text-accent-foreground"
                : "bg-primary text-primary-foreground"
          }`}
        >
          {isOvertime ? "Tiempo Excedido" : rental.status === "completed" ? "Completado" : "Activo"}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Inicio:</span>
          <span className="font-medium">{new Date(rental.startDateTime).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Fin programado:</span>
          <span className="font-medium">{new Date(rental.endDateTime).toLocaleString()}</span>
        </div>

        {timeRemaining && !isOvertime && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tiempo restante:</span>
            <span className={`font-medium ${timeRemaining.hours < 1 ? "text-yellow-600" : "text-accent"}`}>
              {timeRemaining.hours}h {timeRemaining.minutes}m
            </span>
          </div>
        )}

        {isOvertime && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tiempo excedido:</span>
            <span className="font-medium text-destructive">
              {Math.floor(overtimeMinutes / 60)}h {overtimeMinutes % 60}m
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-border">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Precio actual:</span>
          <span className={`text-lg font-bold ${isOvertime ? "text-destructive" : "text-primary"}`}>
            {formatPrice(rental.currentTotalPrice || rental.totalPrice)}
          </span>
        </div>

        {isOvertime && (
          <div className="flex items-center space-x-2 mt-2 text-sm text-destructive">
            <AlertTriangle className="w-4 h-4" />
            <span>Cargo adicional: {formatPrice(rental.overtimePrice || 0)}</span>
          </div>
        )}
      </div>

      {rental.status === "completed" && (
        <div className="mt-3 flex items-center space-x-2 text-sm text-accent">
          <CheckCircle className="w-4 h-4" />
          <span>Vehículo devuelto exitosamente</span>
        </div>
      )}
    </div>
  )
}

export default RentalTimer
