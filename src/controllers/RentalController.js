import { RentalModel } from "../models/RentalModel.js"
import { RentalService } from "../services/RentalService.js"
import { PricingService } from "../services/PricingService.js"
import { StationService } from "../services/StationService.js"
import { AuthService } from "../services/AuthService.js"

export class RentalController {
  constructor() {
    this.rentalService = new RentalService()
    this.pricingService = new PricingService()
    this.stationService = new StationService()
    this.authService = new AuthService()
  }

  // Create new rental
  async createRental(rentalData) {
    try {
      // Validate user authentication
      if (!this.authService.isAuthenticated()) {
        throw new Error("USER_NOT_AUTHENTICATED")
      }

      // Create rental model
      const rental = new RentalModel(rentalData)

      // Validate rental data
      if (!rental.isValid()) {
        throw new Error("INVALID_RENTAL_DATA")
      }

      // Check vehicle availability
      const isVehicleAvailable = await this.rentalService.checkVehicleAvailability(
        rental.vehicleId,
        rental.startDateTime,
        rental.endDateTime,
      )

      if (!isVehicleAvailable) {
        throw new Error("VEHICLE_NOT_AVAILABLE")
      }

      // Check station availability
      const isStationAvailable = await this.stationService.isStationAvailable(rental.startStationId)
      if (!isStationAvailable) {
        throw new Error("STATION_NOT_AVAILABLE")
      }

      // Calculate pricing
      const pricing = await this.pricingService.calculatePrice(rental.vehicleType, rental.rentalType, rental.duration)

      rental.basePrice = pricing.basePrice
      rental.finalPrice = pricing.finalPrice

      // Save rental
      const savedRental = await this.rentalService.createRental(rental)

      return {
        success: true,
        data: savedRental,
        message: "Rental created successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: this.getErrorMessage(error.message),
      }
    }
  }

  // Update rental with overtime calculation
  async updateRentalWithOvertime(rentalId) {
    try {
      const rental = await this.rentalService.getRentalById(rentalId)
      if (!rental) {
        throw new Error("RENTAL_NOT_FOUND")
      }

      const rentalModel = RentalModel.fromJSON(rental)
      const overtimeHours = rentalModel.calculateOvertime()

      if (overtimeHours > 0) {
        const overtimePrice = await this.pricingService.calculateOvertimePrice(rentalModel.vehicleType, overtimeHours)

        rentalModel.finalPrice = rentalModel.basePrice + overtimePrice
        rentalModel.updatedAt = new Date()

        await this.rentalService.updateRental(rentalModel)
      }

      return {
        success: true,
        data: rentalModel,
        overtimeHours,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  // Get available stations
  async getAvailableStations() {
    try {
      const stations = await this.stationService.getAvailableStations()
      return {
        success: true,
        data: stations,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  // Get pricing for vehicle type
  async getPricing(vehicleType) {
    try {
      const pricing = await this.pricingService.getPricingByVehicleType(vehicleType)
      return {
        success: true,
        data: pricing,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  // Helper method for error messages
  getErrorMessage(errorCode) {
    const errorMessages = {
      USER_NOT_AUTHENTICATED: "Debes iniciar sesión para continuar",
      INVALID_RENTAL_DATA: "Los datos del alquiler no son válidos",
      VEHICLE_NOT_AVAILABLE: "El vehículo no está disponible en las fechas seleccionadas",
      STATION_NOT_AVAILABLE: "La estación seleccionada no está disponible",
      RENTAL_NOT_FOUND: "No se encontró el alquiler especificado",
    }

    return errorMessages[errorCode] || "Ha ocurrido un error inesperado"
  }
}
