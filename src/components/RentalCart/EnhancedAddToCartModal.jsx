"use client"

import { useState, useEffect } from "react"
import { X, Calendar, Clock, MapPin, AlertCircle, CreditCard, Zap } from "lucide-react"
import { useRentalCart } from "../../contexts/RentalCartContext.jsx"
import { useRentalPricing } from "../../hooks/useRentalPricing.js"

const EnhancedAddToCartModal = ({ isOpen, onClose, vehicle, onLoginRequired }) => {
  const { addToCart, loading, error } = useRentalCart()
  const { pricing, isAvailable, formatPrice, calculatePrice } = useRentalPricing(vehicle?.tipo || "bicicleta")

  const [rentalType, setRentalType] = useState("hourly")
  const [startDateTime, setStartDateTime] = useState("")
  const [duration, setDuration] = useState(1)
  const [endDateTime, setEndDateTime] = useState("")
  const [selectedStartStation, setSelectedStartStation] = useState("")
  const [selectedEndStation, setSelectedEndStation] = useState("")
  const [currentPrice, setCurrentPrice] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const stations = [
    { id: 1, name: "Estación Centro", address: "Av. Principal 123", available: true, distance: "0.5 km" },
    { id: 2, name: "Estación Norte", address: "Calle Norte 456", available: true, distance: "1.2 km" },
    { id: 3, name: "Estación Sur", address: "Av. Sur 789", available: true, distance: "0.8 km" },
    { id: 4, name: "Estación Este", address: "Blvd. Este 321", available: false, distance: "2.1 km" },
    { id: 5, name: "Estación Oeste", address: "Calle Oeste 654", available: true, distance: "1.5 km" },
  ]

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
      // Reset form when modal opens
      setRentalType("hourly")
      setDuration(1)
      setStartDateTime("")
      setEndDateTime("")
      setSelectedStartStation("")
      setSelectedEndStation("")
    } else {
      setIsAnimating(false)
    }
  }, [isOpen])

  useEffect(() => {
    if (startDateTime && duration) {
      const start = new Date(startDateTime)
      const end = new Date(start)

      if (rentalType === "hourly") {
        end.setHours(end.getHours() + duration)
      } else {
        end.setDate(end.getDate() + duration)
      }

      setEndDateTime(end.toISOString().slice(0, 16))
    }
  }, [startDateTime, duration, rentalType])

  useEffect(() => {
    if (pricing && duration) {
      const basePrice = calculatePrice(rentalType, duration)
      setCurrentPrice(basePrice)
    }
  }, [pricing, rentalType, duration, calculatePrice])

  const handleRentalTypeChange = (newType) => {
    setRentalType(newType)
    setDuration(1)
  }

  const handleAddToCart = async () => {
    if (!vehicle || !startDateTime || !endDateTime || !selectedStartStation) {
      return
    }

    const isLoggedIn = localStorage.getItem("ecomove_user_token") // Mock auth check
    if (!isLoggedIn) {
      onLoginRequired && onLoginRequired()
      return
    }

    try {
      const rentalData = {
        vehicleId: vehicle.id,
        vehicleType: vehicle.tipo,
        vehicleName: vehicle.name,
        rentalType,
        startDateTime,
        endDateTime,
        duration,
        startStationId: selectedStartStation,
        endStationId: selectedEndStation,
        basePrice: currentPrice,
        pricePerHour: pricing?.hourly || 0,
        pricePerDay: pricing?.daily || 0,
      }

      await addToCart(vehicle.id, vehicle.tipo, vehicle.name, rentalType, startDateTime, endDateTime, rentalData)

      onClose()
    } catch (error) {
      console.error("Error adding to cart:", error)
    }
  }

  const isFormValid = startDateTime && endDateTime && selectedStartStation && duration > 0

  if (!isOpen || !vehicle) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className={`bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-500 ${
          isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{vehicle.name}</h2>
                <p className="text-green-600 font-medium capitalize">{vehicle.tipo} Eléctrico</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {!isAvailable ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
              <div>
                <p className="text-yellow-800 font-medium">Vehículo no disponible</p>
                <p className="text-yellow-700 text-sm">
                  {pricing?.message || "Este vehículo no está disponible actualmente"}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  <span>Tipo de Alquiler</span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleRentalTypeChange("hourly")}
                    className={`p-6 rounded-xl border-2 text-center transition-all duration-300 hover:scale-105 ${
                      rentalType === "hourly"
                        ? "border-green-600 bg-green-50 text-green-700 shadow-lg"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <Clock className="w-8 h-8 mx-auto mb-3 text-green-600" />
                    <div className="text-lg font-semibold">Por Hora</div>
                    <div className="text-2xl font-bold text-green-600 mt-2">{formatPrice(pricing?.hourly || 0)}</div>
                    <div className="text-sm text-gray-500 mt-1">Ideal para trayectos cortos</div>
                  </button>
                  <button
                    onClick={() => handleRentalTypeChange("daily")}
                    className={`p-6 rounded-xl border-2 text-center transition-all duration-300 hover:scale-105 ${
                      rentalType === "daily"
                        ? "border-green-600 bg-green-50 text-green-700 shadow-lg"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <Calendar className="w-8 h-8 mx-auto mb-3 text-green-600" />
                    <div className="text-lg font-semibold">Por Día</div>
                    <div className="text-2xl font-bold text-green-600 mt-2">{formatPrice(pricing?.daily || 0)}</div>
                    <div className="text-sm text-gray-500 mt-1">Mejor precio para uso prolongado</div>
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-green-600" />
                    <span>Fecha y Hora de Inicio</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={startDateTime}
                    onChange={(e) => setStartDateTime(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Duración ({rentalType === "hourly" ? "Horas" : "Días"})
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={rentalType === "hourly" ? 24 : 30}
                    value={duration}
                    onChange={(e) => setDuration(Number.parseInt(e.target.value) || 1)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {endDateTime && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-green-600" />
                    <span className="text-green-800 font-medium">Fecha y Hora de Fin:</span>
                    <span className="text-green-900 font-bold">
                      {new Date(endDateTime).toLocaleString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <span>Estaciones</span>
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estación de Recogida</label>
                    <select
                      value={selectedStartStation}
                      onChange={(e) => setSelectedStartStation(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    >
                      <option value="">Selecciona una estación</option>
                      {stations
                        .filter((station) => station.available)
                        .map((station) => (
                          <option key={station.id} value={station.id}>
                            {station.name} - {station.address} ({station.distance})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estación de Devolución (Opcional)
                    </label>
                    <select
                      value={selectedEndStation}
                      onChange={(e) => setSelectedEndStation(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    >
                      <option value="">Misma estación de recogida</option>
                      {stations
                        .filter((station) => station.available)
                        .map((station) => (
                          <option key={station.id} value={station.id}>
                            {station.name} - {station.address} ({station.distance})
                          </option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Si no seleccionas una estación diferente, deberás devolver el vehículo en la misma estación de
                      recogida
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-green-800 font-semibold text-lg">Precio Base:</span>
                    <span className="text-3xl font-bold text-green-600">{formatPrice(currentPrice)}</span>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="text-yellow-800 font-medium">Importante sobre el tiempo extra:</p>
                        <p className="text-yellow-700 mt-1">
                          Si no devuelves el vehículo a la hora estimada, el precio seguirá incrementándose
                          automáticamente hasta que completes la devolución.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-2xl">
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            {isAvailable && (
              <button
                onClick={handleAddToCart}
                disabled={loading || !isFormValid}
                className="flex-2 bg-green-600 text-white py-4 px-8 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Agregando...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Agregar al Carrito</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnhancedAddToCartModal
 