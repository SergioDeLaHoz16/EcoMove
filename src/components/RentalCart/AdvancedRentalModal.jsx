"use client"

import { useState, useEffect } from "react"
import { X, Calendar, Clock, MapPin, AlertCircle, CreditCard } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext.jsx"
import { useRentalPricing } from "../../hooks/useRentalPricing.js"
import { PrestamoController } from "../../controllers/PrestamoController.js"
import { EstacionController } from "../../controllers/EstacionController.js"
import { TransporteController } from "../../controllers/TransporteController.js"

const AdvancedRentalModal = ({ isOpen, onClose, vehicle, onConfirmRental }) => {
  const { user, isAuthenticated, login, register } = useAuth()
  const [step, setStep] = useState(1) // 1: Details, 2: Auth, 3: Payment
  const [rentalType, setRentalType] = useState("hourly")
  const [startDate, setStartDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [duration, setDuration] = useState(1)
  const [endDate, setEndDate] = useState("")
  const [endTime, setEndTime] = useState("")
  const [pickupStation, setPickupStation] = useState("")
  const [returnStation, setReturnStation] = useState("")
  const [availablePickupStations, setAvailablePickupStations] = useState([])
  const [availableReturnStations, setAvailableReturnStations] = useState([])
  const [availableTransports, setAvailableTransports] = useState([])
  const [selectedTransport, setSelectedTransport] = useState("")
  const [authForm, setAuthForm] = useState({ email: "", password: "", nombre: "", apellido: "", telefono: "" })
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { pricing, formatPrice } = useRentalPricing(vehicle?.tipo)

  useEffect(() => {
    if (isOpen && vehicle) {
      try {
        const allStations = EstacionController.obtenerTodas()
        const allTransports = TransporteController.obtenerTodos()

        // Filter available transports by vehicle type
        const filteredTransports = allTransports.filter(
          (transport) => transport.tipo === vehicle.tipo && transport.estado === "activo",
        )

        setAvailablePickupStations(allStations.filter((s) => s.activa))
        setAvailableReturnStations(allStations.filter((s) => s.activa))
        setAvailableTransports(filteredTransports)

        // Set default dates
        const now = new Date()
        setStartDate(now.toISOString().split("T")[0])
        setStartTime(now.toTimeString().slice(0, 5))

        // Reset form
        setStep(1)
        setError("")
        setAuthForm({ email: "", password: "", nombre: "", apellido: "", telefono: "" })
      } catch (error) {
        console.error("Error loading data:", error)
        setError("Error cargando datos del sistema")
      }
    }
  }, [isOpen, vehicle])

  useEffect(() => {
    // Calculate end time based on duration
    if (startDate && startTime && duration) {
      const start = new Date(`${startDate}T${startTime}`)
      const end = new Date(start)

      if (rentalType === "hourly") {
        end.setHours(end.getHours() + duration)
      } else {
        end.setDate(end.getDate() + duration)
      }

      setEndDate(end.toISOString().split("T")[0])
      setEndTime(end.toTimeString().slice(0, 5))
    }
  }, [startDate, startTime, duration, rentalType])

  const calculateTotalPrice = () => {
    if (!pricing) return 0

    const basePrice = rentalType === "hourly" ? pricing.hourly : pricing.daily
    return basePrice * duration
  }

  const handleNextStep = async () => {
    setError("")

    if (step === 1) {
      // Validate rental details
      if (!startDate || !startTime || !pickupStation || !selectedTransport) {
        setError("Por favor completa todos los campos requeridos")
        return
      }

      if (!isAuthenticated) {
        setStep(2)
      } else {
        setStep(3)
      }
    } else if (step === 2) {
      setLoading(true)
      try {
        if (isLogin) {
          await login(authForm.email, authForm.password)
        } else {
          await register(authForm)
        }
        setStep(3)
      } catch (err) {
        setError(err.message || "Error en la autenticación")
      } finally {
        setLoading(false)
      }
    } else if (step === 3) {
      setLoading(true)
      try {
        const rentalData = {
          usuarioId: user.id,
          transporteId: selectedTransport,
          estacionOrigenId: pickupStation,
          fechaInicio: new Date(`${startDate}T${startTime}`).toISOString(),
          estado: "activo",
        }

        const nuevoPrestamo = PrestamoController.crear(rentalData)

        // Call the parent callback with rental data
        if (onConfirmRental) {
          onConfirmRental({
            prestamo: nuevoPrestamo,
            vehicle,
            rentalType,
            startDateTime: new Date(`${startDate}T${startTime}`),
            endDateTime: new Date(`${endDate}T${endTime}`),
            duration,
            pickupStation: availablePickupStations.find((s) => s.id === Number.parseInt(pickupStation)),
            returnStation: returnStation
              ? availableReturnStations.find((s) => s.id === Number.parseInt(returnStation))
              : null,
            totalPrice: calculateTotalPrice(),
            user,
          })
        }

        alert(`¡Arrendamiento creado exitosamente! ID: ${nuevoPrestamo.id}`)
        onClose()
      } catch (err) {
        setError(err.message || "Error al crear el arrendamiento")
      } finally {
        setLoading(false)
      }
    }
  }

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  if (!isOpen || !vehicle) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Alquilar Vehículo</h2>
            <p className="text-muted-foreground">{vehicle.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              1
            </div>
            <div className={`w-12 h-1 ${step >= 2 ? "bg-primary" : "bg-muted"}`}></div>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              2
            </div>
            <div className={`w-12 h-1 ${step >= 3 ? "bg-primary" : "bg-muted"}`}></div>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              3
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <span className="text-destructive text-sm">{error}</span>
            </div>
          )}

          {/* Step 1: Rental Details */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Rental Type */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Tipo de Alquiler</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setRentalType("hourly")}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      rentalType === "hourly"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-gray-200 hover:border-primary/50"
                    }`}
                  >
                    <div className="text-center">
                      <Clock className="w-6 h-6 mx-auto mb-2" />
                      <div className="font-semibold">Por Hora</div>
                      <div className="text-sm text-muted-foreground">{formatPrice(pricing?.hourly)} x hora</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setRentalType("daily")}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      rentalType === "daily"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-gray-200 hover:border-primary/50"
                    }`}
                  >
                    <div className="text-center">
                      <Calendar className="w-6 h-6 mx-auto mb-2" />
                      <div className="font-semibold">Por Día</div>
                      <div className="text-sm text-muted-foreground">{formatPrice(pricing?.daily)} x día</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Start Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Fecha de Inicio</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Hora de Inicio</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Duración ({rentalType === "hourly" ? "horas" : "días"})
                </label>
                <input
                  type="number"
                  min="1"
                  max={rentalType === "hourly" ? "24" : "30"}
                  value={duration}
                  onChange={(e) => setDuration(Number.parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>

              {/* End Date and Time (Read-only) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Fecha de Fin</label>
                  <input
                    type="date"
                    value={endDate}
                    readOnly
                    className="w-full p-3 border border-gray-300 rounded-lg bg-muted text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Hora de Fin</label>
                  <input
                    type="time"
                    value={endTime}
                    readOnly
                    className="w-full p-3 border border-gray-300 rounded-lg bg-muted text-muted-foreground"
                  />
                </div>
              </div>

              {/* Pickup Station */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Estación de Recogida
                </label>
                <select
                  value={pickupStation}
                  onChange={(e) => setPickupStation(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                >
                  <option value="">Selecciona una estación</option>
                  {availablePickupStations.map((station) => (
                    <option key={station.id} value={station.id}>
                      {station.nombre} - {station.direccion}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Vehículo Específico</label>
                <select
                  value={selectedTransport}
                  onChange={(e) => setSelectedTransport(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                >
                  <option value="">Selecciona un vehículo</option>
                  {availableTransports.map((transport) => (
                    <option key={transport.id} value={transport.id}>
                      {transport.codigo} - {transport.modelo} ({transport.año})
                    </option>
                  ))}
                </select>
                {availableTransports.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">No hay vehículos de tipo {vehicle.tipo} disponibles</p>
                )}
              </div>

              {/* Return Station */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Estación de Devolución
                </label>
                <select
                  value={returnStation}
                  onChange={(e) => setReturnStation(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                >
                  <option value="">Misma estación de recogida</option>
                  {availableReturnStations.map((station) => (
                    <option key={station.id} value={station.id}>
                      {station.nombre} - {station.direccion}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Summary */}
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Estimado:</span>
                  <span className="text-2xl font-bold text-primary">{formatPrice(calculateTotalPrice())}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  * El precio puede aumentar si no se devuelve a tiempo
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Authentication */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Iniciar Sesión</h3>
                <p className="text-muted-foreground">Necesitas una cuenta para continuar con el alquiler</p>
              </div>

              <div className="flex justify-center space-x-4 mb-6">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isLogin ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    !isLogin ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Registrarse
                </button>
              </div>

              <div className="space-y-4">
                {!isLogin && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Nombre</label>
                        <input
                          type="text"
                          value={authForm.nombre}
                          onChange={(e) => setAuthForm({ ...authForm, nombre: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                          placeholder="Tu nombre"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Apellido</label>
                        <input
                          type="text"
                          value={authForm.apellido}
                          onChange={(e) => setAuthForm({ ...authForm, apellido: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                          placeholder="Tu apellido"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <input
                    type="email"
                    value={authForm.email}
                    onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Contraseña</label>
                  <input
                    type="password"
                    value={authForm.password}
                    onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Teléfono</label>
                    <input
                      type="tel"
                      value={authForm.telefono}
                      onChange={(e) => setAuthForm({ ...authForm, telefono: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                      placeholder="+57 300 123 4567"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <CreditCard className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">Confirmar Arrendamiento</h3>
                <p className="text-muted-foreground">Revisa los detalles y confirma tu arrendamiento</p>
              </div>

              {/* Rental Summary */}
              <div className="bg-muted p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span>Vehículo:</span>
                  <span className="font-medium">{vehicle.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tipo:</span>
                  <span className="font-medium">{rentalType === "hourly" ? "Por Hora" : "Por Día"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duración:</span>
                  <span className="font-medium">
                    {duration} {rentalType === "hourly" ? "horas" : "días"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Inicio:</span>
                  <span className="font-medium">
                    {startDate} {startTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Fin:</span>
                  <span className="font-medium">
                    {endDate} {endTime}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-primary">{formatPrice(calculateTotalPrice())}</span>
                  </div>
                </div>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <p>Al confirmar, aceptas nuestros términos y condiciones.</p>
                <p>El arrendamiento se iniciará automáticamente.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={step === 1 ? onClose : handlePrevStep}
            className="px-6 py-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {step === 1 ? "Cancelar" : "Anterior"}
          </button>
          <button
            onClick={handleNextStep}
            disabled={loading}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Procesando..." : step === 3 ? "Confirmar Arrendamiento" : "Siguiente"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdvancedRentalModal
