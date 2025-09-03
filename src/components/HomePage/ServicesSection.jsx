import React from 'react';
import { ChevronRight } from 'lucide-react';

const ServicesSection = () => {
  const stats = [
    { number: "250k+", label: "Usuarios Activos" },
    { number: "250k+", label: "Usuarios Activos" },
    { number: "250k+", label: "Usuarios Activos" }
  ];

  const services = [
    "Comprar Vehiculo",
    "Alquilar Vehiculo", 
    "Comprar Planes"
  ];

  return (
    <section className="relative bg-gradient-to-br from-green-100 to-green-200 py-20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-20 w-40 h-40 bg-green-300 rounded-full opacity-20"></div>
        <div className="absolute bottom-20 left-10 w-32 h-32 bg-green-200 rounded-full opacity-30"></div>
        <div className="absolute top-1/3 right-10 w-48 h-48 bg-green-300 rounded-full opacity-15"></div>
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-green-200 rounded-full opacity-25"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-8">
                <span className="text-green-800">Los servicios</span>
                <br />
                <span className="text-green-600">ofrecidos</span>
              </h2>
            </div>

            <div className="space-y-4 text-gray-700">
              <p className="text-lg">
                Los servicios ofrecidos, Los servicios ofrecidos, Los servicios ofrecidos, Los servicios 
                ofrecidos, Los servicios ofrecidos, Los servicios ofrecidos, Los servicios ofrecidos, Los 
                servicios ofrecidos, Los servicios ofrecidos, Los servicios ofrecidos, Los servicios ofrecidos.
              </p>
              <p className="text-lg">
                Los servicios ofrecidos, Los servicios ofrecidos, Los servicios ofrecidos, Los servicios 
                ofrecidos.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right content - Services */}
          <div className="space-y-4">
            {services.map((service, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-green-200 hover:bg-white transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{service}</h3>
                    <p className="text-gray-600">
                      Los servicios ofrecidos, Los servicios ofrecidos, Los servicios ofrecidos,
                      Los servicios ofrecidos,
                    </p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-green-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;