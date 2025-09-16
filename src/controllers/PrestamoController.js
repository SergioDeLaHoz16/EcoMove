import { Prestamo } from "../models/Prestamo.js"
import { LocalStorageService } from "../services/LocalStorageService.js"

export class PrestamoController {
  static obtenerTodos() {
    const prestamosData = LocalStorageService.loadLoans()
    return prestamosData.map((data) => Prestamo.fromJSON(data))
  }

  static obtenerPorId(id) {
    const prestamos = this.obtenerTodos()
    return prestamos.find((prestamo) => prestamo.id === id)
  }

  static obtenerPorUsuario(usuarioId) {
    const prestamos = this.obtenerTodos()
    return prestamos.filter((prestamo) => prestamo.usuarioId === usuarioId)
  }

  static obtenerActivos() {
    const prestamos = this.obtenerTodos()
    return prestamos.filter((prestamo) => prestamo.estado === "activo")
  }

  static obtenerHistorial() {
    const prestamos = this.obtenerTodos()
    return prestamos.filter((prestamo) => prestamo.estado === "finalizado" || prestamo.estado === "cancelado")
  }

  static crear(datosPrestamo) {
    try {
      const prestamo = new Prestamo(datosPrestamo)
      const errores = prestamo.validar()

      if (errores.length > 0) {
        throw new Error(`Errores de validación: ${errores.join(", ")}`)
      }

      const prestamos = this.obtenerTodos()
      prestamos.push(prestamo)

      LocalStorageService.saveLoans(prestamos.map((p) => p.toJSON()))

      return prestamo
    } catch (error) {
      console.error("Error creando préstamo:", error)
      throw error
    }
  }

  static finalizar(prestamoId, estacionDestinoId, tarifaCalculada) {
    try {
      const prestamos = this.obtenerTodos()
      const indice = prestamos.findIndex((p) => p.id === prestamoId)

      if (indice === -1) {
        throw new Error("Préstamo no encontrado")
      }

      const prestamo = prestamos[indice]
      prestamo.finalizar(estacionDestinoId, tarifaCalculada)

      LocalStorageService.saveLoans(prestamos.map((p) => p.toJSON()))

      return prestamo
    } catch (error) {
      console.error("Error finalizando préstamo:", error)
      throw error
    }
  }

  static cancelar(prestamoId, motivo) {
    try {
      const prestamos = this.obtenerTodos()
      const indice = prestamos.findIndex((p) => p.id === prestamoId)

      if (indice === -1) {
        throw new Error("Préstamo no encontrado")
      }

      const prestamo = prestamos[indice]
      prestamo.cancelar(motivo)

      LocalStorageService.saveLoans(prestamos.map((p) => p.toJSON()))

      return prestamo
    } catch (error) {
      console.error("Error cancelando préstamo:", error)
      throw error
    }
  }

  static obtenerEstadisticas() {
    const prestamos = this.obtenerTodos()

    const activos = prestamos.filter((p) => p.estado === "activo")
    const finalizados = prestamos.filter((p) => p.estado === "finalizado")
    const cancelados = prestamos.filter((p) => p.estado === "cancelado")

    const ingresoTotal = finalizados.reduce((total, p) => total + p.tarifaCalculada, 0)
    const duracionPromedio =
      finalizados.length > 0 ? finalizados.reduce((total, p) => total + p.duracionMinutos, 0) / finalizados.length : 0

    return {
      total: prestamos.length,
      activos: activos.length,
      finalizados: finalizados.length,
      cancelados: cancelados.length,
      ingresoTotal: Math.round(ingresoTotal * 100) / 100,
      duracionPromedio: Math.round(duracionPromedio),
    }
  }
}
