"use client"

import { useState } from "react"
import { X, User, Mail, Phone, MapPin, CreditCard, AlertCircle, CheckCircle } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext.jsx"
import { useRentalPricing } from "../../hooks/useRentalPricing.js"
import { UsuarioController } from "../../controllers/UsuarioController.js"
import { PrestamoController } from "../../controllers/PrestamoController.js"

const CheckoutModal = ({ isOpen, onClose, cartItems, totalPrice, onOrderComplete }) => {
  const { user, isAuthenticated, login } = useAuth()
  const { formatPrice } = useRentalPricing("bicicleta")

  const [currentStep, setCurrentStep] = useState(isAuthenticated ? "payment" : "auth")
  const [authMode, setAuthMode] = useState("login")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Auth form data
  const [authData, setAuthData] = useState({
    email: "",
    password: "",
    nombre: "",
    confirmPassword: "",
  })

  // User info form data
  const [userInfo, setUserInfo] = useState({
    nombre: user?.nombre || "",
    email: user?.email || "",
    telefono: user?.telefono || "",
    direccion: user?.direccion || "",
    documento: user?.documento || "",
  })

  const handleAuthSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (authMode === "login") {
        // Login existing user
        const loginResult = await login(authData.email, authData.password)
        if (loginResult.success) {
          setUserInfo({
            nombre: loginResult.user.nombre,
            email: loginResult.user.email,
            telefono: loginResult.user.telefono || "",
            direccion: loginResult.user.direccion || "",
            documento: loginResult.user.documento || "",
          })
          setCurrentStep("userInfo")
        } else {
          setError(loginResult.message || "Error al iniciar sesión")
        }
      } else {
        // Register new user
        if (authData.password !== authData.confirmPassword) {
          setError("Las contraseñas no coinciden")
          return
        }

        const newUser = UsuarioController.crear({
          nombre: authData.nombre,
          email: authData.email,
          password: authData.password,
          tipo: "cliente",
        })

        // Auto login after registration
        const loginResult = await login(authData.email, authData.password)
        if (loginResult.success) {
          setUserInfo({
            nombre: newUser.nombre,
            email: newUser.email,
            telefono: "",
            direccion: "",
            documento: "",
          })
          setCurrentStep("userInfo")
        }
      }
    } catch (error) {
      setError(error.message || "Error en la autenticación")
    } finally {
      setLoading(false)
    }
  }

  const handleUserInfoSubmit = (e) => {
    e.preventDefault()
    if (!userInfo.nombre || !userInfo.email || !userInfo.telefono || !userInfo.direccion) {
      setError("Por favor completa todos los campos requeridos")
      return
    }
    setCurrentStep("payment")
  }

  const handlePaymentSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Create rentals for each cart item
      const createdRentals = []

      for (const item of cartItems) {
        const rentalData = {
          usuarioId: user.id,
          transporteId: item.transportId,
          estacionOrigenId: item.startStationId,
          estacionDestinoId: item.endStationId || item.startStationId,
          fechaInicio: new Date(item.startDateTime).toISOString(),
          fechaFinEstimada: new Date(item.endDateTime).toISOString(),
          tipoAlquiler: item.rentalType,
          precioBase: item.basePrice,
          estado: "pendiente", // Pending payment confirmation
          metodoPago: "efectivo",
          informacionUsuario: userInfo,
        }

        const prestamo = PrestamoController.crear(rentalData)
        createdRentals.push(prestamo)
      }

      setSuccess("¡Reserva creada exitosamente! Tu pedido está pendiente de confirmación de pago.")
      setCurrentStep("confirmation")

      // Call completion callback
      onOrderComplete && onOrderComplete(createdRentals)
    } catch (error) {
      setError(error.message || "Error al procesar el pago")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {currentStep === "auth" && "Iniciar Sesión"}
              {currentStep === "userInfo" && "Información Personal"}
              {currentStep === "payment" && "Método de Pago"}
              {currentStep === "confirmation" && "Confirmación"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center space-x-2 mt-4">
            <div className={`w-3 h-3 rounded-full ${currentStep !== "auth" ? "bg-green-600" : "bg-gray-300"}`}></div>
            <div className="flex-1 h-1 bg-gray-200 rounded">
              <div
                className={`h-full bg-green-600 rounded transition-all duration-300 ${
                  currentStep === "auth"
                    ? "w-0"
                    : currentStep === "userInfo"
                      ? "w-1/3"
                      : currentStep === "payment"
                        ? "w-2/3"
                        : "w-full"
                }`}
              ></div>
            </div>
            <div
              className={`w-3 h-3 rounded-full ${currentStep === "confirmation" ? "bg-green-600" : "bg-gray-300"}`}
            ></div>
          </div>
        </div>

        <div className="p-6">
          {/* Authentication Step */}
          {currentStep === "auth" && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600">
                  Para continuar con tu reserva, necesitas iniciar sesión o crear una cuenta
                </p>
              </div>

              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setAuthMode("login")}
                  className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                    authMode === "login" ? "bg-white text-green-600 shadow-sm" : "text-gray-600"
                  }`}
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => setAuthMode("register")}
                  className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                    authMode === "register" ? "bg-white text-green-600 shadow-sm" : "text-gray-600"
                  }`}
                >
                  Registrarse
                </button>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === "register" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={authData.nombre}
                        onChange={(e) => setAuthData({ ...authData, nombre: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Tu nombre completo"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={authData.email}
                      onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                  <input
                    type="password"
                    value={authData.password}
                    onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                </div>

                {authMode === "register" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Contraseña</label>
                    <input
                      type="password"
                      value={authData.confirmPassword}
                      onChange={(e) => setAuthData({ ...authData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Procesando..." : authMode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
                </button>
              </form>
            </div>
          )}

          {/* User Info Step */}
          {currentStep === "userInfo" && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600">Completa tu información personal para la reserva</p>
              </div>

              <form onSubmit={handleUserInfoSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo *</label>
                    <input
                      type="text"
                      value={userInfo.nombre}
                      onChange={(e) => setUserInfo({ ...userInfo, nombre: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={userInfo.email}
                      onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={userInfo.telefono}
                        onChange={(e) => setUserInfo({ ...userInfo, telefono: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="+57 300 123 4567"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Documento</label>
                    <input
                      type="text"
                      value={userInfo.documento}
                      onChange={(e) => setUserInfo({ ...userInfo, documento: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Cédula o documento de identidad"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dirección *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      value={userInfo.direccion}
                      onChange={(e) => setUserInfo({ ...userInfo, direccion: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Tu dirección completa"
                      rows="3"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                >
                  Continuar al Pago
                </button>
              </form>
            </div>
          )}

          {/* Payment Step */}
          {currentStep === "payment" && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Resumen del Pedido</h3>
                <div className="space-y-2">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {item.vehicleName} - {item.rentalType === "hourly" ? "Por Hora" : "Por Día"}
                      </span>
                      <span>{formatPrice(item.basePrice)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total:</span>
                    <span className="text-green-600">{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Método de Pago</h3>

                <div className="border-2 border-green-200 bg-green-50 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-6 h-6 text-green-600" />
                    <div>
                      <h4 className="font-semibold text-green-800">Pago en Efectivo</h4>
                      <p className="text-sm text-green-700">Paga al momento de recoger tu vehículo en la estación</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-yellow-800 font-medium">Importante:</p>
                      <p className="text-yellow-700 mt-1">
                        Tu reserva quedará pendiente hasta que confirmes el pago en efectivo al recoger el vehículo. El
                        administrador activará tu alquiler una vez reciba el pago.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handlePaymentSubmit}>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Procesando Reserva..." : "Confirmar Reserva"}
                </button>
              </form>
            </div>
          )}

          {/* Confirmation Step */}
          {currentStep === "confirmation" && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">¡Reserva Confirmada!</h3>
                <p className="text-gray-600">
                  Tu reserva ha sido creada exitosamente. Recibirás un email con los detalles.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-left">
                <h4 className="font-semibold text-green-800 mb-2">Próximos Pasos:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Dirígete a la estación de recogida en la fecha y hora programada</li>
                  <li>• Lleva efectivo para el pago ({formatPrice(totalPrice)})</li>
                  <li>• El administrador activará tu alquiler al recibir el pago</li>
                  <li>• Podrás ver el estado de tu reserva en tu dashboard</li>
                </ul>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
              >
                Cerrar
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3 mt-4">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3 mt-4">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-green-800 text-sm">{success}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CheckoutModal
