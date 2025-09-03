import React from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-green-50 to-green-100 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-200 rounded-full opacity-30"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-green-300 rounded-full opacity-20"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-green-200 rounded-full opacity-25"></div>
        <div className="absolute bottom-40 right-1/3 w-40 h-40 bg-green-300 rounded-full opacity-15"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-green-800">Obten tu </span>
                <span className="text-green-600">Bicicleta y Patineta</span>
                <br />
                <span className="text-green-600">Electrica Favorita</span>
              </h1>
            </div>

            <div className="space-y-4 text-gray-700">
              <p className="text-lg">
                Puedes conseguir tu patineta o bicicleta ideal para tus necesidades
                entre nuestras colecciones de ultimo modelo con tecnologia avanzada.
              </p>
              <p className="text-lg">
                Ademas, ofrecemos servicios de reparacion internos para tu comodidad
              </p>
            </div>

            <button className="bg-green-700 hover:bg-green-800 text-white px-8 py-4 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl">
              Pedir Ahora
            </button>

            {/* Features */}
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-700">Tiempo de carga 5 - 6 h</span>
              </div>
            </div>
          </div>

          {/* Right content - Bike image */}
          <div className="relative">
            <div className="relative z-10">
              <img 
                src="https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Electric Bike" 
                className="w-full h-auto max-w-lg mx-auto"
              />
            </div>
            
            {/* Feature badges */}
            <div className="absolute top-10 right-10 bg-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Peso Maximo 100kg</span>
            </div>
            
            <div className="absolute bottom-20 right-20 bg-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Velocidad Maxima 60km</span>
            </div>
          </div>
        </div>

        {/* Navigation arrows */}
        <button className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow">
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <button className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow">
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;