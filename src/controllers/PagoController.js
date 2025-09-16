import { Pago } from "../models/Pago.js"
import { LocalStorageService } from "../services/LocalStorageService.js"
import { PrestamoController } from "./PrestamoController.js"

export class PagoController {
  static obtenerTodos() {
    const pagosData = LocalStorageService.loadPayments()
    return pagosData.map((data) => Pago.fromJSON(data))
  }

  static obtenerPorId(id) {
    const pagos = this.obtenerTodos()
    return pagos.find((pago) => pago.id === id)
  }

  static obtenerPorPrestamo(prestamoId) {
    const pagos = this.obtenerTodos()
    return pagos.find((pago) => pago.prestamoId === prestamoId)
  }

  static crear(datosPago) {
    try {
      const pago = new Pago(datosPago)
      const errores = pago.validar()

      if (errores.length > 0) {
        throw new Error(`Errores de validación: ${errores.join(", ")}`)
      }

      // Verificar que no exista ya un pago para este préstamo
      const pagoExistente = this.obtenerPorPrestamo(pago.prestamoId)
      if (pagoExistente) {
        throw new Error("Ya existe un pago para este préstamo")
      }

      const pagos = this.obtenerTodos()
      pagos.push(pago)

      LocalStorageService.savePayments(pagos.map((p) => p.toJSON()))

      return pago
    } catch (error) {
      console.error("Error creando pago:", error)
      throw error
    }
  }

  static async procesar(pagoId) {
    try {
      const pagos = this.obtenerTodos()
      const indice = pagos.findIndex((p) => p.id === pagoId)

      if (indice === -1) {
        throw new Error("Pago no encontrado")
      }

      const pago = pagos[indice]
      pago.procesar()

      // Marcar el préstamo como pagado
      const prestamo = PrestamoController.obtenerPorId(pago.prestamoId)

      if (prestamo) {
        prestamo.marcarComoPagado()
        const todosLosPrestamos = PrestamoController.obtenerTodos()
        const indicePrestamo = todosLosPrestamos.findIndex((p) => p.id === prestamo.id)

        if (indicePrestamo !== -1) {
          todosLosPrestamos[indicePrestamo] = prestamo
          LocalStorageService.saveLoans(todosLosPrestamos.map((p) => p.toJSON()))
        }
      }

      LocalStorageService.savePayments(pagos.map((p) => p.toJSON()))

      return pago
    } catch (error) {
      console.error("Error procesando pago:", error)
      throw error
    }
  }

  static obtenerEstadisticas() {
    const pagos = this.obtenerTodos()

    const completados = pagos.filter((p) => p.estado === "completado")
    const pendientes = pagos.filter((p) => p.estado === "pendiente")
    const fallidos = pagos.filter((p) => p.estado === "fallido")

    const montoTotal = completados.reduce((total, p) => total + p.monto, 0)

    return {
      total: pagos.length,
      completados: completados.length,
      pendientes: pendientes.length,
      fallidos: fallidos.length,
      montoTotal: Math.round(montoTotal * 100) / 100,
      promedioMonto: completados.length > 0 ? Math.round((montoTotal / completados.length) * 100) / 100 : 0,
    }
  }
}
