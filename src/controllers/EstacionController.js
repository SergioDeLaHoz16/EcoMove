import { Estacion } from "../models/Estacion.js"
import { LocalStorageService } from "../services/LocalStorageService.js"

export class EstacionController {
  static obtenerTodas() {
    const estacionesData = LocalStorageService.loadStations()
    return estacionesData.map((data) => Estacion.fromJSON(data))
  }

  static obtenerPorId(id) {
    const estaciones = this.obtenerTodas()
    return estaciones.find((estacion) => estacion.id === id)
  }

  static crear(datosEstacion) {
    try {
      // Si latitud o longitud no se proporcionan, asignar valores por defecto
      if (
        !("latitud" in datosEstacion) ||
        datosEstacion.latitud === undefined ||
        datosEstacion.latitud === null ||
        datosEstacion.latitud === ""
      ) {
        datosEstacion.latitud = 0
      }
      if (
        !("longitud" in datosEstacion) ||
        datosEstacion.longitud === undefined ||
        datosEstacion.longitud === null ||
        datosEstacion.longitud === ""
      ) {
        datosEstacion.longitud = 0
      }
      const estacion = new Estacion(datosEstacion)
      const errores = estacion
        .validar()
        .filter((e) => !e.toLowerCase().includes("latitud") && !e.toLowerCase().includes("longitud"))

      if (errores.length > 0) {
        throw new Error(`Errores de validación: ${errores.join(", ")}`)
      }

      // Verificar que el nombre no esté duplicado
      const estaciones = this.obtenerTodas()
      const nombreExiste = estaciones.some((e) => e.nombre.toLowerCase() === estacion.nombre.toLowerCase())

      if (nombreExiste) {
        throw new Error("Ya existe una estación con este nombre")
      }

      estaciones.push(estacion)
      LocalStorageService.saveStations(estaciones.map((e) => e.toJSON()))

      return estacion
    } catch (error) {
      console.error("Error creando estación:", error)
      throw error
    }
  }

  static actualizar(id, datosActualizados) {
    try {
      const estaciones = this.obtenerTodas()
      const indice = estaciones.findIndex((estacion) => estacion.id === id)

      if (indice === -1) {
        throw new Error("Estación no encontrada")
      }

      Object.assign(estaciones[indice], datosActualizados)
      estaciones[indice].id = id

      const errores = estaciones[indice].validar()
      if (errores.length > 0) {
        throw new Error(`Errores de validación: ${errores.join(", ")}`)
      }

      LocalStorageService.saveStations(estaciones.map((e) => e.toJSON()))
      return estaciones[indice]
    } catch (error) {
      console.error("Error actualizando estación:", error)
      throw error
    }
  }

  static eliminar(id) {
    try {
      const estaciones = this.obtenerTodas()
      const estacion = estaciones.find((e) => e.id === id)

      if (!estacion) {
        throw new Error("Estación no encontrada")
      }

      // Verificar que no tenga transportes asignados
      if (estacion.transportesDisponibles.length > 0) {
        throw new Error("No se puede eliminar una estación con transportes asignados")
      }

      const estacionesFiltradas = estaciones.filter((e) => e.id !== id)
      LocalStorageService.saveStations(estacionesFiltradas.map((e) => e.toJSON()))

      return true
    } catch (error) {
      console.error("Error eliminando estación:", error)
      throw error
    }
  }

  static agregarTransporte(estacionId, transporteId) {
    try {
      const estaciones = this.obtenerTodas()
      const estacion = estaciones.find((e) => e.id === estacionId)

      if (!estacion) {
        throw new Error("Estación no encontrada")
      }

      if (!estacion.tieneCapacidad()) {
        throw new Error("La estación ha alcanzado su capacidad máxima")
      }

      estacion.agregarTransporte(transporteId)
      LocalStorageService.saveStations(estaciones.map((e) => e.toJSON()))

      return estacion
    } catch (error) {
      console.error("Error agregando transporte a estación:", error)
      throw error
    }
  }

  static removerTransporte(estacionId, transporteId) {
    try {
      const estaciones = this.obtenerTodas()
      const estacion = estaciones.find((e) => e.id === estacionId)

      if (!estacion) {
        throw new Error("Estación no encontrada")
      }

      estacion.removerTransporte(transporteId)
      LocalStorageService.saveStations(estaciones.map((e) => e.toJSON()))

      return estacion
    } catch (error) {
      console.error("Error removiendo transporte de estación:", error)
      throw error
    }
  }

  static async obtenerTransportesDisponibles(estacionId) {
    const estacion = this.obtenerPorId(estacionId)

    if (!estacion) {
      throw new Error("Estación no encontrada")
    }

    const { TransporteController } = await import("../controllers/TransporteController.js")
    return estacion.transportesDisponibles
      .map((transporteId) => TransporteController.obtenerPorId(transporteId))
      .filter((transporte) => transporte && transporte.disponible)
  }

  static obtenerEstadisticas() {
    const estaciones = this.obtenerTodas()

    let totalCapacidad = 0
    let totalOcupados = 0

    estaciones.forEach((estacion) => {
      const ocupacion = estacion.obtenerOcupacion()
      totalCapacidad += ocupacion.capacidad
      totalOcupados += ocupacion.ocupados
    })

    return {
      total: estaciones.length,
      activas: estaciones.filter((e) => e.activa).length,
      capacidadTotal: totalCapacidad,
      ocupacionTotal: totalOcupados,
      porcentajeOcupacion: totalCapacidad > 0 ? Math.round((totalOcupados / totalCapacidad) * 100) : 0,
    }
  }
}
