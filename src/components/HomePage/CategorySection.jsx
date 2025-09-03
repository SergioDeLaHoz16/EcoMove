import React from 'react';
import { Bike, Zap } from 'lucide-react';

const CategoriesSection = () => {
  const categories = [
    {
      icon: Bike,
      title: "Bicicletas Electricas",
      bgColor: "bg-green-100"
    },
    {
      icon: Zap,
      title: "Scooter Electrico",
      bgColor: "bg-green-100"
    },
    {
      icon: Bike,
      title: "Accesorios",
      bgColor: "bg-green-100"
    },
    {
      icon: Bike,
      title: "Muy Pronto",
      bgColor: "bg-green-100"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-green-800">Averigua por </span>
            <span className="text-green-600">Categoria</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <div key={index} className="group cursor-pointer">
              <div className={`${category.bgColor} rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 group-hover:scale-105`}>
                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-700 transition-colors">
                  <category.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;