"use client"

import React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const AdminSidebar = ({ navegacion, paginaActiva, setPaginaActiva }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}>
      {/* Logo y Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">EcoMove</h1>
              <p className="text-xs text-gray-500">ADMIN PANEL</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navegacion.map((item) => {
          const IconoComponente = item.icono
          const isActive = paginaActiva === item.id

          return (
            <button
              key={item.id}
              onClick={() => setPaginaActiva(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive ? "bg-green-100 text-green-700 border border-green-200" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <IconoComponente className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">{item.nombre}</span>}
            </button>
          )
        })}
      </nav>
    </div>
  )
}

export default AdminSidebar
