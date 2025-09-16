export class RentalModel {
  constructor(data = {}) {
    this.id = data.id || null
    this.vehicleId = data.vehicleId || null
    this.vehicleType = data.vehicleType || ""
    this.vehicleName = data.vehicleName || ""
    this.rentalType = data.rentalType || "hourly"
    this.startDateTime = data.startDateTime || null
    this.endDateTime = data.endDateTime || null
    this.duration = data.duration || 1
    this.startStationId = data.startStationId || null
    this.endStationId = data.endStationId || null
    this.basePrice = data.basePrice || 0
    this.finalPrice = data.finalPrice || 0
    this.status = data.status || "pending"
    this.createdAt = data.createdAt || new Date()
    this.updatedAt = data.updatedAt || new Date()
  }

  // Validation methods
  isValid() {
    return this.vehicleId && this.startDateTime && this.endDateTime && this.startStationId && this.duration > 0
  }

  // Business logic methods
  calculateOvertime(currentTime = new Date()) {
    if (!this.endDateTime) return 0

    const endTime = new Date(this.endDateTime)
    const overtime = Math.max(0, currentTime - endTime)
    return Math.ceil(overtime / (1000 * 60 * 60)) // Hours
  }

  isOverdue(currentTime = new Date()) {
    if (!this.endDateTime) return false
    return currentTime > new Date(this.endDateTime)
  }

  // Data transformation methods
  toJSON() {
    return {
      id: this.id,
      vehicleId: this.vehicleId,
      vehicleType: this.vehicleType,
      vehicleName: this.vehicleName,
      rentalType: this.rentalType,
      startDateTime: this.startDateTime,
      endDateTime: this.endDateTime,
      duration: this.duration,
      startStationId: this.startStationId,
      endStationId: this.endStationId,
      basePrice: this.basePrice,
      finalPrice: this.finalPrice,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }

  static fromJSON(data) {
    return new RentalModel(data)
  }
}
