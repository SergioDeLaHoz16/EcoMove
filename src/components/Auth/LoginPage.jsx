"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

const LoginPage = ({ onClose, onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    onLogin()
  }

  return (
    <div className="fixed inset-0 bg-gray-100 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 bg-green-500 rounded-lg"></div>
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">EcoMove</h1>
          <p className="text-xs text-gray-500 mb-6">SMART CITY TRANSIT</p>

          <h2 className="text-xl font-semibold text-green-600 mb-2">Por favor, inicia sesión</h2>
          <p className="text-sm text-gray-600 text-center leading-relaxed">
            Nos encanta que nos hayas escogido
            <br />
            Pero antes de continuar, necesitamos que por favor inicies
            <br />
            sesión o create una cuenta
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <button type="button" className="text-gray-600 hover:text-gray-800">
              ¿Olvidaste tu contraseña?
            </button>
            <button type="button" className="text-green-600 hover:text-green-700 font-medium">
              Recordar contraseña
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Iniciar Sesión
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">O</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5 mr-3" />
            Iniciar Sesión con Google
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-sm text-gray-600">¿No tienes cuenta? </span>
          <button onClick={onSwitchToRegister} className="text-sm text-green-600 hover:text-green-700 font-medium">
            Create una cuenta gratis
          </button>
        </div>

        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          ✕
        </button>
      </div>
    </div>
  )
}

export default LoginPage
