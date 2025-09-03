"use client"

import { useState, lazy, Suspense } from "react"
import Homepage from "./pages/Home/HomePage"
import AdminLayout from "./components/Admin/AdminLayout"
import LoginPage from "./components/Auth/LoginPage"
import RegisterPage from "./components/Auth/RegisterPage"
import { Users, MapPin, Bike, FileText, BarChart3, Settings } from "lucide-react"

const Dashboard = lazy(() => import("./pages/Administrador/Dashboard"))
const Usuarios = lazy(() => import("./pages/Administrador/Usuarios"))
const Estaciones = lazy(() => import("./pages/Administrador/Estaciones"))
const Transportes = lazy(() => import("./pages/Administrador/Transportes"))
const Prestamos = lazy(() => import("./pages/Administrador/Prestamos"))

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentView, setCurrentView] = useState("home") // 'home', 'login', 'register'
  const [paginaActiva, setPaginaActiva] = useState("dashboard")

  console.log("[v0] App render - isLoggedIn:", isLoggedIn, "currentView:", currentView)

  const navegacion = [
    { id: "dashboard", nombre: "Dashboard", icono: BarChart3 },
    { id: "usuarios", nombre: "Usuarios", icono: Users },
    { id: "estaciones", nombre: "Estaciones", icono: MapPin },
    { id: "transportes", nombre: "Transportes", icono: Bike },
    { id: "prestamos", nombre: "Préstamos", icono: FileText },
    { id: "configuracion", nombre: "Configuración", icono: Settings },
  ]

  const handleLoginClick = () => {
    setCurrentView("login")
  }

  const handleRegisterClick = () => {
    setCurrentView("register")
  }

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleRegister = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentView("home")
    setPaginaActiva("dashboard")
  }

  const handleCloseAuth = () => {
    setCurrentView("home")
  }

  const handleSwitchToLogin = () => {
    setCurrentView("login")
  }

  const handleSwitchToRegister = () => {
    setCurrentView("register")
  }

  const renderAdminContent = () => {
    switch (paginaActiva) {
      case "dashboard":
        return (
          <Suspense fallback={<div className="flex items-center justify-center h-64">Cargando...</div>}>
            <Dashboard navegacion={navegacion} setPaginaActiva={setPaginaActiva} />
          </Suspense>
        )
      case "usuarios":
        return (
          <Suspense fallback={<div className="flex items-center justify-center h-64">Cargando...</div>}>
            <Usuarios navegacion={navegacion} setPaginaActiva={setPaginaActiva} />
          </Suspense>
        )
      case "estaciones":
        return (
          <Suspense fallback={<div className="flex items-center justify-center h-64">Cargando...</div>}>
            <Estaciones navegacion={navegacion} setPaginaActiva={setPaginaActiva} />
          </Suspense>
        )
      case "transportes":
        return (
          <Suspense fallback={<div className="flex items-center justify-center h-64">Cargando...</div>}>
            <Transportes navegacion={navegacion} setPaginaActiva={setPaginaActiva} />
          </Suspense>
        )
      case "prestamos":
        return (
          <Suspense fallback={<div className="flex items-center justify-center h-64">Cargando...</div>}>
            <Prestamos navegacion={navegacion} setPaginaActiva={setPaginaActiva} />
          </Suspense>
        )
      case "configuracion":
        return (
          <div className="text-center py-12">
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Configuración</h2>
            <p className="text-gray-600">Panel de configuración del sistema</p>
          </div>
        )
      default:
        return (
          <Suspense fallback={<div className="flex items-center justify-center h-64">Cargando...</div>}>
            <Dashboard navegacion={navegacion} setPaginaActiva={setPaginaActiva} />
          </Suspense>
        )
    }
  }

  if (isLoggedIn) {
    console.log("[v0] Rendering AdminLayout")
    return (
      <AdminLayout
        navegacion={navegacion}
        paginaActiva={paginaActiva}
        setPaginaActiva={setPaginaActiva}
        onLogout={handleLogout}
      >
        {renderAdminContent()}
      </AdminLayout>
    )
  }

  if (currentView === "login") {
    console.log("[v0] Rendering LoginPage")
    return <LoginPage onClose={handleCloseAuth} onLogin={handleLogin} onSwitchToRegister={handleSwitchToRegister} />
  }

  if (currentView === "register") {
    console.log("[v0] Rendering RegisterPage")
    return <RegisterPage onClose={handleCloseAuth} onRegister={handleRegister} onSwitchToLogin={handleSwitchToLogin} />
  }

  console.log("[v0] Rendering Homepage")
  return <Homepage onLoginClick={handleLoginClick} onRegisterClick={handleRegisterClick} />
}

export default App
