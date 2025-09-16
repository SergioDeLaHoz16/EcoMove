import { Clock, Calendar, Zap } from "lucide-react"
import { PricingService } from "../../services/PricingService.js"

const RentalPricingCard = () => {
  const availableVehicles = PricingService.getAvailableVehicleTypes()

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Precios de Alquiler</h2>
        <p className="text-sm text-gray-600">Tarifas actuales por tipo de vehículo</p>
      </div>

      <div className="p-6 space-y-4">
        {availableVehicles.map((vehicle) => (
          <div key={vehicle.type} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{vehicle.name}</h3>
                <p className="text-sm text-gray-600 capitalize">{vehicle.type}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Por Hora</p>
                  <p className="font-bold text-green-600">{PricingService.formatPrice(vehicle.hourlyPrice)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Por Día</p>
                  <p className="font-bold text-green-600">{PricingService.formatPrice(vehicle.dailyPrice)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Coming Soon Vehicle */}
        <div className="border border-gray-200 rounded-lg p-4 opacity-60">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Carro Eléctrico</h3>
              <p className="text-sm text-yellow-600">Próximamente</p>
            </div>
          </div>

          <div className="text-center py-2">
            <p className="text-sm text-gray-500">Disponible pronto</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RentalPricingCard
