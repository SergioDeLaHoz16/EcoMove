"use client"

import { useState } from "react"
import { Star, Zap, Battery, Shield } from "lucide-react"
import { useRentalPricing } from "../../hooks/useRentalPricing.js"
import EnhancedAddToCartModal from "../RentalCart/EnhancedAddToCartModal.jsx"

const VehicleCard = ({ vehicle, onAddToCart }) => {
  const { pricing, isAvailable, formatPrice } = useRentalPricing(vehicle.tipo)

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg transition-all duration-300 overflow-hidden group relative hover:shadow-2xl hover:scale-105 ${
        vehicle.featured ? "ring-2 ring-green-500" : ""
      }`}
    >
      <div className="relative">
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
          {vehicle.isNew && (
            <span className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-20">
              Nuevo
            </span>
          )}
          {vehicle.discount && (
            <span className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-20">
              {vehicle.discount}
            </span>
          )}

          <img
            src={vehicle.image || "/placeholder.svg"}
            alt={vehicle.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />

          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1 shadow-lg z-20">
            <div className={`w-2 h-2 rounded-full ${isAvailable ? "bg-green-500 animate-pulse" : "bg-red-500"}`}></div>
            <span className="text-xs font-medium">{isAvailable ? "Disponible" : "Ocupado"}</span>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {[...Array(vehicle.rating)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-xs text-gray-500 ml-1">({vehicle.rating}.0)</span>
            </div>

            <div className="flex items-center space-x-1">
              <Zap className="w-3 h-3 text-green-600" title="Eléctrico" />
              <Battery className="w-3 h-3 text-blue-600" title="Batería de larga duración" />
              <Shield className="w-3 h-3 text-purple-600" title="Seguro incluido" />
            </div>
          </div>

          <h3 className="font-bold text-gray-900 text-sm line-clamp-2">{vehicle.name}</h3>

          {isAvailable ? (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-green-600 font-bold text-sm">{formatPrice(pricing.hourly)}</span>
                <span className="text-xs text-gray-500">por hora</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-green-600 font-bold text-sm">{formatPrice(pricing.daily)}</span>
                <span className="text-xs text-gray-500">por día</span>
              </div>
            </div>
          ) : (
            <div className="text-red-600 font-bold text-sm">{pricing?.message || "No disponible"}</div>
          )}

          <button
            onClick={() => onAddToCart(vehicle)}
            disabled={!isAvailable}
            className={`w-full py-2 rounded-lg font-bold text-sm transition-all duration-300 flex items-center justify-center space-x-1 ${
              isAvailable
                ? vehicle.featured
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                  : "border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isAvailable ? (
              <>
                <Zap className="w-4 h-4" />
                <span>{vehicle.featured ? "Rentar Ahora" : "Rectar Ahora"}</span>
              </>
            ) : (
              <span>No Disponible</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

const RentalSection = ({ onLoginRequired }) => {
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [showAddToCartModal, setShowAddToCartModal] = useState(false)

  const vehicles = [
    {
      id: 1,
      name: "Scooter XTL 350",
      tipo: "scooter",
      image: "https://images.pexels.com/photos/1149601/pexels-photo-1149601.jpeg?auto=compress&cs=tinysrgb&w=400",
      isNew: true,
      discount: "-35%",
      rating: 5,
      featured: true,
    },
    {
      id: 2,
      name: "Bicicleta Urban Pro",
      tipo: "bicicleta",
      image: "https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=400",
      isNew: true,
      discount: "-20%",
      rating: 5,
    },
    {
      id: 3,
      name: "Patineta Lightning",
      tipo: "patineta",
      image: "https://images.pexels.com/photos/1149601/pexels-photo-1149601.jpeg?auto=compress&cs=tinysrgb&w=400",
      isNew: true,
      discount: "-15%",
      rating: 5,
      featured: true,
    },
    {
      id: 4,
      name: "Moto Eco Speed",
      tipo: "moto",
      image: "https://images.pexels.com/photos/1149601/pexels-photo-1149601.jpeg?auto=compress&cs=tinysrgb&w=400",
      isNew: true,
      discount: "-25%",
      rating: 5,
    },
    {
      id: 6,
      name: "Skateboard Pro X",
      tipo: "skateboard",
      image: "https://images.pexels.com/photos/1149601/pexels-photo-1149601.jpeg?auto=compress&cs=tinysrgb&w=400",
      isNew: true,
      discount: "-25%",
      rating: 5,
    },
    {
      id: 7,
      name: "Scooter City Max",
      tipo: "scooter",
      image: "https://images.pexels.com/photos/1149601/pexels-photo-1149601.jpeg?auto=compress&cs=tinysrgb&w=400",
      isNew: false,
      rating: 4,
    },
    {
      id: 8,
      name: "Bicicleta Mountain E",
      tipo: "bicicleta",
      image: "https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=400",
      isNew: false,
      rating: 4,
    },
  ]

  const handleAddToCart = (vehicle) => {
    setSelectedVehicle(vehicle)
    setShowAddToCartModal(true)
  }

  const handleCloseModal = () => {
    setShowAddToCartModal(false)
    setSelectedVehicle(null)
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-green-800">Renta </span>
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Ahora</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Descubre nuestra flota de vehículos eléctricos de última generación. Perfectos para la movilidad urbana
            sostenible.
          </p>
        </div>

        <div className="relative">
          <div className="flex overflow-x-auto p-4 gap-4 scrollbar-hide pb-3">
            {vehicles.map((vehicle, index) => (
              <div
                key={vehicle.id}
                className="flex-none w-72 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <VehicleCard vehicle={vehicle} onAddToCart={handleAddToCart} />
              </div>
            ))}
          </div>

          {/* <div className="flex justify-center mt-4">
            <div className="h-1 w-32 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full"></div>
            </div>
          </div> */}
        </div>

        <div className="text-center mt-16 animate-fade-in">
          <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
            Ver Todos los Vehículos
          </button>
        </div>
      </div>

      <EnhancedAddToCartModal
        isOpen={showAddToCartModal}
        onClose={handleCloseModal}
        vehicle={selectedVehicle}
        onLoginRequired={onLoginRequired}
      />
      {/* <AddToCartModal isOpen={showAddToCartModal} onClose={handleCloseModal} vehicle={selectedVehicle} /> */}
    </section>
  )
}

export default RentalSection
