class StationService {
  constructor() {
    this.stations = [
      {
        id: 1,
        name: "Estación Centro",
        address: "Calle 10 #15-20, Centro",
        coordinates: { lat: 4.6097, lng: -74.0817 },
        availableVehicles: {
          bicicleta: 5,
          scooter: 3,
          patineta: 8,
        },
        capacity: {
          bicicleta: 10,
          scooter: 8,
          patineta: 12,
        },
        isActive: true,
        operatingHours: "24/7",
      },
      {
        id: 2,
        name: "Estación Norte",
        address: "Carrera 15 #85-40, Chapinero",
        coordinates: { lat: 4.6486, lng: -74.0648 },
        availableVehicles: {
          bicicleta: 8,
          scooter: 6,
          patineta: 4,
        },
        capacity: {
          bicicleta: 12,
          scooter: 10,
          patineta: 8,
        },
        isActive: true,
        operatingHours: "6:00 AM - 10:00 PM",
      },
      {
        id: 3,
        name: "Estación Sur",
        address: "Avenida Caracas #45-30, San Cristóbal",
        coordinates: { lat: 4.5709, lng: -74.096 },
        availableVehicles: {
          bicicleta: 3,
          scooter: 2,
          patineta: 6,
        },
        capacity: {
          bicicleta: 8,
          scooter: 6,
          patineta: 10,
        },
        isActive: true,
        operatingHours: "6:00 AM - 9:00 PM",
      },
      {
        id: 4,
        name: "Estación Oeste",
        address: "Calle 26 #68-35, Zona Rosa",
        coordinates: { lat: 4.6126, lng: -74.0705 },
        availableVehicles: {
          bicicleta: 6,
          scooter: 4,
          patineta: 7,
        },
        capacity: {
          bicicleta: 10,
          scooter: 8,
          patineta: 12,
        },
        isActive: true,
        operatingHours: "24/7",
      },
    ]
  }

  getAllStations() {
    return this.stations.filter((station) => station.isActive)
  }

  getStationById(stationId) {
    return this.stations.find((station) => station.id === stationId)
  }

  getStationsWithAvailableVehicle(vehicleType) {
    return this.stations.filter((station) => station.isActive && station.availableVehicles[vehicleType] > 0)
  }

  getStationsForReturn(vehicleType) {
    return this.stations.filter((station) => {
      const available = station.availableVehicles[vehicleType]
      const capacity = station.capacity[vehicleType]
      return station.isActive && available < capacity
    })
  }

  reserveVehicle(stationId, vehicleType) {
    const station = this.getStationById(stationId)
    if (!station || station.availableVehicles[vehicleType] <= 0) {
      throw new Error("Vehículo no disponible en esta estación")
    }

    station.availableVehicles[vehicleType]--
    return true
  }

  returnVehicle(stationId, vehicleType) {
    const station = this.getStationById(stationId)
    if (!station) {
      throw new Error("Estación no encontrada")
    }

    const available = station.availableVehicles[vehicleType]
    const capacity = station.capacity[vehicleType]

    if (available >= capacity) {
      throw new Error("Estación llena para este tipo de vehículo")
    }

    station.availableVehicles[vehicleType]++
    return true
  }

  calculateDistance(station1, station2) {
    // Simple distance calculation (in km)
    const R = 6371
    const dLat = ((station2.coordinates.lat - station1.coordinates.lat) * Math.PI) / 180
    const dLng = ((station2.coordinates.lng - station1.coordinates.lng) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((station1.coordinates.lat * Math.PI) / 180) *
        Math.cos((station2.coordinates.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }
}

export const stationService = new StationService()
