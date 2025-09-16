"use client"

import { useState, useEffect } from "react"
import { MapPin, Clock, Bike, Zap } from "lucide-react"
import { stationService } from "../../services/StationService.js"

const StationCard = ({ station, vehicleType, onSelect, isSelected }) => {
  const getVehicleIcon = (type) => {
    switch (type) {
      case "bicicleta":
        return <Bike className="w-4 h-4" />
      case "scooter":
        return <Zap className="w-4 h-4" />
      case "patineta":
        return <Bike className="w-4 h-4" />
      default:
        return <MapPin className="w-4 h-4" />
    }
  }

  const available = station.availableVehicles[vehicleType] || 0
  const capacity = station.capacity[vehicleType] || 0

  return (
    <div
      onClick={() => onSelect(station)}
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">{station.name}</h3>
        </div>
        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{station.operatingHours}</span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-3">{station.address}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getVehicleIcon(vehicleType)}
          <span className="text-sm font-medium">
            {available} / {capacity} disponibles
          </span>
        </div>
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            available > 0 ? "bg-accent/20 text-accent-foreground" : "bg-destructive/20 text-destructive"
          }`}
        >
          {available > 0 ? "Disponible" : "Sin stock"}
        </div>
      </div>
    </div>
  )
}

const StationMap = ({ vehicleType, mode = "pickup", onStationSelect, selectedStation }) => {
  const [stations, setStations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    let availableStations = []
    if (mode === "pickup") {
      availableStations = stationService.getStationsWithAvailableVehicle(vehicleType)
    } else {
      availableStations = stationService.getStationsForReturn(vehicleType)
    }

    setStations(availableStations)
    setLoading(false)
  }, [vehicleType, mode])

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 border border-border rounded-lg animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/2 mb-3"></div>
            <div className="h-3 bg-muted rounded w-1/4"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          {mode === "pickup" ? "Estaciones de Recogida" : "Estaciones de Devolución"}
        </h3>
        <span className="text-sm text-muted-foreground">{stations.length} estaciones disponibles</span>
      </div>

      {stations.length === 0 ? (
        <div className="text-center py-8">
          <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No hay estaciones disponibles para este tipo de vehículo</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {stations.map((station) => (
            <StationCard
              key={station.id}
              station={station}
              vehicleType={vehicleType}
              onSelect={onStationSelect}
              isSelected={selectedStation?.id === station.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default StationMap
