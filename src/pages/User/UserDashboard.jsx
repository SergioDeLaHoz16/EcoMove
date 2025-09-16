"use client"

import { useState, useEffect } from "react"
import { Clock, MapPin, Calendar, Euro, Bike, History, User, LogOut, RefreshCw } from "lucide-react"
import { PrestamoController } from "../../controllers/PrestamoController.js"
import { EstacionController } from "../../controllers/EstacionController.js"
import { TransporteController } from "../../controllers/TransporteController.js"
import { useAuth } from "../../contexts/AuthContext.jsx"

const UserDashboard = () => {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("active")
  const [prestamosActivos, setPrestamosActivos] = useState([])
  const [historialPrestamos, setHistorialPrestamos] = useState([])
  const [estaciones, setEstaciones] = useState([])
  const [transportes, setTransportes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      cargarDatos()
    }
  }, [user])

  const cargarDatos = async () => {
    try {
      setLoading(true)

      // Cargar datos del usuario específico
      const todosLosPrestamos = PrestamoController.obtenerPorUsuario(user.id)
      const activos = todosLosPrestamos.filter((p) => p.estado === "activo")
      const historial = todosLosPrestamos.filter((p) => p.estado === "finalizado" || p.estado === "cancelado")

      setPrestamosActivos(activos)
      setHistorialPrestamos(historial)
      setEstaciones(EstacionController.obtenerTodas())
      setTransportes(TransporteController.obtenerTodos())
    } catch (error) {
      console.error("Error cargando datos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFinalizarPrestamo = async (prestamoId) => {
    try {
      const estacionDestinoId = prompt(
        "Ingrese el ID de la estación de destino (o deje vacío para usar la misma estación):",
      )

      // If no destination station provided, use the origin station
      const prestamo = prestamosActivos.find((p) => p.id === prestamoId)
      const finalEstacionId = estacionDestinoId || prestamo.estacionOrigenId

      // Calculate estimated tariff (simple calculation for demo)
      const inicio = new Date(prestamo.fechaInicio)
      const ahora = new Date()
      const minutos = Math.ceil((ahora - inicio) / (1000 * 60))
      const tarifaEstimada = Math.max(minutos * 0.1, 2.0) // €0.10 per minute, minimum €2.00

      PrestamoController.finalizar(prestamoId, finalEstacionId, tarifaEstimada)

      // Reload data to reflect changes
      cargarDatos()

      alert(`Arrendamiento finalizado exitosamente. Tarifa: €${tarifaEstimada.toFixed(2)}`)
    } catch (error) {
      console.error("Error finalizando préstamo:", error)
      alert("Error al finalizar el arrendamiento: " + error.message)
    }
  }

  const obtenerNombreEstacion = (estacionId) => {
    const estacion = estaciones.find((e) => e.id === estacionId)
    return estacion ? estacion.nombre : "Estación no encontrada"
  }

  const obtenerTransporte = (transporteId) => {
    return transportes.find((t) => t.id === transporteId)
  }

  const calcularTiempoTranscurrido = (fechaInicio) => {
    const inicio = new Date(fechaInicio)
    const ahora = new Date()
    const minutos = Math.floor((ahora - inicio) / (1000 * 60))

    const horas = Math.floor(minutos / 60)
    const mins = minutos % 60

    if (horas > 0) {
      return `${horas}h ${mins}min`
    }
    return `${mins} min`
  }

  const formatearFecha = (fechaISO) => {
    return new Date(fechaISO).toLocaleDateString("es-ES", {
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
      case "auto_electrico":
        return "🚗"
      default:
        return "🚲"
    }
  }

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "activo":
        return "bg-green-100 text-green-800"
      case "finalizado":
        return "bg-blue-100 text-blue-800"
      case "cancelado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">EcoMove</h1>
                <p className="text-xs text-gray-500">SMART CITY TRANSIT</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={cargarDatos}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm">Actualizar</span>
              </button>
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {user?.nombre} {user?.apellido}
                </span>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Bienvenido, {user?.nombre}!</h2>
          <p className="text-gray-600">Gestiona tus arrendamientos de vehículos ecológicos desde aquí</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Bike className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Arrendamientos Activos</p>
                <p className="text-2xl font-bold text-gray-900">{prestamosActivos.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <History className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Completados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {historialPrestamos.filter((p) => p.estado === "finalizado").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Euro className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Gastado</p>
                <p className="text-2xl font-bold text-gray-900">
                  €
                  {historialPrestamos
                    .filter((p) => p.estado === "finalizado")
                    .reduce((total, p) => total + (p.tarifaCalculada || 0), 0)
                    .toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("active")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "active"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Arrendamientos Activos ({prestamosActivos.length})
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "history"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Historial ({historialPrestamos.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "active" && (
              <div>
                {prestamosActivos.length === 0 ? (
                  <div className="text-center py-12">
                    <Bike className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes arrendamientos activos</h3>
                    <p className="text-gray-600 mb-6">
                      Explora nuestros vehículos disponibles y comienza tu próximo viaje ecológico
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Explorar Vehículos
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {prestamosActivos.map((prestamo) => {
                      const transporte = obtenerTransporte(prestamo.transporteId)

                      return (
                        <div
                          key={prestamo.id}
                          className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <span className="text-3xl">{getTransporteIcon(prestamo.transporteId)}</span>
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {transporte?.codigo || "Código no disponible"}
                                </h3>
                                <p className="text-sm text-gray-600 capitalize">
                                  {transporte?.tipo?.replace("_", " ") || "Tipo no disponible"}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col space-y-2">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(prestamo.estado)}`}
                              >
                                En uso
                              </span>
                              <button
                                onClick={() => handleFinalizarPrestamo(prestamo.id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                              >
                                Finalizar
                              </button>
                            </div>
                          </div>

                          <div className="space-y-3 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4" />
                              <span>Desde: {obtenerNombreEstacion(prestamo.estacionOrigenId)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4" />
                              <span>Tiempo transcurrido: {calcularTiempoTranscurrido(prestamo.fechaInicio)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4" />
                              <span>Iniciado: {formatearFecha(prestamo.fechaInicio)}</span>
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Tarifa estimada:</span>
                              <span className="font-semibold text-green-600">
                                €{(prestamo.tarifaCalculada || 0).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === "history" && (
              <div>
                {/* ... existing history code ... */}
                {historialPrestamos.length === 0 ? (
                  <div className="text-center py-12">
                    <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes historial de arrendamientos</h3>
                    <p className="text-gray-600">Tus arrendamientos completados aparecerán aquí</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {historialPrestamos.map((prestamo) => {
                      const transporte = obtenerTransporte(prestamo.transporteId)

                      return (
                        <div key={prestamo.id} className="border border-gray-200 rounded-lg p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl opacity-60">{getTransporteIcon(prestamo.transporteId)}</span>
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {transporte?.codigo || "Código no disponible"}
                                </h3>
                                <p className="text-sm text-gray-600 capitalize">
                                  {transporte?.tipo?.replace("_", " ") || "Tipo no disponible"}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(prestamo.estado)}`}
                            >
                              {prestamo.estado === "finalizado" ? "Completado" : "Cancelado"}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4" />
                                <span>Desde: {obtenerNombreEstacion(prestamo.estacionOrigenId)}</span>
                              </div>
                              {prestamo.estacionDestinoId && (
                                <div className="flex items-center space-x-2">
                                  <MapPin className="w-4 h-4" />
                                  <span>Hasta: {obtenerNombreEstacion(prestamo.estacionDestinoId)}</span>
                                </div>
                              )}
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4" />
                                <span>Inicio: {formatearFecha(prestamo.fechaInicio)}</span>
                              </div>
                              {prestamo.fechaFin && (
                                <div className="flex items-center space-x-2">
                                  <Calendar className="w-4 h-4" />
                                  <span>Fin: {formatearFecha(prestamo.fechaFin)}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <span className="text-sm text-gray-600">
                                Duración: {prestamo.obtenerDuracionFormateada()}
                              </span>
                            </div>
                            <span className="font-semibold text-gray-900">
                              €{(prestamo.tarifaCalculada || 0).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
