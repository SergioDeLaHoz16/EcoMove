import { Transporte } from "../models/Transporte.js"
import { LocalStorageService } from "../services/LocalStorageService.js"
import { TransportFactory } from "../services/TransportFactory.js"

export class TransporteController {
  static obtenerTodos() {
    const transportesData = LocalStorageService.loadTransports()
    return transportesData.map((data) => Transporte.fromJSON(data))
  }

  static obtenerPorId(id) {
    const transportes = this.obtenerTodos()
    return transportes.find((transporte) => transporte.id === id)
  }

  static async crear(datosTransporte) {
    try {
      const transporte = TransportFactory.createTransport(
        datosTransporte.tipo,
        datosTransporte.codigo,
        datosTransporte.estacionId,
        datosTransporte,
      )

      const errores = transporte.validar()
      if (errores.length > 0) {
        throw new Error(`Errores de validación: ${errores.join(", ")}`)
      }

      // Verificar que el código no esté duplicado
      const transportes = this.obtenerTodos()
      const codigoExiste = transportes.some((t) => t.codigo === transporte.codigo)

      if (codigoExiste) {
        throw new Error("Ya existe un transporte con este código")
      }

      transportes.push(transporte)
      LocalStorageService.saveTransports(transportes.map((t) => t.toJSON()))

      if (transporte.estacionId) {
        try {
          const { EstacionController } = await import("./EstacionController.js")
          await EstacionController.agregarTransporte(transporte.estacionId, transporte.id)
        } catch (importError) {
          console.warn("Could not update station:", importError)
        }
      }

      return transporte
    } catch (error) {
      console.error("Error creando transporte:", error)
      throw error
    }
  }

  static async actualizar(id, datosActualizados) {
    try {
      const transportes = this.obtenerTodos()
      const indice = transportes.findIndex((transporte) => transporte.id === id)

      if (indice === -1) {
        throw new Error("Transporte no encontrado")
      }

      const estacionAnterior = transportes[indice].estacionId

      Object.assign(transportes[indice], datosActualizados)
      transportes[indice].id = id

      const errores = transportes[indice].validar()
      if (errores.length > 0) {
        throw new Error(`Errores de validación: ${errores.join(", ")}`)
      }

      LocalStorageService.saveTransports(transportes.map((t) => t.toJSON()))

      if (estacionAnterior !== transportes[indice].estacionId) {
        try {
          const { EstacionController } = await import("./EstacionController.js")

          if (estacionAnterior) {
            await EstacionController.removerTransporte(estacionAnterior, id)
          }

          if (transportes[indice].estacionId) {
            await EstacionController.agregarTransporte(transportes[indice].estacionId, id)
          }
        } catch (importError) {
          console.warn("Could not update stations:", importError)
        }
      }

      return transportes[indice]
    } catch (error) {
      console.error("Error actualizando transporte:", error)
      throw error
    }
  }

  static async eliminar(id) {
    try {
      const transportes = this.obtenerTodos()
      const transporte = transportes.find((t) => t.id === id)

      if (!transporte) {
        throw new Error("Transporte no encontrado")
      }

      if (!transporte.disponible) {
        throw new Error("No se puede eliminar un transporte que está en uso")
      }

      if (transporte.estacionId) {
        try {
          const { EstacionController } = await import("./EstacionController.js")
          await EstacionController.removerTransporte(transporte.estacionId, id)
        } catch (importError) {
          console.warn("Could not update station:", importError)
        }
      }

      const transportesFiltrados = transportes.filter((t) => t.id !== id)
      LocalStorageService.saveTransports(transportesFiltrados.map((t) => t.toJSON()))

      return true
    } catch (error) {
      console.error("Error eliminando transporte:", error)
      throw error
    }
  }

  static obtenerDisponiblesPorEstacion(estacionId) {
    const transportes = this.obtenerTodos()
    return transportes.filter(
      (transporte) =>
        transporte.estacionId === estacionId && transporte.disponible && transporte.estado === "operativo",
    )
  }

  static obtenerPorTipo(tipo) {
    const transportes = this.obtenerTodos()
    return transportes.filter((transporte) => transporte.tipo.toLowerCase() === tipo.toLowerCase())
  }

  static async prestar(transporteId) {
    try {
      const transportes = this.obtenerTodos()
      const indice = transportes.findIndex((t) => t.id === transporteId)

      if (indice === -1) {
        throw new Error("Transporte no encontrado")
      }

      const transporte = transportes[indice]
      transporte.prestar()

      if (transporte.estacionId) {
        try {
          const { EstacionController } = await import("./EstacionController.js")
          await EstacionController.removerTransporte(transporte.estacionId, transporteId)
        } catch (importError) {
          console.warn("Could not update station:", importError)
        }
      }

      LocalStorageService.saveTransports(transportes.map((t) => t.toJSON()))
      return transporte
    } catch (error) {
      console.error("Error prestando transporte:", error)
      throw error
    }
  }

  static async devolver(transporteId, estacionId) {
    try {
      const transportes = this.obtenerTodos()
      const indice = transportes.findIndex((t) => t.id === transporteId)

      if (indice === -1) {
        throw new Error("Transporte no encontrado")
      }

      const transporte = transportes[indice]
      transporte.devolver(estacionId)

      try {
        const { EstacionController } = await import("./EstacionController.js")
        await EstacionController.agregarTransporte(estacionId, transporteId)
      } catch (importError) {
        console.warn("Could not update station:", importError)
      }

      LocalStorageService.saveTransports(transportes.map((t) => t.toJSON()))
      return transporte
    } catch (error) {
      console.error("Error devolviendo transporte:", error)
      throw error
    }
  }

  static obtenerEstadisticas() {
    const transportes = this.obtenerTodos()

    const estadisticas = {
      total: transportes.length,
      disponibles: transportes.filter((t) => t.disponible).length,
      enUso: transportes.filter((t) => !t.disponible).length,
      porTipo: {},
    }

    // Estadísticas por tipo
    const tipos = [...new Set(transportes.map((t) => t.tipo))]
    tipos.forEach((tipo) => {
      const transportesTipo = transportes.filter((t) => t.tipo === tipo)
      estadisticas.porTipo[tipo] = {
        total: transportesTipo.length,
        disponibles: transportesTipo.filter((t) => t.disponible).length,
        enUso: transportesTipo.filter((t) => !t.disponible).length,
      }
    })

    return estadisticas
  }
}
