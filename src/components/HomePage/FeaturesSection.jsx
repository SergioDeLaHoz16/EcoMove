import React from 'react';
import { Wrench, Calendar, DollarSign, Headphones } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Wrench,
      title: "Buen mantenimiento",
      description: "Experimenta lo esencial y necesidades con nuestro plan basico"
    },
    {
      icon: Calendar,
      title: "Facil Reserva en linea",
      description: "Disfruta de los beneficios adicionales y flexibilidad con nuestro Plan Estandar"
    },
    {
      icon: DollarSign,
      title: "Precios Asequibles",
      description: "Disfruta de los beneficios adicionales y flexibilidad con nuestro Plan Estandar"
    },
    {
      icon: Headphones,
      title: "Precios Asequibles",
      description: "Disfruta de los beneficios adicionales y flexibilidad con nuestro Plan Estandar"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-green-800">Disfrute de la </span>
            <span className="text-green-600">Flexibilidad y Tarifas</span>
            <span className="text-green-800"> inmejorables</span>
          </h2>
          <h3 className="text-4xl lg:text-5xl font-bold">
            <span className="text-green-800">con nuestros </span>
            <span className="text-green-600">alquileres ecologicos</span>
          </h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <feature.icon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;