export class RentalItem {
  constructor({ vehicleId, vehicleType, vehicleName, rentalType, startTime, endTime, pricePerHour, pricePerDay }) {
    this.id = this.generateId()
    this.vehicleId = vehicleId
    this.vehicleType = vehicleType
    this.vehicleName = vehicleName
    this.rentalType = rentalType // 'hourly' or 'daily'
    this.startTime = startTime
    this.endTime = endTime
    this.pricePerHour = pricePerHour
    this.pricePerDay = pricePerDay
    this.status = "pending" // pending, active, completed, cancelled
    this.totalPrice = this.calculateTotalPrice()
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  calculateTotalPrice() {
    if (!this.startTime || !this.endTime) return 0

    const start = new Date(this.startTime)
    const end = new Date(this.endTime)
    const diffInMs = end - start

    if (this.rentalType === "hourly") {
      const hours = Math.ceil(diffInMs / (1000 * 60 * 60))
      return hours * this.pricePerHour
    } else {
      const days = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))
      return days * this.pricePerDay
    }
  }

  updateEndTime(newEndTime) {
    this.endTime = newEndTime
    this.totalPrice = this.calculateTotalPrice()
  }

  getDuration() {
    if (!this.startTime || !this.endTime) return { value: 0, unit: "hours" }

    const start = new Date(this.startTime)
    const end = new Date(this.endTime)
    const diffInMs = end - start

    if (this.rentalType === "hourly") {
      const hours = Math.ceil(diffInMs / (1000 * 60 * 60))
      return { value: hours, unit: "hours" }
    } else {
      const days = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))
      return { value: days, unit: "days" }
    }
  }

  toJSON() {
    return {
      id: this.id,
      vehicleId: this.vehicleId,
      vehicleType: this.vehicleType,
      vehicleName: this.vehicleName,
      rentalType: this.rentalType,
      startTime: this.startTime,
      endTime: this.endTime,
      pricePerHour: this.pricePerHour,
      pricePerDay: this.pricePerDay,
      totalPrice: this.totalPrice,
      status: this.status,
    }
  }

  static fromJSON(data) {
    return new RentalItem(data)
  }
}
