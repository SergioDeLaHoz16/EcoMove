import { RentalCartService } from "./RentalCartService.js"

export class RentalService {
  constructor() {
    this.cartService = new RentalCartService()
    this.activeRentals = []
  }

  getCartService() {
    return this.cartService
  }

  startRental(cartItem) {
    try {
      // Validate rental can start
      if (cartItem.status !== "pending") {
        throw new Error("El alquiler ya ha sido iniciado o completado")
      }

      // Update status to active
      cartItem.status = "active"
      cartItem.actualStartTime = new Date().toISOString()

      // Add to active rentals
      this.activeRentals.push(cartItem)

      // Remove from cart
      this.cartService.removeItem(cartItem.id)

      return cartItem
    } catch (error) {
      throw new Error(`Error al iniciar alquiler: ${error.message}`)
    }
  }

  endRental(rentalId, endStationId) {
    try {
      const rental = this.activeRentals.find((r) => r.id === rentalId)
      if (!rental) {
        throw new Error("Alquiler no encontrado")
      }

      rental.status = "completed"
      rental.actualEndTime = new Date().toISOString()
      rental.endStationId = endStationId

      // Calculate final price based on actual time
      const actualStart = new Date(rental.actualStartTime)
      const actualEnd = new Date(rental.actualEndTime)
      const actualDuration = actualEnd - actualStart

      if (rental.rentalType === "hourly") {
        const hours = Math.ceil(actualDuration / (1000 * 60 * 60))
        rental.finalPrice = hours * rental.pricePerHour
      } else {
        const days = Math.ceil(actualDuration / (1000 * 60 * 60 * 24))
        rental.finalPrice = days * rental.pricePerDay
      }

      // Remove from active rentals
      this.activeRentals = this.activeRentals.filter((r) => r.id !== rentalId)

      return rental
    } catch (error) {
      throw new Error(`Error al finalizar alquiler: ${error.message}`)
    }
  }

  getActiveRentals() {
    return this.activeRentals
  }

  getRentalHistory() {
    // In a real app, this would come from a database
    return JSON.parse(localStorage.getItem("ecomove_rental_history") || "[]")
  }

  saveRentalToHistory(rental) {
    try {
      const history = this.getRentalHistory()
      history.push(rental)
      localStorage.setItem("ecomove_rental_history", JSON.stringify(history))
    } catch (error) {
      console.error("Error saving rental to history:", error)
    }
  }
}

// Singleton instance
export const rentalService = new RentalService()
