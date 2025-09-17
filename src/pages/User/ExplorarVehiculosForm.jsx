import React, { useState } from "react";
import TarifaInfo from "./TarifaInfo.jsx";
import { PrestamoController } from "../../controllers/PrestamoController.js";
import { useAuth } from "../../contexts/AuthContext.jsx";

const ExplorarVehiculosForm = ({ transportes, estaciones, onRenta }) => {
  const { user } = useAuth();
  const [tipoSeleccionado, setTipoSeleccionado] = useState("");
  const [modeloSeleccionado, setModeloSeleccionado] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [estacionOrigen, setEstacionOrigen] = useState("");
  const [estacionEntrega, setEstacionEntrega] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);

  // Obtener tipos únicos
  const tipos = Array.from(new Set(transportes.map(t => t.tipo)));

  // Filtrar modelos por tipo seleccionado
  const modelosFiltrados = tipoSeleccionado
    ? transportes.filter(t => t.tipo === tipoSeleccionado)
    : [];

  // Modelos agotados: disponibles === 0
  const modeloAgotado = (modelo) => modelo.disponibles === 0;

  // No hay vehículos disponibles
  const noHayVehiculos = transportes.length === 0 || tipos.length === 0;

  if (noHayVehiculos) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h3 className="text-lg font-bold mb-4">No hay vehículos disponibles</h3>
          <p className="text-gray-600 mb-4">Por favor, vuelve a intentarlo más tarde o contacta al administrador.</p>
          <button className="px-4 py-2 rounded bg-green-600 text-white" onClick={() => window.location.reload()}>Cerrar</button>
        </div>
      </div>
    );
  }

  // Validación para habilitar el botón
  const modeloObj = transportes.find(m => m.id === modeloSeleccionado);
  const tarifaValida = fechaInicio && fechaFin && fechaFin > fechaInicio && modeloObj;
  const puedeRentar = tipoSeleccionado && modeloSeleccionado && fechaInicio && fechaFin && fechaFin > fechaInicio && estacionOrigen && estacionEntrega;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      PrestamoController.crear({
        usuarioId: user?.id,
        transporteId: modeloObj.id,
        estacionOrigenId: estacionOrigen,
        estacionEntregaId: estacionEntrega,
        fechaInicio,
        fechaFin,
        tarifa: modeloObj.tarifa,
      });
      setShowToast(true);
      if (typeof onRenta === "function") onRenta();
      setTipoSeleccionado("");
      setModeloSeleccionado("");
      setFechaInicio("");
      setFechaFin("");
      setEstacionOrigen("");
      setEstacionEntrega("");
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      setShowToast(false);
      alert("Error al realizar la renta: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 relative">
      <h3 className="text-2xl font-bold text-green-700 mb-4">Rentar vehículo</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Tipo de vehículo</label>
          <select
            className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-green-400"
            value={tipoSeleccionado}
            onChange={e => {
              setTipoSeleccionado(e.target.value);
              setModeloSeleccionado("");
            }}
            required
          >
            <option value="">Selecciona tipo</option>
            {tipos.map(tipo => {
              let icon = "🚲";
              if (tipo === "scooter") icon = "🛴";
              if (tipo === "auto_electrico") icon = "🚗";
              return (
                <option key={tipo} value={tipo}>{icon} {tipo.charAt(0).toUpperCase() + tipo.slice(1)}</option>
              );
            })}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Modelo disponible</label>
          <select
            className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-green-400"
            value={modeloSeleccionado}
            onChange={e => setModeloSeleccionado(e.target.value)}
            required
            disabled={!tipoSeleccionado}
          >
            <option value="">Selecciona modelo</option>
            {transportes.filter(t => t.tipo === tipoSeleccionado).map(modelo => {
              let icon = "🚲";
              if (modelo.tipo === "scooter") icon = "🛴";
              if (modelo.tipo === "auto_electrico") icon = "🚗";
              return (
                <option
                  key={modelo.id}
                  value={modelo.id}
                  disabled={modeloAgotado(modelo)}
                >
                  {icon} {modelo.codigo} {modeloAgotado(modelo) ? "(Agotado)" : ""}
                </option>
              );
            })}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Fecha de inicio</label>
            <input
              type="date"
              className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-green-400"
              value={fechaInicio}
              onChange={e => setFechaInicio(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Fecha de fin</label>
            <input
              type="date"
              className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-green-400"
              value={fechaFin}
              onChange={e => setFechaFin(e.target.value)}
              min={fechaInicio || new Date().toISOString().split('T')[0]}
              required
            />
            {fechaInicio && fechaFin && fechaFin <= fechaInicio && (
              <p className="text-red-500 text-xs mt-1">La fecha de fin debe ser posterior a la de inicio.</p>
            )}
          </div>
        </div>
        {tarifaValida && (
          <TarifaInfo
            modelo={modeloObj}
            fechaInicio={fechaInicio}
            fechaFin={fechaFin}
          />
        )}
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Estación de origen</label>
          <select
            className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-green-400"
            value={estacionOrigen}
            onChange={e => setEstacionOrigen(e.target.value)}
            required
          >
            <option value="">Selecciona estación</option>
            {estaciones.map(est => (
              <option key={est.id} value={est.id}>{est.nombre}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Estación de entrega</label>
          <select
            className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-green-400"
            value={estacionEntrega}
            onChange={e => setEstacionEntrega(e.target.value)}
            required
          >
            <option value="">Selecciona estación</option>
            {estaciones.map(est => (
              <option key={est.id} value={est.id}>{est.nombre}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className={`bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold transition-colors shadow ${puedeRentar && !loading ? "" : "opacity-50 cursor-not-allowed"}`}
            disabled={!puedeRentar || loading}
          >
            {loading ? "Procesando..." : "Confirmar renta"}
          </button>
        </div>
      </form>
      {showToast && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-700 text-white px-8 py-4 rounded-xl shadow-2xl z-50 animate-fade-in text-lg font-bold flex items-center gap-2">
          <span>✅</span> ¡Renta realizada exitosamente!
        </div>
      )}
    </div>
  );
};

export default ExplorarVehiculosForm;
