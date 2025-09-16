"use client"

import { useState } from "react"
import { Search, User, ChevronDown } from "lucide-react"
import RentalCartButton from "../RentalCart/RentalCartButton.jsx"
import RentalCartModal from "../RentalCart/RentalCartModal.jsx"

const Header = ({ onLoginClick, onRegisterClick }) => {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showCartModal, setShowCartModal] = useState(false)

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">EcoMove</h1>
                  <p className="text-xs text-gray-500">GREEN CITY MOVING</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-green-600 transition-colors">
                Scooters Electricos
              </a>
              <a href="#" className="text-gray-700 hover:text-green-600 transition-colors">
                Bicicletas Electricas
              </a>
              <a href="#" className="text-gray-700 hover:text-green-600 transition-colors">
                Patinetas Electricas
              </a>
              <a href="#" className="text-gray-700 hover:text-green-600 transition-colors">
                Marcas
              </a>
              <a href="#" className="text-gray-700 hover:text-green-600 transition-colors">
                Comentarios
              </a>
              <a href="#" className="text-gray-700 hover:text-green-600 transition-colors">
                Contactanos
              </a>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-green-600 transition-colors">
                <Search className="w-5 h-5" />
              </button>

              {/* Rental Cart Button */}
              <RentalCartButton onClick={() => setShowCartModal(true)} />

              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center p-2 text-gray-600 hover:text-green-600 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">Opciones de Usuario</p>
                      <p className="text-xs text-gray-500">Explora nuestros servicios</p>
                    </div>

                    <div className="py-1">
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        Ver Catálogo
                      </a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        Buscar Estaciones
                      </a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        Precios y Planes
                      </a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        Ayuda y Soporte
                      </a>
                    </div>

                    <div className="border-t border-gray-100 py-1">
                      <button
                        onClick={() => {
                          onLoginClick()
                          setShowUserMenu(false)
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 font-medium"
                      >
                        Iniciar Sesión
                      </button>
                      <button
                        onClick={() => {
                          onRegisterClick()
                          setShowUserMenu(false)
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 font-medium"
                      >
                        Registrarse
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {showUserMenu && <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />}
      </header>

      {/* Rental Cart Modal */}
      <RentalCartModal isOpen={showCartModal} onClose={() => setShowCartModal(false)} />
    </>
  )
}

export default Header
