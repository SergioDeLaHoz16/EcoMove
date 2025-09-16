"use client"

import { useState } from "react"
import { X, Calendar, Clock } from "lucide-react"
import { useRentalCart } from "../../contexts/RentalCartContext.jsx"
import { useRentalPricing } from "../../hooks/useRentalPricing.js"

const AddToCartModal = ({ isOpen, onClose, vehicle }) => {
  const { addToCart, loading, error } = useRentalCart()
  const { pricing, isAvailable, formatPrice, calculatePrice } = useRentalPricing(vehicle?.tipo || "bicicleta")

  const [rentalType, setRentalType] = useState("hourly")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [duration, setDuration] = useState(1)

  // Calculate price based on current selections
  const currentPrice = pricing ? calculatePrice(rentalType, duration) : 0

  const handleStartTimeChange = (newStartTime) => {
    setStartTime(newStartTime)

    // Auto-calculate end time based on duration
    if (newStartTime) {
      const start = new Date(newStartTime)
      const end = new Date(start)

      if (rentalType === "hourly") {
        end.setHours(end.getHours() + duration)
      } else {
        end.setDate(end.getDate() + duration)
      }

      setEndTime(end.toISOString().slice(0, 16))
    }
  }

  const handleDurationChange = (newDuration) => {
    setDuration(newDuration)

    // Recalculate end time
    if (startTime) {
      const start = new Date(startTime)
      const end = new Date(start)

      if (rentalType === "hourly") {
        end.setHours(end.getHours() + newDuration)
      } else {
        end.setDate(end.getDate() + newDuration)
      }

      setEndTime(end.toISOString().slice(0, 16))
    }
  }

  const handleRentalTypeChange = (newType) => {
    setRentalType(newType)
    setDuration(1)

    // Recalculate end time with new type
    if (startTime) {
      handleStartTimeChange(startTime)
    }
  }

  const handleAddToCart = async () => {
    if (!vehicle || !startTime || !endTime) return

    try {
      await addToCart(vehicle.id, vehicle.tipo, vehicle.nombre || vehicle.name, rentalType, startTime, endTime)
      onClose()
      // Reset form
      setStartTime("")
      setEndTime("")
      setDuration(1)
    } catch (error) {
      console.error("Error adding to cart:", error)
    }
  }

  if (!isOpen || !vehicle) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Agregar al Carrito</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900">{vehicle.nombre || vehicle.name}</h3>
            <p className="text-sm text-gray-600 capitalize">{vehicle.tipo}</p>
          </div>

          {!isAvailable ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 font-medium">
                {pricing?.message || "Este vehículo no está disponible actualmente"}
              </p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Alquiler</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleRentalTypeChange("hourly")}
                    className={`p-3 rounded-lg border-2 text-center transition-colors ${
                      rentalType === "hourly"
                        ? "border-green-600 bg-green-50 text-green-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Clock className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-sm font-medium">Por Hora</div>
                    <div className="text-xs text-gray-600">{formatPrice(pricing?.hourly || 0)}</div>
                  </button>
                  <button
                    onClick={() => handleRentalTypeChange("daily")}
                    className={`p-3 rounded-lg border-2 text-center transition-colors ${
                      rentalType === "daily"
                        ? "border-green-600 bg-green-50 text-green-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Calendar className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-sm font-medium">Por Día</div>
                    <div className="text-xs text-gray-600">{formatPrice(pricing?.daily || 0)}</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha y Hora de Inicio</label>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => handleStartTimeChange(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duración ({rentalType === "hourly" ? "Horas" : "Días"})
                </label>
                <input
                  type="number"
                  min="1"
                  max={rentalType === "hourly" ? 24 : 30}
                  value={duration}
                  onChange={(e) => handleDurationChange(Number.parseInt(e.target.value) || 1)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {endTime && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha y Hora de Fin</label>
                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              )}

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-green-800 font-medium">Precio Total:</span>
                  <span className="text-xl font-bold text-green-600">{formatPrice(currentPrice)}</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="border-t border-gray-200 p-6">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            {isAvailable && (
              <button
                onClick={handleAddToCart}
                disabled={loading || !startTime || !endTime}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Agregando..." : "Agregar al Carrito"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddToCartModal
