import React, { useState, useEffect } from 'react';
import { Play, Square, MapPin, User, Clock, Euro } from 'lucide-react';
import { PrestamoController } from '../controllers/PrestamoController.js';
import { UsuarioController } from '../controllers/UsuarioController.js';
import { EstacionController } from '../controllers/EstacionController.js';
import { TransporteController } from '../controllers/TransporteController.js';
import { PrestamoForm } from '../components/PrestamoForm.jsx';
import { CalculadoraTarifa } from '../services/TarifaStrategy.js';

export function Prestamos() {
  const [prestamosActivos, setPrestamosActivos] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [usuarios, setUsuarios] = useState([]);
  const [estaciones, setEstaciones] = useState([]);
  const [transportes, setTransportes] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    try {
      const activos = PrestamoController.obtenerActivos();
      setPrestamosActivos(activos);
      setUsuarios(UsuarioController.obtenerTodos());
      setEstaciones(EstacionController.obtenerTodas());
      setTransportes(TransporteController.obtenerTodos());
    } catch (error) {
      mostrarMensaje('error', 'Error cargando datos');
    }
  };

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);
  };

  const handleCrearPrestamo = (datosPrestamo) => {
    try {
      PrestamoController.crear(datosPrestamo);
      cargarDatos();
      setMostrarFormulario(false);
      mostrarMensaje('success', 'Préstamo iniciado exitosamente');
    } catch (error) {
      mostrarMensaje('error', error.message);
    }
  };

  const handleFinalizarPrestamo = (prestamoId) => {
    const estacionDestinoId = prompt('Ingrese el ID de la estación de destino:');
    
    if (!estacionDestinoId) {
      mostrarMensaje('error', 'Debe especificar una estación de destino');
      return;
    }

    // Verificar que la estación existe
    const estacionDestino = estaciones.find(e => e.id === estacionDestinoId);
    if (!estacionDestino) {
      // Mostrar lista de estaciones disponibles
      const estacionesDisponibles = estaciones.map(e => `${e.id}: ${e.nombre}`).join('\n');
      alert(`Estación no encontrada. Estaciones disponibles:\n${estacionesDisponibles}`);
      return;
    }

    try {
      PrestamoController.finalizar(prestamoId, estacionDestinoId);
      cargarDatos();
      mostrarMensaje('success', 'Préstamo finalizado exitosamente');
    } catch (error) {
      mostrarMensaje('error', error.message);
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

  const obtenerTransporte = (transporteId) => {
    return transportes.find(t => t.id === transporteId);
  };

  const calcularTiempoTranscurrido = (fechaInicio) => {
    const inicio = new Date(fechaInicio);
    const ahora = new Date();
    const minutos = Math.floor((ahora - inicio) / (1000 * 60));
    
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    
    if (horas > 0) {
      return `${horas}h ${mins}min`;
    }
    return `${mins} min`;
  };

  const calcularTarifaEstimada = (prestamo) => {
    const transporte = obtenerTransporte(prestamo.transporteId);
    if (!transporte) return 0;

    const inicio = new Date(prestamo.fechaInicio);
    const ahora = new Date();
    const minutos = Math.ceil((ahora - inicio) / (1000 * 60));

    const calculadora = new CalculadoraTarifa();
    return calculadora.calcular(transporte.tipo, minutos);
  };

  const getTransporteIcon = (transporteId) => {
    const transporte = obtenerTransporte(transporteId);
    if (!transporte) return '🚲';
    
    switch (transporte.tipo) {
      case 'bicicleta': return '🚲';
      case 'scooter': return '🛴';
      case 'auto_electrico': return '🚗';
      default: return '🚲';
    }
  };

  if (mostrarFormulario) {
    return (
      <div>
        <PrestamoForm 
          onSubmit={handleCrearPrestamo}
          onCancel={() => setMostrarFormulario(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Play className="h-8 w-8 text-orange-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Gestión de Préstamos</h1>
            <p className="text-gray-600">Administrar préstamos activos de transportes</p>
          </div>
        </div>
        
        <button
          onClick={() => setMostrarFormulario(true)}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
        >
          <Play className="h-4 w-4" />
          Nuevo Préstamo
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

      {prestamosActivos.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No hay préstamos activos</p>
          <button
            onClick={() => setMostrarFormulario(true)}
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            Crear el primer préstamo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {prestamosActivos.map((prestamo) => {
            const transporte = obtenerTransporte(prestamo.transporteId);
            const tarifaEstimada = calcularTarifaEstimada(prestamo);
            
            return (
              <div key={prestamo.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getTransporteIcon(prestamo.transporteId)}</span>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {transporte?.codigo || 'Código no disponible'}
                      </h3>
                      <p className="text-sm text-gray-600 capitalize">
                        {transporte?.tipo?.replace('_', ' ') || 'Tipo no disponible'}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleFinalizarPrestamo(prestamo.id)}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    <Square className="h-4 w-4" />
                    Finalizar
                  </button>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{obtenerNombreUsuario(prestamo.usuarioId)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{obtenerNombreEstacion(prestamo.estacionOrigenId)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{calcularTiempoTranscurrido(prestamo.fechaInicio)}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tarifa estimada:</span>
                    <div className="flex items-center gap-1 text-green-600 font-semibold">
                      <Euro className="h-4 w-4" />
                      {tarifaEstimada.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    En uso
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}