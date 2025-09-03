"use client"

import { useState, useEffect } from "react"
import { Bike, Edit2, Trash2, Plus, Zap, Car } from "lucide-react"
import { TransporteController } from "../../controllers/TransporteController.js"
import { EstacionController } from "../../controllers/EstacionController.js"
import { TransporteForm } from "../../components/Administrador/TransporteForm.jsx"

function Transportes() {
  const [transportes, setTransportes] = useState([])
  const [estaciones, setEstaciones] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [transporteEditando, setTransporteEditando] = useState(null)
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" })
  const [filtroTipo, setFiltroTipo] = useState("")

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = () => {
    try {
      const todosLosTransportes = TransporteController.obtenerTodos()
      const todasLasEstaciones = EstacionController.obtenerTodas()
      setTransportes(todosLosTransportes)
      setEstaciones(todasLasEstaciones)
    } catch (error) {
      mostrarMensaje("error", "Error cargando datos")
    }
  }

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto })
    setTimeout(() => setMensaje({ tipo: "", texto: "" }), 3000)
  }

  const handleCrearTransporte = (datosTransporte) => {
    try {
      TransporteController.crear(datosTransporte)
      cargarDatos()
      setMostrarFormulario(false)
      mostrarMensaje("success", "Transporte creado exitosamente")
    } catch (error) {
      mostrarMensaje("error", error.message)
    }
  }

  const handleEditarTransporte = (datosTransporte) => {
    try {
      TransporteController.actualizar(transporteEditando.id, datosTransporte)
      cargarDatos()
      setTransporteEditando(null)
      mostrarMensaje("success", "Transporte actualizado exitosamente")
    } catch (error) {
      mostrarMensaje("error", error.message)
    }
  }

  const handleEliminarTransporte = (id) => {
    if (window.confirm("¿Está seguro de eliminar este transporte?")) {
      try {
        TransporteController.eliminar(id)
        cargarDatos()
        mostrarMensaje("success", "Transporte eliminado exitosamente")
      } catch (error) {
        mostrarMensaje("error", error.message)
      }
    }
  }

  const obtenerNombreEstacion = (estacionId) => {
    const estacion = estaciones.find((e) => e.id === estacionId)
    return estacion ? estacion.nombre : "Sin asignar"
  }

  const getTransporteIcon = (tipo) => {
    switch (tipo) {
      case "bicicleta":
        return <Bike className="h-5 w-5 text-green-600" />
      case "scooter":
        return <Zap className="h-5 w-5 text-orange-600" />
      case "auto_electrico":
        return <Car className="h-5 w-5 text-blue-600" />
      default:
        return <Bike className="h-5 w-5 text-green-600" />
    }
  }

  const transportesFiltrados = filtroTipo ? transportes.filter((t) => t.tipo === filtroTipo) : transportes

  const tiposDisponibles = [...new Set(transportes.map((t) => t.tipo))]

  if (mostrarFormulario) {
    return (
      <div>
        <TransporteForm onSubmit={handleCrearTransporte} onCancel={() => setMostrarFormulario(false)} />
      </div>
    )
  }

  if (transporteEditando) {
    return (
      <div>
        <TransporteForm
          transporte={transporteEditando}
          onSubmit={handleEditarTransporte}
          onCancel={() => setTransporteEditando(null)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bike className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Gestión de Transportes</h1>
            <p className="text-gray-600">Administrar vehículos ecológicos disponibles</p>
          </div>
        </div>

        <button
          onClick={() => setMostrarFormulario(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
        >
          <Plus className="h-4 w-4" />
          Nuevo Transporte
        </button>
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

      {tiposDisponibles.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por tipo</label>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
          >
            <option value="">Todos los tipos</option>
            {tiposDisponibles.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo.charAt(0).toUpperCase() + tipo.slice(1).replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      )}

      {transportesFiltrados.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Bike className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">
            {filtroTipo ? `No hay transportes del tipo ${filtroTipo}` : "No hay transportes registrados"}
          </p>
          {!filtroTipo && (
            <button
              onClick={() => setMostrarFormulario(true)}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Crear el primer transporte
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transportesFiltrados.map((transporte) => (
            <div key={transporte.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getTransporteIcon(transporte.tipo)}
                  <div>
                    <h3 className="font-semibold text-gray-800">{transporte.codigo}</h3>
                    <p className="text-sm text-gray-600 capitalize">{transporte.tipo.replace("_", " ")}</p>
                  </div>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => setTransporteEditando(transporte)}
                    className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                    title="Editar transporte"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEliminarTransporte(transporte.id)}
                    disabled={!transporte.disponible}
                    className="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed p-1 rounded hover:bg-red-50 transition-colors"
                    title={!transporte.disponible ? "No se puede eliminar: está en uso" : "Eliminar transporte"}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  {/* Placeholder for MapPin icon */}
                  <span>{obtenerNombreEstacion(transporte.estacionId)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span>Estado: </span>
                  <span
                    className={`font-medium ${transporte.estado === "operativo" ? "text-green-600" : "text-red-600"}`}
                  >
                    {transporte.estado}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    transporte.disponible ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {transporte.disponible ? "Disponible" : "En uso"}
                </span>

                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    transporte.estado === "operativo" ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {transporte.estado}
                </span>
              </div>

              {transporte.kilometraje > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">Kilometraje: {transporte.kilometraje} km</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Transportes
