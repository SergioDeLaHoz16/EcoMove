"use client"

import { useState, useEffect } from "react"
import { Clock, MapPin, User, CheckCircle } from "lucide-react"
import { rentalService } from "../../services/RentalService.js"
import { useRentalTimer } from "../../hooks/useRentalTimer.js"
import { PricingService } from "../../services/PricingService.js"

const ActiveRentalCard = ({ rental, onEndRental }) => {
  const { formattedElapsed, isExpired } = useRentalTimer(rental.actualStartTime, rental.endTime)
  const [isEnding, setIsEnding] = useState(false)

  const handleEndRental = async () => {
    setIsEnding(true)
    try {
      await onEndRental(rental.id)
    } catch (error) {
      console.error("Error ending rental:", error)
    } finally {
      setIsEnding(false)
    }
  }

  return (
    <div
      className={`bg-white border rounded-lg p-4 space-y-3 ${isExpired ? "border-red-200 bg-red-50" : "border-gray-200"}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{rental.vehicleName}</h3>
          <p className="text-sm text-gray-600 capitalize">{rental.vehicleType}</p>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            isExpired ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}
        >
          {isExpired ? "Vencido" : "Activo"}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center space-x-2 text-gray-600">
          <Clock className="w-4 h-4" />
          <span>Tiempo transcurrido: {formattedElapsed}</span>
        </div>

        <div className="flex items-center space-x-2 text-gray-600">
          <User className="w-4 h-4" />
          <span>ID: {rental.id.slice(-8)}</span>
        </div>

        <div className="flex items-center space-x-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>Tipo: {rental.rentalType === "hourly" ? "Por Hora" : "Por Día"}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <span className="font-bold text-green-600">{PricingService.formatPrice(rental.totalPrice)}</span>
        <button
          onClick={handleEndRental}
          disabled={isEnding}
          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50 flex items-center space-x-1"
        >
          <CheckCircle className="w-4 h-4" />
          <span>{isEnding ? "Finalizando..." : "Finalizar"}</span>
        </button>
      </div>
    </div>
  )
}

const ActiveRentalsPanel = () => {
  const [activeRentals, setActiveRentals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadActiveRentals()
    const interval = setInterval(loadActiveRentals, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const loadActiveRentals = () => {
    try {
      const rentals = rentalService.getActiveRentals()
      setActiveRentals(rentals)
    } catch (error) {
      console.error("Error loading active rentals:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEndRental = async (rentalId) => {
    try {
      const endedRental = rentalService.endRental(rentalId, "station-1") // In real app, select station
      rentalService.saveRentalToHistory(endedRental)
      loadActiveRentals() // Refresh the list
    } catch (error) {
      throw error
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Alquileres Activos</h2>
        <p className="text-sm text-gray-600">
          {activeRentals.length} alquiler{activeRentals.length !== 1 ? "es" : ""} en curso
        </p>
      </div>

      <div className="p-6">
        {activeRentals.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay alquileres activos</h3>
            <p className="text-gray-600">Los alquileres activos aparecerán aquí</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeRentals.map((rental) => (
              <ActiveRentalCard key={rental.id} rental={rental} onEndRental={handleEndRental} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ActiveRentalsPanel
