
"use client"

import { useMemo } from "react"
import { PricingService } from "../services/PricingService.js"

export const useRentalPricing = (vehicleType) => {
  const pricing = useMemo(() => {
    try {
      return PricingService.getPricing(vehicleType)
    } catch (error) {
      return null
    }
  }, [vehicleType])

  const isAvailable = useMemo(() => {
    return pricing ? PricingService.isVehicleAvailable(vehicleType) : false
  }, [vehicleType, pricing])

  const formatPrice = (price) => {
    return PricingService.formatPrice(price)
  }

  const calculatePrice = (rentalType, duration) => {
    if (!pricing || !isAvailable) return 0

    try {
      return PricingService.calculateRentalPrice(vehicleType, rentalType, duration)
    } catch (error) {
      return 0
    }
  }

  return {
    pricing,
    isAvailable,
    formatPrice,
    calculatePrice,
  }
}
