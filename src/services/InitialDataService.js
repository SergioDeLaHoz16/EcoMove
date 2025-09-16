import { EstacionController } from "../controllers/EstacionController.js"
import { TransporteController } from "../controllers/TransporteController.js"
import { LocalStorageService } from "./LocalStorageService.js"

export class InitialDataService {
  static initializeData() {
    // Check if data already exists
    const existingStations = LocalStorageService.loadStations()
    const existingTransports = LocalStorageService.loadTransports()

    if (existingStations.length > 0 && existingTransports.length > 0) {
      console.log("Initial data already exists")
      return
    }

    console.log("Initializing data...")

    try {
      // Create initial stations
      this.createInitialStations()

      // Create initial transports
      this.createInitialTransports()

      console.log("Initial data created successfully")
    } catch (error) {
      console.error("Error initializing data:", error)
    }
  }

  static createInitialStations() {
    const stations = [
      {
        nombre: "Estación Centro",
        direccion: "Av. Principal 123, Centro",
        latitud: 4.6097,
        longitud: -74.0817,
        capacidad: 20,
      },
      {
        nombre: "Estación Norte",
        direccion: "Carrera 15 #85-40, Chapinero",
        latitud: 4.6486,
        longitud: -74.0648,
        capacidad: 15,
      },
      {
        nombre: "Estación Sur",
        direccion: "Avenida Caracas #45-30, San Cristóbal",
        latitud: 4.5709,
        longitud: -74.096,
        capacidad: 18,
      },
      {
        nombre: "Estación Oeste",
        direccion: "Calle 26 #68-35, Zona Rosa",
        latitud: 4.6126,
        longitud: -74.0705,
        capacidad: 12,
      },
    ]

    stations.forEach((stationData) => {
      try {
        EstacionController.crear(stationData)
      } catch (error) {
        console.error(`Error creating station ${stationData.nombre}:`, error)
      }
    })
  }

  static createInitialTransports() {
    const transports = [
      // Scooters
      { codigo: "SCT-001", tipo: "scooter", modelo: "XTL 350", año: 2024, estacionId: null },
      { codigo: "SCT-002", tipo: "scooter", modelo: "City Max", año: 2024, estacionId: null },
      { codigo: "SCT-003", tipo: "scooter", modelo: "Urban Pro", año: 2023, estacionId: null },
      { codigo: "SCT-004", tipo: "scooter", modelo: "Lightning", año: 2024, estacionId: null },

      // Bicicletas
      { codigo: "BIC-001", tipo: "bicicleta", modelo: "Urban Pro", año: 2024, estacionId: null },
      { codigo: "BIC-002", tipo: "bicicleta", modelo: "Mountain E", año: 2024, estacionId: null },
      { codigo: "BIC-003", tipo: "bicicleta", modelo: "City Bike", año: 2023, estacionId: null },
      { codigo: "BIC-004", tipo: "bicicleta", modelo: "Eco Ride", año: 2024, estacionId: null },

      // Patinetas
      { codigo: "PAT-001", tipo: "patineta", modelo: "Lightning", año: 2024, estacionId: null },
      { codigo: "PAT-002", tipo: "patineta", modelo: "Pro X", año: 2024, estacionId: null },
      { codigo: "PAT-003", tipo: "patineta", modelo: "Urban Glide", año: 2023, estacionId: null },

      // Skateboards
      { codigo: "SKT-001", tipo: "skateboard", modelo: "Pro X", año: 2024, estacionId: null },
      { codigo: "SKT-002", tipo: "skateboard", modelo: "Street King", año: 2024, estacionId: null },

      // Motos
      { codigo: "MOT-001", tipo: "moto", modelo: "Eco Speed", año: 2024, estacionId: null },
      { codigo: "MOT-002", tipo: "moto", modelo: "Urban Rider", año: 2024, estacionId: null },
    ]

    // Get created stations
    const stations = EstacionController.obtenerTodas()

    transports.forEach((transportData, index) => {
      try {
        // Assign to a station (distribute evenly)
        const stationIndex = index % stations.length
        const station = stations[stationIndex]

        if (station) {
          transportData.estacionId = station.id
        }

        // Add additional properties
        transportData.caracteristicas = {
          modelo: transportData.modelo,
          año: transportData.año,
          bateria: "100%",
          autonomia: this.getAutonomyByType(transportData.tipo),
        }

        TransporteController.crear(transportData)
      } catch (error) {
        console.error(`Error creating transport ${transportData.codigo}:`, error)
      }
    })
  }

  static getAutonomyByType(tipo) {
    const autonomies = {
      scooter: "25 km",
      bicicleta: "40 km",
      patineta: "20 km",
      skateboard: "15 km",
      moto: "60 km",
    }
    return autonomies[tipo] || "20 km"
  }

  static resetData() {
    LocalStorageService.clear()
    console.log("All data cleared")
  }

  static reinitializeData() {
    this.resetData()
    this.initializeData()
  }
}
