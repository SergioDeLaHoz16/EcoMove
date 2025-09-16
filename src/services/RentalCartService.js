import { RentalItem } from "../models/RentalItem.js"
import { PricingService } from "./PricingService.js"

export class RentalCartService {
  constructor() {
    this.items = []
    this.listeners = []
  }

  // Observer pattern for state management
  subscribe(listener) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  notify() {
    this.listeners.forEach((listener) => listener(this.getState()))
  }

  addItem(vehicleId, vehicleType, vehicleName, rentalType, startTime, endTime) {
    try {
      const pricing = PricingService.getPricing(vehicleType)

      if (!PricingService.isVehicleAvailable(vehicleType)) {
        throw new Error(`${pricing.name} no está disponible actualmente`)
      }

      const rentalItem = new RentalItem({
        vehicleId,
        vehicleType,
        vehicleName,
        rentalType,
        startTime,
        endTime,
        pricePerHour: pricing.hourly,
        pricePerDay: pricing.daily,
      })

      this.items.push(rentalItem)
      this.notify()
      return rentalItem
    } catch (error) {
      throw new Error(`Error al agregar al carrito: ${error.message}`)
    }
  }

  removeItem(itemId) {
    const initialLength = this.items.length
    this.items = this.items.filter((item) => item.id !== itemId)

    if (this.items.length < initialLength) {
      this.notify()
      return true
    }
    return false
  }

  updateItemEndTime(itemId, newEndTime) {
    const item = this.items.find((item) => item.id === itemId)
    if (item) {
      item.updateEndTime(newEndTime)
      this.notify()
      return item
    }
    throw new Error("Item no encontrado en el carrito")
  }

  getTotalPrice() {
    return this.items.reduce((total, item) => total + item.totalPrice, 0)
  }

  getItemCount() {
    return this.items.length
  }

  clearCart() {
    this.items = []
    this.notify()
  }

  getState() {
    return {
      items: this.items.map((item) => item.toJSON()),
      totalPrice: this.getTotalPrice(),
      itemCount: this.getItemCount(),
    }
  }

  // Persistence methods
  saveToStorage() {
    try {
      const state = this.getState()
      localStorage.setItem("ecomove_rental_cart", JSON.stringify(state))
    } catch (error) {
      console.error("Error saving cart to storage:", error)
    }
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem("ecomove_rental_cart")
      if (stored) {
        const state = JSON.parse(stored)
        this.items = state.items.map((item) => RentalItem.fromJSON(item))
        this.notify()
      }
    } catch (error) {
      console.error("Error loading cart from storage:", error)
    }
  }
}
