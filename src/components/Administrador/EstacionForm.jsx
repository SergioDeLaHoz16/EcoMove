import React, { useState } from 'react';
import { MapPin, Navigation, Hash, Users } from 'lucide-react';

export function EstacionForm({ onSubmit, estacion = null, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: estacion?.nombre || '',
    direccion: estacion?.direccion || '',
    capacidad: estacion?.capacidad || 10
  });
  const [errors, setErrors] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);

    try {
      const datos = {
        ...formData,
        capacidad: parseInt(formData.capacidad)
      };
      onSubmit(datos);
      if (!estacion) {
        setFormData({
          nombre: '',
          direccion: '',
          capacidad: 10
        });
      }
    } catch (error) {
      setErrors([error.message]);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors([]);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <MapPin className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">
          {estacion ? 'Editar Estación' : 'Nueva Estación'}
        </h2>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <ul className="text-red-700 text-sm">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Hash className="inline h-4 w-4 mr-1" />
            Nombre de la Estación
          </label>
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Ej: Estación Centro"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Navigation className="inline h-4 w-4 mr-1" />
            Dirección
          </label>
          <input
            type="text"
            value={formData.direccion}
            onChange={(e) => handleChange('direccion', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Dirección completa"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Users className="inline h-4 w-4 mr-1" />
            Capacidad (número de transportes)
          </label>
          <input
            type="number"
            min="1"
            value={formData.capacidad}
            onChange={(e) => handleChange('capacidad', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="10"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            {estacion ? 'Actualizar' : 'Crear Estación'}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
