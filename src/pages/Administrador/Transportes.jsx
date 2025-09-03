"use client"

import { useState, useEffect } from "react"
import { Search, Plus, X, Upload } from "lucide-react"

function Transportes() {
  const [vistaActual, setVistaActual] = useState("scooter") // scooter, bicicleta, patineta
  const [transportes, setTransportes] = useState([])
  const [transportesFiltrados, setTransportesFiltrados] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState("create") // create, edit
  const [editingTransporte, setEditingTransporte] = useState(null)

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroModelo, setFiltroModelo] = useState("Todo los modelos de productos")
  const [filtroDisponibilidad, setFiltroDisponibilidad] = useState("Disponibilidad")
  const [filtroEstado, setFiltroEstado] = useState("Todos los estados")
  const [filtroPrecio, setFiltroPrecio] = useState("Todos los precios")

  // Datos mock para scooters
  const scootersData = [
    {
      id: "SC-001",
      producto: "Scooter XTL 350",
      año: 2024,
      modelo: "XTL 350",
      precio: 169900,
      stock: 10,
      disponibilidad: "Si",
      estado: "Activo",
    },
    {
      id: "SC-002",
      producto: "Scooter TL 350",
      año: 2023,
      modelo: "TL 350",
      precio: 369900,
      stock: 5,
      disponibilidad: "Si",
      estado: "Activo",
    },
    {
      id: "SC-003",
      producto: "Scooter FTL 500",
      año: 2025,
      modelo: "FTL 500",
      precio: 400000,
      stock: 1,
      disponibilidad: "No",
      estado: "Activo",
    },
    {
      id: "SC-004",
      producto: "Scooter FTL 400",
      año: 2023,
      modelo: "FTL 400",
      precio: 300000,
      stock: 1,
      disponibilidad: "Si",
      estado: "Activo",
    },
    {
      id: "SC-005",
      producto: "Scooter RTL 400",
      año: 2022,
      modelo: "RTL 400",
      precio: 250000,
      stock: 0,
      disponibilidad: "Si",
      estado: "Inactivo",
    },
  ]

  // Estadísticas calculadas
  const estadisticas = {
    total: scootersData.length,
    critico: scootersData.filter((s) => s.stock <= 1 && s.stock > 0).length,
    medio: scootersData.filter((s) => s.stock === 1).length,
    prestamos: scootersData.filter((s) => s.disponibilidad === "No").length,
  }

  useEffect(() => {
    setTransportes(scootersData)
    setTransportesFiltrados(scootersData)
  }, [])

  const handleSelectItem = (id) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(transportesFiltrados.map((t) => t.id))
    } else {
      setSelectedItems([])
    }
  }

  const openCreateModal = () => {
    setModalType("create")
    setEditingTransporte(null)
    setShowModal(true)
  }

  const openEditModal = (transporte) => {
    setModalType("edit")
    setEditingTransporte(transporte)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingTransporte(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <span>Transporte</span>
          <span className="text-gray-400">›</span>
          <span>Scooter</span>
        </div>
      </div>

      <div className="p-6">
        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total de Scooters</h3>
            <div className="text-3xl font-bold text-gray-900 mb-2">{estadisticas.total}</div>
            <button className="text-sm text-blue-600 hover:text-blue-800">Ver los Scooters</button>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Estado Crítico</h3>
            <div className="text-3xl font-bold text-gray-900 mb-2">{estadisticas.critico}</div>
            <button className="text-sm text-blue-600 hover:text-blue-800">Ver los Scooters</button>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Estado Medio</h3>
            <div className="text-3xl font-bold text-gray-900 mb-2">{estadisticas.medio}</div>
            <button className="text-sm text-blue-600 hover:text-blue-800">Ver los Scooters</button>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Scooters en Prestamos</h3>
            <div className="text-3xl font-bold text-gray-900 mb-2">{estadisticas.prestamos}</div>
            <button className="text-sm text-blue-600 hover:text-blue-800">Ver los Scooters</button>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={openCreateModal}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
          >
            Editar
          </button>
          <button
            onClick={openCreateModal}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Agregar Scooter
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Escribe el nombre del producto"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <select
              value={filtroModelo}
              onChange={(e) => setFiltroModelo(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option>Todo los modelos de productos</option>
              <option>XTL 350</option>
              <option>TL 350</option>
              <option>FTL 500</option>
            </select>

            <select
              value={filtroDisponibilidad}
              onChange={(e) => setFiltroDisponibilidad(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option>Disponibilidad</option>
              <option>Si</option>
              <option>No</option>
            </select>

            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option>Todos los estados</option>
              <option>Activo</option>
              <option>Inactivo</option>
            </select>

            <select
              value={filtroPrecio}
              onChange={(e) => setFiltroPrecio(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option>Todos los precios</option>
              <option>Menor a 200.000</option>
              <option>200.000 - 400.000</option>
              <option>Mayor a 400.000</option>
            </select>
          </div>
        </div>

        {/* Tabla de datos */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === transportesFiltrados.length && transportesFiltrados.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-4 py-3 text-left font-medium">ID</th>
                  <th className="px-4 py-3 text-left font-medium">Producto</th>
                  <th className="px-4 py-3 text-left font-medium">Año</th>
                  <th className="px-4 py-3 text-left font-medium">Modelo</th>
                  <th className="px-4 py-3 text-left font-medium">Precios</th>
                  <th className="px-4 py-3 text-left font-medium">Stock</th>
                  <th className="px-4 py-3 text-left font-medium">Disponibilidad</th>
                  <th className="px-4 py-3 text-left font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transportesFiltrados.map((transporte, index) => (
                  <tr key={transporte.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(transporte.id)}
                        onChange={() => handleSelectItem(transporte.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{transporte.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{transporte.producto}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{transporte.año}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{transporte.modelo}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{transporte.precio.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        {transporte.stock}
                        {transporte.stock <= 1 && transporte.stock > 0 && <span className="text-yellow-500">⚠️</span>}
                        {transporte.stock === 0 && <span className="text-red-500">⚠️</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{transporte.disponibilidad}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          transporte.estado === "Activo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transporte.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Botones de acción inferior */}
        {selectedItems.length > 0 && (
          <div className="mt-4 flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
            <span className="text-sm text-gray-600">{selectedItems.length} Items Seleccionados</span>
            <button className="text-sm text-blue-600 hover:text-blue-800 underline">Colocar Inactivo</button>
            <button className="text-sm text-red-600 hover:text-red-800 underline">Eliminar Producto</button>
            <button onClick={() => setSelectedItems([])} className="text-sm text-gray-600 hover:text-gray-800">
              X
            </button>
          </div>
        )}
      </div>

      {/* Modal de registro/edición */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {modalType === "create" ? "Registro de Transporte" : "Editar Transporte"}
                </h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Información del transporte</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Agrupar información relacionada con la identificación única de un transporte
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Id del Vehículo</label>
                        <input
                          type="text"
                          defaultValue={editingTransporte?.id || "SC-001"}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Vehículo</label>
                        <input
                          type="text"
                          defaultValue={editingTransporte?.producto || "Scooter XTL 350"}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                          <option>Activo</option>
                          <option>Inactivo</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Estación Asignada</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                          <option>ES-001</option>
                          <option>ES-002</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Vehículo</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                          <option>Scooter</option>
                          <option>Bicicleta</option>
                          <option>Patineta</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Año</label>
                        <input
                          type="number"
                          defaultValue={editingTransporte?.año || 2024}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Precio</label>
                        <input
                          type="number"
                          defaultValue={editingTransporte?.precio || 169900}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Disponibilidad</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                          <option>Si</option>
                          <option>No</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Modelo</label>
                        <input
                          type="text"
                          defaultValue={editingTransporte?.modelo || "TL 4090"}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                        <input
                          type="text"
                          defaultValue="Negro"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subir foto del vehículo</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-2">Sube aquí los archivos</p>
                      <p className="text-sm text-gray-400">0</p>
                      <button className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium">
                        Buscar en archivos
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium">
                    {modalType === "create" ? "Finalizar Registro" : "Guardar Cambios"}
                  </button>
                  <button
                    onClick={closeModal}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-medium"
                  >
                    {modalType === "create" ? "Limpiar Campos" : "Cancelar"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Transportes
