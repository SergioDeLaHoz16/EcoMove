import React, { useState, useEffect } from 'react';
import { Bike, Zap, Car, Hash } from 'lucide-react';
import { EstacionController } from '../controllers/EstacionController.js';
import { TransportFactory } from '../services/TransportFactory.js';

export function TransporteForm({ onSubmit, transporte = null, onCancel }) {
  const [formData, setFormData] = useState({
    codigo: transporte?.codigo || '',
    tipo: transporte?.tipo || 'bicicleta',
    estacionId: transporte?.estacionId || ''
  });
  const [estaciones, setEstaciones] = useState([]);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    try {
      const todasLasEstaciones = EstacionController.obtenerTodas();
      setEstaciones(todasLasEstaciones);
    } catch (error) {
      console.error('Error cargando estaciones:', error);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);

    try {
      onSubmit(formData);
      
      if (!transporte) {
        setFormData({
          codigo: '',
          tipo: 'bicicleta',
          estacionId: ''
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

  const getTypeIcon = (tipo) => {
    switch (tipo) {
      case 'bicicleta': return <Bike className="h-5 w-5" />;
      case 'scooter': return <Zap className="h-5 w-5" />;
      case 'auto_electrico': return <Car className="h-5 w-5" />;
      default: return <Bike className="h-5 w-5" />;
    }
  };

  const tipos = TransportFactory.getAvailableTypes();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        {getTypeIcon(formData.tipo)}
        <h2 className="text-xl font-semibold text-gray-800">
          {transporte ? 'Editar Transporte' : 'Nuevo Transporte'}
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
            Código del Transporte
          </label>
          <input
            type="text"
            value={formData.codigo}
            onChange={(e) => handleChange('codigo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
            placeholder="Ej: BIC001, SCO001"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Transporte
          </label>
          <select
            value={formData.tipo}
            onChange={(e) => handleChange('tipo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
          >
            {tipos.map(tipo => {
              const features = TransportFactory.getTypeFeatures(tipo);
              return (
                <option key={tipo} value={tipo}>
                  {features?.icono} {features?.descripcion || tipo}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estación Asignada
          </label>
          <select
            value={formData.estacionId}
            onChange={(e) => handleChange('estacionId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
          >
            <option value="">Seleccionar estación</option>
            {estaciones.map(estacion => (
              <option key={estacion.id} value={estacion.id}>
                {estacion.nombre} - {estacion.direccion}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            {transporte ? 'Actualizar' : 'Crear Transporte'}
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