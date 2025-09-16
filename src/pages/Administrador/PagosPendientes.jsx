"use client"

import { useState, useEffect } from "react"
import { CreditCard, User, MapPin, Clock, Euro, CheckCircle, AlertCircle } from "lucide-react"
import { PrestamoController } from "../../controllers/PrestamoController.js"
import { UsuarioController } from "../../controllers/UsuarioController.js"
import { EstacionController } from "../../controllers/EstacionController.js"
import { TransporteController } from "../../controllers/TransporteController.js"

function PagosPendientes() {
  const [prestamosPendientes, setPrestamosPendientes] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [estaciones, setEstaciones] = useState([])
  const [transportes, setTransportes] = useState([])
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = () => {
    try {
      setLoading(true)

      // Get all loans and filter by pending payment status
      const todosLosPrestamos = PrestamoController.obtenerTodos()
      const pendientes = todosLosPrestamos.filter(
        (prestamo) => prestamo.estado === "pendiente" || (prestamo.estado === "finalizado" && !prestamo.pagado),
      )

      setPrestamosPendientes(pendientes)
      setUsuarios(UsuarioController.obtenerTodos())
      setEstaciones(EstacionController.obtenerTodas())
      setTransportes(TransporteController.obtenerTodos())
    } catch (error) {
      console.error("Error cargando datos:", error)
      mostrarMensaje("error", "Error cargando datos de pagos pendientes")
    } finally {
      setLoading(false)
    }
  }

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto })
    setTimeout(() => setMensaje({ tipo: "", texto: "" }), 3000)
  }

  const confirmarPago = (prestamoId) => {
    try {
      // Find the loan and mark as paid
      const prestamo = PrestamoController.obtenerPorId(prestamoId)
      if (!prestamo) {
        throw new Error("Préstamo no encontrado")
      }

      // If loan is pending, activate it and mark as paid
      if (prestamo.estado === "pendiente") {
        prestamo.estado = "activo"
        prestamo.pagado = true
        prestamo.fechaPago = new Date().toISOString()
      } else if (prestamo.estado === "finalizado" && !prestamo.pagado) {
        prestamo.marcarComoPagado()
      }

      // Update in storage
      const todosLosPrestamos = PrestamoController.obtenerTodos()
      const indice = todosLosPrestamos.findIndex((p) => p.id === prestamoId)
      if (indice !== -1) {
        todosLosPrestamos[indice] = prestamo
        // Save back to localStorage (assuming this is how PrestamoController works)
        localStorage.setItem("ecomove_loans", JSON.stringify(todosLosPrestamos.map((p) => p.toJSON())))
      }

      cargarDatos()
      mostrarMensaje("success", "Pago confirmado exitosamente. El alquiler está ahora activo.")
    } catch (error) {
      console.error("Error confirmando pago:", error)
      mostrarMensaje("error", error.message || "Error al confirmar el pago")
    }
  }

  const rechazarPago = (prestamoId) => {
    const motivo = prompt("Ingrese el motivo del rechazo:")
    if (!motivo) return

    try {
      const prestamo = PrestamoController.obtenerPorId(prestamoId)
      if (!prestamo) {
        throw new Error("Préstamo no encontrado")
      }

      prestamo.cancelar(motivo)

      // Update in storage
      const todosLosPrestamos = PrestamoController.obtenerTodos()
      const indice = todosLosPrestamos.findIndex((p) => p.id === prestamoId)
      if (indice !== -1) {
        todosLosPrestamos[indice] = prestamo
        localStorage.setItem("ecomove_loans", JSON.stringify(todosLosPrestamos.map((p) => p.toJSON())))
      }

      cargarDatos()
      mostrarMensaje("success", "Reserva cancelada exitosamente")
    } catch (error) {
      console.error("Error cancelando reserva:", error)
      mostrarMensaje("error", error.message || "Error al cancelar la reserva")
    }
  }

  const obtenerNombreUsuario = (usuarioId) => {
    const usuario = usuarios.find((u) => u.id === usuarioId)
    return usuario ? usuario.nombre : "Usuario no encontrado"
  }

  const obtenerEmailUsuario = (usuarioId) => {
    const usuario = usuarios.find((u) => u.id === usuarioId)
    return usuario ? usuario.email : ""
  }

  const obtenerNombreEstacion = (estacionId) => {
    const estacion = estaciones.find((e) => e.id === estacionId)
    return estacion ? estacion.nombre : "Estación no encontrada"
  }

  const obtenerTransporte = (transporteId) => {
    return transportes.find((t) => t.id === transporteId)
  }

  const formatearFecha = (fechaISO) => {
    return new Date(fechaISO).toLocaleString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTransporteIcon = (transporteId) => {
    const transporte = obtenerTransporte(transporteId)
    if (!transporte) return "🚲"

    switch (transporte.tipo) {
      case "bicicleta":
        return "🚲"
      case "scooter":
        return "🛴"
      case "patineta":
        return "🛹"
      case "skateboard":
        return "🛹"
      case "moto":
        return "🏍️"
      default:
        return "🚲"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando pagos pendientes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CreditCard className="h-8 w-8 text-yellow-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Pagos Pendientes</h1>
            <p className="text-gray-600">Confirmar pagos en efectivo de reservas</p>
          </div>
        </div>

        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg font-medium">
          {prestamosPendientes.length} pendiente{prestamosPendientes.length !== 1 ? "s" : ""}
        </div>
      </div>

      {mensaje.texto && (
        <div
          className={`p-4 rounded-lg ${
            mensaje.tipo === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      {prestamosPendientes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">¡Excelente! No hay pagos pendientes</p>
          <p className="text-sm text-gray-400">Todas las reservas han sido confirmadas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {prestamosPendientes.map((prestamo) => {
            const transporte = obtenerTransporte(prestamo.transporteId)
            const usuario = usuarios.find((u) => u.id === prestamo.usuarioId)

            return (
              <div key={prestamo.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-400">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getTransporteIcon(prestamo.transporteId)}</span>
                    <div>
                      <h3 className="font-semibold text-gray-800">{transporte?.codigo || "Código no disponible"}</h3>
                      <p className="text-sm text-gray-600 capitalize">
                        {transporte?.tipo?.replace("_", " ") || "Tipo no disponible"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {prestamo.estado === "pendiente" ? "Pendiente Pago" : "Pago Pendiente"}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>
                      <strong>{obtenerNombreUsuario(prestamo.usuarioId)}</strong>
                      {obtenerEmailUsuario(prestamo.usuarioId) && (
                        <span className="text-gray-500"> - {obtenerEmailUsuario(prestamo.usuarioId)}</span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>
                      <strong>Recogida:</strong> {obtenerNombreEstacion(prestamo.estacionOrigenId)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>
                      <strong>Fecha reserva:</strong> {formatearFecha(prestamo.fechaInicio)}
                    </span>
                  </div>

                  {prestamo.informacionUsuario && (
                    <div className="bg-gray-50 rounded-lg p-3 text-sm">
                      <p className="font-medium text-gray-700 mb-1">Información del cliente:</p>
                      <p>
                        <strong>Teléfono:</strong> {prestamo.informacionUsuario.telefono}
                      </p>
                      <p>
                        <strong>Dirección:</strong> {prestamo.informacionUsuario.direccion}
                      </p>
                      {prestamo.informacionUsuario.documento && (
                        <p>
                          <strong>Documento:</strong> {prestamo.informacionUsuario.documento}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 mb-4">
                  <span className="text-sm text-gray-600">Monto a cobrar:</span>
                  <div className="flex items-center gap-1 text-green-600 font-bold text-lg">
                    <Euro className="h-5 w-5" />
                    {prestamo.precioBase?.toFixed(2) || prestamo.tarifaCalculada?.toFixed(2) || "0.00"}
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium">Instrucciones:</p>
                      <p>
                        El cliente debe pagar en efectivo al recoger el vehículo. Una vez recibido el pago, confirma
                        para activar el alquiler.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => confirmarPago(prestamo.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Confirmar Pago
                  </button>
                  <button
                    onClick={() => rechazarPago(prestamo.id)}
                    className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default PagosPendientes
