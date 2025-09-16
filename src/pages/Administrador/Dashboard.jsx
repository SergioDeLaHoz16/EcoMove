"use client"

import { useState, useEffect } from "react"
import { BarChart3, Users, MapPin, Bike, Play, TrendingUp, Euro, Clock } from "lucide-react"
import { PrestamoController } from "../../controllers/PrestamoController.js"
import { UsuarioController } from "../../controllers/UsuarioController.js"
import { EstacionController } from "../../controllers/EstacionController.js"
import { TransporteController } from "../../controllers/TransporteController.js"

function Dashboard({ navegacion, setPaginaActiva }) {
  const [estadisticas, setEstadisticas] = useState({
    prestamos: { total: 0, activos: 0, finalizados: 0, cancelados: 0, ingresoTotal: 0, duracionPromedio: 0 },
    usuarios: 0,
    estaciones: 0,
    transportes: 0,
  })
  const [prestamosRecientes, setPrestamosRecientes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      setLoading(true)

      // Obtener estadísticas de préstamos
      const estadisticasPrestamos = PrestamoController.obtenerEstadisticas()

      // Obtener conteos de otras entidades
      const usuarios = UsuarioController.obtenerTodos()
      const estaciones = EstacionController.obtenerTodas()
      const transportes = TransporteController.obtenerTodos()

      // Obtener préstamos recientes (últimos 5)
      const todosLosPrestamos = PrestamoController.obtenerTodos()
      const recientes = todosLosPrestamos.sort((a, b) => new Date(b.fechaInicio) - new Date(a.fechaInicio)).slice(0, 5)

      setEstadisticas({
        prestamos: estadisticasPrestamos,
        usuarios: usuarios.length,
        estaciones: estaciones.length,
        transportes: transportes.length,
      })

      setPrestamosRecientes(recientes)
    } catch (error) {
      console.error("Error cargando datos del dashboard:", error)
    } finally {
      setLoading(false)
    }
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

  const obtenerUsuario = (usuarioId) => {
    const usuarios = UsuarioController.obtenerTodos()
    return usuarios.find((u) => u.id === usuarioId)
  }

  const obtenerTransporte = (transporteId) => {
    const transportes = TransporteController.obtenerTodos()
    return transportes.find((t) => t.id === transporteId)
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
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600">Resumen general del sistema EcoMove</p>
          </div>
        </div>
      </div>

      {/* Tarjetas de estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Play className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Préstamos Activos</p>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.prestamos.activos}</p>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={() => setPaginaActiva("prestamos")}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Ver préstamos →
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.usuarios}</p>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={() => setPaginaActiva("usuarios")}
              className="text-sm text-green-600 hover:text-green-800 font-medium"
            >
              Ver usuarios →
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Estaciones</p>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.estaciones}</p>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={() => setPaginaActiva("estaciones")}
              className="text-sm text-purple-600 hover:text-purple-800 font-medium"
            >
              Ver estaciones →
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Bike className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Transportes</p>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.transportes}</p>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={() => setPaginaActiva("transportes")}
              className="text-sm text-orange-600 hover:text-orange-800 font-medium"
            >
              Ver transportes →
            </button>
          </div>
        </div>
      </div>

      {/* Tarjetas de métricas financieras */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Euro className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
              <p className="text-2xl font-bold text-gray-900">€{estadisticas.prestamos.ingresoTotal}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Préstamos Completados</p>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.prestamos.finalizados}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Duración Promedio</p>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.prestamos.duracionPromedio} min</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Actividad Reciente</h2>
            <button
              onClick={() => setPaginaActiva("historial")}
              className="text-sm text-green-600 hover:text-green-800 font-medium"
            >
              Ver todo →
            </button>
          </div>
        </div>

        <div className="p-6">
          {prestamosRecientes.length === 0 ? (
            <div className="text-center py-8">
              <Play className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay actividad reciente</p>
            </div>
          ) : (
            <div className="space-y-4">
              {prestamosRecientes.map((prestamo) => {
                const usuario = obtenerUsuario(prestamo.usuarioId)
                const transporte = obtenerTransporte(prestamo.transporteId)

                return (
                  <div key={prestamo.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Play className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {usuario?.nombre || "Usuario"} - {transporte?.codigo || "Transporte"}
                        </p>
                        <p className="text-sm text-gray-600">{formatearFecha(prestamo.fechaInicio)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(prestamo.estado)}`}>
                        {prestamo.estado}
                      </span>
                      {prestamo.tarifaCalculada > 0 && (
                        <span className="text-sm font-medium text-gray-900">
                          €{prestamo.tarifaCalculada.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Accesos rápidos */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Accesos Rápidos</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {navegacion.map((item) => {
            const IconoComponente = item.icono
            return (
              <button
                key={item.id}
                onClick={() => setPaginaActiva(item.id)}
                className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors"
              >
                <IconoComponente className="w-8 h-8 text-gray-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">{item.nombre}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
