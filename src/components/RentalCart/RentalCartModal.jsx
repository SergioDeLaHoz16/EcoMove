"use client"

import { useState } from "react"
import { X, Clock, Calendar, MapPin, Trash2 } from "lucide-react"
import { useRentalCart } from "../../contexts/RentalCartContext.jsx"
import { useRentalPricing } from "../../hooks/useRentalPricing.js"
import { useRentalTimer } from "../../hooks/useRentalTimer.js"
import CheckoutModal from "./CheckoutModal.jsx"

const RentalCartItem = ({ item, onRemove, onUpdateEndTime }) => {
  const { formatPrice } = useRentalPricing(item.vehicleType)
  const { formattedDuration } = useRentalTimer(item.startTime, item.endTime)
  const [isEditing, setIsEditing] = useState(false)
  const [newEndTime, setNewEndTime] = useState(item.endTime)

  const handleUpdateEndTime = () => {
    onUpdateEndTime(item.id, newEndTime)
    setIsEditing(false)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{item.vehicleName}</h3>
          <p className="text-sm text-gray-600 capitalize">{item.vehicleType}</p>
        </div>
        <button onClick={() => onRemove(item.id)} className="text-red-500 hover:text-red-700 p-1">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center space-x-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Inicio: {new Date(item.startTime).toLocaleString("es-CO")}</span>
        </div>

        <div className="flex items-center space-x-2 text-gray-600">
          <Clock className="w-4 h-4" />
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <input
                type="datetime-local"
                value={newEndTime}
                onChange={(e) => setNewEndTime(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-xs"
              />
              <button
                onClick={handleUpdateEndTime}
                className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
              >
                Guardar
              </button>
              <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700 text-xs">
                Cancelar
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span>Fin: {new Date(item.endTime).toLocaleString("es-CO")}</span>
              <button
                onClick={() => setIsEditing(true)}
                className="text-green-600 hover:text-green-700 text-xs underline"
              >
                Editar
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 text-gray-600">
          <Clock className="w-4 h-4" />
          <span>Duración: {formattedDuration}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <span className="text-sm text-gray-600 capitalize">
          Tipo: {item.rentalType === "hourly" ? "Por Hora" : "Por Día"}
        </span>
        <span className="font-bold text-green-600">{formatPrice(item.totalPrice)}</span>
      </div>
    </div>
  )
}

const RentalCartModal = ({ isOpen, onClose }) => {
  const { items, totalPrice, removeFromCart, updateItemEndTime, clearCart } = useRentalCart()
  const { formatPrice } = useRentalPricing("bicicleta") // Use any type for formatting
  const [showCheckout, setShowCheckout] = useState(false)

  const handleStartRental = () => {
    setShowCheckout(true)
  }

  const handleOrderComplete = (createdRentals) => {
    // Clear cart after successful order
    clearCart()
    setShowCheckout(false)
    onClose()

    // Show success message
    alert(`¡${createdRentals.length} reserva(s) creada(s) exitosamente! Revisa tu dashboard para más detalles.`)
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Carrito de Alquiler</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Tu carrito está vacío</h3>
                <p className="text-gray-600">Agrega vehículos para comenzar tu alquiler</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <RentalCartItem
                    key={item.id}
                    item={item}
                    onRemove={removeFromCart}
                    onUpdateEndTime={updateItemEndTime}
                  />
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-green-600">{formatPrice(totalPrice)}</span>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={clearCart}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Limpiar Carrito
                </button>
                <button
                  onClick={handleStartRental}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Proceder al Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        cartItems={items}
        totalPrice={totalPrice}
        onOrderComplete={handleOrderComplete}
      />
    </>
  )
}

export default RentalCartModal
