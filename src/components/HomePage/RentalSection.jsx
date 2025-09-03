import React from 'react';
import { Star } from 'lucide-react';

const RentalSection = () => {
  const vehicles = [
    {
      id: 1,
      name: "Scooter XTL 350",
      price: "159.000",
      image: "https://images.pexels.com/photos/1149601/pexels-photo-1149601.jpeg?auto=compress&cs=tinysrgb&w=400",
      isNew: true,
      discount: "-35%",
      rating: 5,
      featured: true
    },
    {
      id: 2,
      name: "Scooter XTL 350",
      price: "159.000",
      image: "https://images.pexels.com/photos/1149601/pexels-photo-1149601.jpeg?auto=compress&cs=tinysrgb&w=400",
      isNew: true,
      rating: 5
    },
    {
      id: 3,
      name: "Bicicleta XTL 400",
      price: "159.000",
      image: "https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=400",
      isNew: true,
      rating: 5
    },
    {
      id: 4,
      name: "Bicicleta XTL 400",
      price: "159.000",
      image: "https://images.pexels.com/photos/1149601/pexels-photo-1149601.jpeg?auto=compress&cs=tinysrgb&w=400",
      isNew: true,
      rating: 5
    },
    {
      id: 5,
      name: "Patineta TL 4090",
      price: "369.000",
      image: "https://images.pexels.com/photos/1149601/pexels-photo-1149601.jpeg?auto=compress&cs=tinysrgb&w=400",
      isNew: true,
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold">
            <span className="text-green-800">Renta </span>
            <span className="text-green-600">Ahora</span>
          </h2>
          <button className="text-green-600 hover:text-green-700 font-semibold flex items-center space-x-2 transition-colors">
            <span>Ver mas</span>
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {vehicles.map((vehicle, index) => (
            <div key={vehicle.id} className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group ${vehicle.featured ? 'ring-2 ring-green-500' : ''}`}>
              <div className="relative p-6">
                {vehicle.isNew && (
                  <span className="absolute top-4 left-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    Nuevo
                  </span>
                )}
                {vehicle.discount && (
                  <span className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {vehicle.discount}
                  </span>
                )}
                
                <div className="aspect-square mb-4 flex items-center justify-center">
                  <img 
                    src={vehicle.image} 
                    alt={vehicle.name}
                    className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-1">
                    {[...Array(vehicle.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <h3 className="font-semibold text-gray-900">{vehicle.name}</h3>
                  
                  <div className="text-green-600 font-bold">
                    $ {vehicle.price} <span className="text-sm font-normal text-gray-500">x Semana</span>
                  </div>

                  {vehicle.featured ? (
                    <button className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-lg font-semibold transition-colors">
                      Llevar al Carrito
                    </button>
                  ) : (
                    <button className="w-full border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white py-3 rounded-lg font-semibold transition-colors">
                      Ver Detalles
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RentalSection;