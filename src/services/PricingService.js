import pricingData from "../data/pricing.json"

export class PricingService {
  static getPricingData() {
    return pricingData
  }

  // Get pricing for specific vehicle type
  static getPricingByVehicleType(vehicleType) {
    const pricing = pricingData.vehicleTypes[vehicleType.toLowerCase()]
    if (!pricing) {
      throw new Error(`Tipo de vehículo no válido: ${vehicleType}`)
    }
    return pricing
  }

  static getPricing(vehicleType) {
    return this.getPricingByVehicleType(vehicleType)
  }

  // Check if vehicle type is available
  static isVehicleAvailable(vehicleType) {
    try {
      const pricing = this.getPricingByVehicleType(vehicleType)
      return pricing.available !== false
    } catch {
      return false
    }
  }

  // Format price with currency
  static formatPrice(price, vehicleType = "bicicleta") {
    const pricing = this.getPricingByVehicleType(vehicleType)
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: pricing.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Calculate base rental price
  static calculatePrice(vehicleType, rentalType, duration) {
    const pricing = this.getPricingByVehicleType(vehicleType)

    if (!this.isVehicleAvailable(vehicleType)) {
      throw new Error(`${pricing.name} no está disponible actualmente`)
    }

    let basePrice = 0
    if (rentalType === "hourly") {
      basePrice = duration * pricing.hourly
    } else if (rentalType === "daily") {
      basePrice = duration * pricing.daily
    } else {
      throw new Error("Tipo de alquiler no válido")
    }

    // Apply discounts for longer rentals
    let finalPrice = basePrice
    if (rentalType === "daily") {
      if (duration >= 7) {
        finalPrice = basePrice * (1 - pricing.weeklyDiscount)
      } else if (duration >= 30) {
        finalPrice = basePrice * (1 - pricing.monthlyDiscount)
      }
    }

    return {
      basePrice,
      finalPrice,
      discount: basePrice - finalPrice,
      currency: pricing.currency,
      symbol: pricing.symbol,
    }
  }

  static calculateRentalPrice(vehicleType, rentalType, duration) {
    const result = this.calculatePrice(vehicleType, rentalType, duration)
    return result.finalPrice
  }

  // Calculate overtime price
  static calculateOvertimePrice(vehicleType, overtimeHours) {
    const pricing = this.getPricingByVehicleType(vehicleType)
    const overtimeRate = pricing.hourly * pricing.overtimeMultiplier
    return overtimeHours * overtimeRate
  }

  // Get all available vehicle types
  static getAvailableVehicleTypes() {
    return Object.entries(pricingData.vehicleTypes)
      .filter(([_, pricing]) => pricing.available !== false)
      .map(([type, pricing]) => ({
        type,
        name: pricing.name,
        hourlyPrice: pricing.hourly,
        dailyPrice: pricing.daily,
        currency: pricing.currency,
        symbol: pricing.symbol,
      }))
  }

  // Get fees information
  static getFees() {
    return pricingData.fees
  }

  // Get available discounts
  static getDiscounts() {
    return pricingData.discounts
  }

  // Apply discount to price
  static applyDiscount(price, discountType) {
    const discounts = this.getDiscounts()
    const discountRate = discounts[discountType] || 0
    return price * (1 - discountRate)
  }
}
