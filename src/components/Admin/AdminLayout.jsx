"use client"

import { useState } from "react"
import { LayoutDashboard, Users, MapPin, Bike, Play, BarChart3 } from "lucide-react"
import AdminSidebar from "./AdminSidebar"
import AdminHeader from "./AdminHeader"
import Dashboard from "../../pages/Administrador/Dashboard"
import Usuarios from "../../pages/Administrador/Usuarios"
import Estaciones from "../../pages/Administrador/Estaciones"
import Transportes from "../../pages/Administrador/Transportes"
import Prestamos from "../../pages/Administrador/Prestamos"
import { Historial } from "../../pages/Administrador/Historial"
import { useAuth } from "../../contexts/AuthContext"

const AdminLayout = () => {
  const { logout } = useAuth()
  const [paginaActiva, setPaginaActiva] = useState("dashboard")

  const navegacion = [
    {
      id: "dashboard",
      nombre: "Dashboard",
      icono: LayoutDashboard,
    },
    {
      id: "usuarios",
      nombre: "Usuarios",
      icono: Users,
    },
    {
      id: "estaciones",
      nombre: "Estaciones",
      icono: MapPin,
    },
    {
      id: "transportes",
      nombre: "Transportes",
      icono: Bike,
    },
    {
      id: "prestamos",
      nombre: "Préstamos",
      icono: Play,
    },
    {
      id: "historial",
      nombre: "Historial",
      icono: BarChart3,
    },
  ]

  const renderContent = () => {
    switch (paginaActiva) {
      case "dashboard":
        return <Dashboard navegacion={navegacion} setPaginaActiva={setPaginaActiva} />
      case "usuarios":
        return <Usuarios />
      case "estaciones":
        return <Estaciones />
      case "transportes":
        return <Transportes />
      case "prestamos":
        return <Prestamos />
      case "historial":
        return <Historial />
      default:
        return <Dashboard navegacion={navegacion} setPaginaActiva={setPaginaActiva} />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar navegacion={navegacion} paginaActiva={paginaActiva} setPaginaActiva={setPaginaActiva} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader onLogout={logout} />

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">{renderContent()}</main>
      </div>
    </div>
  )
}

export default AdminLayout
