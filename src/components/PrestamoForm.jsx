import React, { useState, useEffect } from 'react';
import { Play, MapPin, User, Bike } from 'lucide-react';
import { UsuarioController } from '../controllers/UsuarioController.js';
import { EstacionController } from '../controllers/EstacionController.js';
import { TransporteController } from '../controllers/TransporteController.js';

export function PrestamoForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    usuarioId: '',
    estacionOrigenId: '',
    transporteId: ''
  });
  const [usuarios, setUsuarios] = useState([]);
  const [estaciones, setEstaciones] = useState([]);
  const [transportesDisponibles, setTransportesDisponibles] = useState([]);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    if (formData.estacionOrigenId) {
      cargarTransportesDisponibles();
    }
  }, [formData.estacionOrigenId]);

  const cargarDatos = () => {
    try {
      const todosLosUsuarios = UsuarioController.obtenerTodos();
      const todasLasEstaciones = EstacionController.obtenerTodas();
      
      setUsuarios(todosLosUsuarios);
      setEstaciones(todasLasEstaciones);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setErrors(['Error cargando datos del sistema']);
    }
  };

  const cargarTransportesDisponibles = () => {
    try {
      const transportes = TransporteController.obtenerDisponiblesPorEstacion(formData.estacionOrigenId);
      setTransportesDisponibles(transportes);
      
      // Limpiar selección de transporte si no está disponible
      if (formData.transporteId && !transportes.find(t => t.id === formData.transporteId)) {
        setFormData(prev => ({ ...prev, transporteId: '' }));
      }
    } catch (error) {
      console.error('Error cargando transportes:', error);
      setTransportesDisponibles([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);

    if (!formData.usuarioId) {
      setErrors(['Debe seleccionar un usuario']);
      return;
    }

    if (!formData.estacionOrigenId) {
      setErrors(['Debe seleccionar una estación de origen']);
      return;
    }

    if (!formData.transporteId) {
      setErrors(['Debe seleccionar un transporte']);
      return;
    }

    try {
      onSubmit(formData);
      setFormData({
        usuarioId: '',
        estacionOrigenId: '',
        transporteId: ''
      });
    } catch (error) {
      setErrors([error.message]);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors([]);
  };

  const getTransporteIcon = (tipo) => {
    switch (tipo) {
      case 'bicicleta': return '🚲';
      case 'scooter': return '🛴';
      case 'auto_electrico': return '🚗';
      default: return '🚲';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <Play className="h-6 w-6 text-orange-600" />
        <h2 className="text-xl font-semibold text-gray-800">Nuevo Préstamo</h2>
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
            <User className="inline h-4 w-4 mr-1" />
            Usuario
          </label>
          <select
            value={formData.usuarioId}
            onChange={(e) => handleChange('usuarioId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
          >
            <option value="">Seleccionar usuario</option>
            {usuarios.map(usuario => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.nombre} - {usuario.email}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="inline h-4 w-4 mr-1" />
            Estación de Origen
          </label>
          <select
            value={formData.estacionOrigenId}
            onChange={(e) => handleChange('estacionOrigenId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
          >
            <option value="">Seleccionar estación</option>
            {estaciones.map(estacion => (
              <option key={estacion.id} value={estacion.id}>
                {estacion.nombre} - {estacion.direccion}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Bike className="inline h-4 w-4 mr-1" />
            Transporte Disponible
          </label>
          <select
            value={formData.transporteId}
            onChange={(e) => handleChange('transporteId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
            disabled={!formData.estacionOrigenId}
          >
            <option value="">
              {formData.estacionOrigenId ? 'Seleccionar transporte' : 'Primero seleccione una estación'}
            </option>
            {transportesDisponibles.map(transporte => (
              <option key={transporte.id} value={transporte.id}>
                {getTransporteIcon(transporte.tipo)} {transporte.codigo} - {transporte.tipo}
              </option>
            ))}
          </select>
          
          {formData.estacionOrigenId && transportesDisponibles.length === 0 && (
            <p className="text-sm text-gray-500 mt-1">
              No hay transportes disponibles en esta estación
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={!formData.usuarioId || !formData.estacionOrigenId || !formData.transporteId}
            className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            Iniciar Préstamo
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