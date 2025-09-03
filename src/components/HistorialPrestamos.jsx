import React, { useState, useEffect } from 'react';
import { History, User, MapPin, Clock, Euro, Calendar } from 'lucide-react';
import { PrestamoController } from '../controllers/PrestamoController.js';
import { UsuarioController } from '../controllers/UsuarioController.js';
import { EstacionController } from '../controllers/EstacionController.js';
import { TransporteController } from '../controllers/TransporteController.js';

export function HistorialPrestamos({ usuarioId = null }) {
  const [prestamos, setPrestamos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [estaciones, setEstaciones] = useState([]);
  const [transportes, setTransportes] = useState([]);
  const [filtroUsuario, setFiltroUsuario] = useState(usuarioId || '');

  useEffect(() => {
    cargarDatos();
  }, [filtroUsuario]);

  const cargarDatos = () => {
    try {
      const historial = filtroUsuario 
        ? PrestamoController.obtenerHistorial(filtroUsuario)
        : PrestamoController.obtenerHistorial();
      
      setPrestamos(historial);
      setUsuarios(UsuarioController.obtenerTodos());
      setEstaciones(EstacionController.obtenerTodas());
      setTransportes(TransporteController.obtenerTodos());
    } catch (error) {
      console.error('Error cargando historial:', error);
    }
  };

  const obtenerNombreUsuario = (usuarioId) => {
    const usuario = usuarios.find(u => u.id === usuarioId);
    return usuario ? usuario.nombre : 'Usuario no encontrado';
  };

  const obtenerNombreEstacion = (estacionId) => {
    const estacion = estaciones.find(e => e.id === estacionId);
    return estacion ? estacion.nombre : 'Estación no encontrada';
  };

  const obtenerCodigoTransporte = (transporteId) => {
    const transporte = transportes.find(t => t.id === transporteId);
    return transporte ? `${transporte.codigo} (${transporte.tipo})` : 'Transporte no encontrado';
  };

  const formatearFecha = (fechaISO) => {
    return new Date(fechaISO).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransporteIcon = (transporteId) => {
    const transporte = transportes.find(t => t.id === transporteId);
    if (!transporte) return '🚲';
    
    switch (transporte.tipo) {
      case 'bicicleta': return '🚲';
      case 'scooter': return '🛴';
      case 'auto_electrico': return '🚗';
      default: return '🚲';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <History className="h-6 w-6 text-purple-600" />
        <h2 className="text-xl font-semibold text-gray-800">
          Historial de Préstamos
        </h2>
      </div>

      {!usuarioId && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline h-4 w-4 mr-1" />
            Filtrar por Usuario
          </label>
          <select
            value={filtroUsuario}
            onChange={(e) => setFiltroUsuario(e.target.value)}
            className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
          >
            <option value="">Todos los usuarios</option>
            {usuarios.map(usuario => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.nombre} - {usuario.email}
              </option>
            ))}
          </select>
        </div>
      )}

      {prestamos.length === 0 ? (
        <div className="text-center py-12">
          <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No hay préstamos finalizados</p>
        </div>
      ) : (
        <div className="space-y-4">
          {prestamos.map(prestamo => (
            <div key={prestamo.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getTransporteIcon(prestamo.transporteId)}</span>
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {obtenerCodigoTransporte(prestamo.transporteId)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {obtenerNombreUsuario(prestamo.usuarioId)}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-1 text-green-600 font-semibold">
                    <Euro className="h-4 w-4" />
                    {prestamo.tarifaCalculada?.toFixed(2) || '0.00'}
                  </div>
                  <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    prestamo.pagado 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {prestamo.pagado ? 'Pagado' : 'Pendiente'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>
                    <strong>Origen:</strong> {obtenerNombreEstacion(prestamo.estacionOrigenId)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>
                    <strong>Destino:</strong> {obtenerNombreEstacion(prestamo.estacionDestinoId)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    <strong>Inicio:</strong> {formatearFecha(prestamo.fechaInicio)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    <strong>Duración:</strong> {prestamo.obtenerDuracionFormateada()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
          <ul className="text-red-700 text-sm">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}