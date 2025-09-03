import React, { useState, useEffect } from 'react';
import { MapPin, Edit2, Trash2, Plus, Navigation } from 'lucide-react';
import { EstacionController } from '../controllers/EstacionController.js';
import { EstacionForm } from '../components/EstacionForm.jsx';

export function Estaciones() {
  const [estaciones, setEstaciones] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [estacionEditando, setEstacionEditando] = useState(null);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  useEffect(() => {
    cargarEstaciones();
  }, []);

  const cargarEstaciones = () => {
    try {
      const todasLasEstaciones = EstacionController.obtenerTodas();
      setEstaciones(todasLasEstaciones);
    } catch (error) {
      mostrarMensaje('error', 'Error cargando estaciones');
    }
  };

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);
  };

  const handleCrearEstacion = (datosEstacion) => {
    try {
      EstacionController.crear(datosEstacion);
      cargarEstaciones();
      setMostrarFormulario(false);
      mostrarMensaje('success', 'Estación creada exitosamente');
    } catch (error) {
      mostrarMensaje('error', error.message);
    }
  };

  const handleEditarEstacion = (datosEstacion) => {
    try {
      EstacionController.actualizar(estacionEditando.id, datosEstacion);
      cargarEstaciones();
      setEstacionEditando(null);
      mostrarMensaje('success', 'Estación actualizada exitosamente');
    } catch (error) {
      mostrarMensaje('error', error.message);
    }
  };

  const handleEliminarEstacion = (id) => {
    if (window.confirm('¿Está seguro de eliminar esta estación?')) {
      try {
        EstacionController.eliminar(id);
        cargarEstaciones();
        mostrarMensaje('success', 'Estación eliminada exitosamente');
      } catch (error) {
        mostrarMensaje('error', error.message);
      }
    }
  };

  if (mostrarFormulario) {
    return (
      <div>
        <EstacionForm 
          onSubmit={handleCrearEstacion}
          onCancel={() => setMostrarFormulario(false)}
        />
      </div>
    );
  }

  if (estacionEditando) {
    return (
      <div>
        <EstacionForm 
          estacion={estacionEditando}
          onSubmit={handleEditarEstacion}
          onCancel={() => setEstacionEditando(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MapPin className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Gestión de Estaciones</h1>
            <p className="text-gray-600">Administrar puntos de préstamo y devolución</p>
          </div>
        </div>
        
        <button
          onClick={() => setMostrarFormulario(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
        >
          <Plus className="h-4 w-4" />
          Nueva Estación
        </button>
      </div>

      {mensaje.texto && (
        <div className={`p-4 rounded-lg ${
          mensaje.tipo === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-700' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {mensaje.texto}
        </div>
      )}

      {estaciones.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No hay estaciones registradas</p>
          <button
            onClick={() => setMostrarFormulario(true)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Crear la primera estación
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {estaciones.map((estacion) => {
            const ocupacion = estacion.obtenerOcupacion();
            
            return (
              <div key={estacion.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-6 w-6 text-blue-600" />
                    <h3 className="font-semibold text-gray-800">{estacion.nombre}</h3>
                  </div>
                  
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEstacionEditando(estacion)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                      title="Editar estación"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEliminarEstacion(estacion.id)}
                      disabled={ocupacion.ocupados > 0}
                      className="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed p-1 rounded hover:bg-red-50 transition-colors"
                      title={ocupacion.ocupados > 0 ? 'No se puede eliminar: tiene transportes asignados' : 'Eliminar estación'}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Navigation className="h-4 w-4" />
                    <span>{estacion.direccion}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Ocupación</span>
                    <span className="text-sm text-gray-600">
                      {ocupacion.ocupados}/{ocupacion.capacidad}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        ocupacion.porcentajeOcupacion > 80 
                          ? 'bg-red-500' 
                          : ocupacion.porcentajeOcupacion > 60 
                            ? 'bg-yellow-500' 
                            : 'bg-green-500'
                      }`}
                      style={{ width: `${ocupacion.porcentajeOcupacion}%` }}
                    ></div>
                  </div>
                  
                  <div className="text-xs text-gray-500 text-center">
                    {ocupacion.porcentajeOcupacion}% ocupada
                  </div>
                </div>

                <div className={`mt-4 inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                  estacion.activa 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {estacion.activa ? 'Activa' : 'Inactiva'}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}