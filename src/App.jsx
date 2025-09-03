import React, { useState } from 'react';
import { Users, MapPin, Bike, Play, History, BarChart3, Leaf } from 'lucide-react';
import { Usuarios } from './pages/Usuarios.jsx';
import { Estaciones } from './pages/Estaciones.jsx';
import { Transportes } from './pages/Transportes.jsx';
import { Prestamos } from './pages/Prestamos.jsx';
import { Historial } from './pages/Historial.jsx';

function App() {
  const [paginaActiva, setPaginaActiva] = useState('dashboard');

  const navegacion = [
    { id: 'dashboard', nombre: 'Dashboard', icono: BarChart3 },
    { id: 'usuarios', nombre: 'Usuarios', icono: Users },
    { id: 'estaciones', nombre: 'Estaciones', icono: MapPin },
    { id: 'transportes', nombre: 'Transportes', icono: Bike },
    { id: 'prestamos', nombre: 'Préstamos', icono: Play },
    { id: 'historial', nombre: 'Historial', icono: History }
  ];

  const renderizarPagina = () => {
    switch (paginaActiva) {
      case 'usuarios':
        return <Usuarios />;
      case 'estaciones':
        return <Estaciones />;
      case 'transportes':
        return <Transportes />;
      case 'prestamos':
        return <Prestamos />;
      case 'historial':
        return <Historial />;
      default:
        return (
          <Dashboard
            navegacion={navegacion}
            setPaginaActiva={setPaginaActiva}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-green-600 rounded-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">EcoMove</h1>
                <p className="text-sm text-gray-600">Sistema de Transporte Ecológico</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-1">
              {navegacion.map((item) => {
                const IconoComponente = item.icono;
                return (
                  <button
                    key={item.id}
                    onClick={() => setPaginaActiva(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      paginaActiva === item.id
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    <IconoComponente className="h-4 w-4" />
                    {item.nombre}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-b border-gray-200">
        <div className="px-4 py-2">
          <select
            value={paginaActiva}
            onChange={(e) => setPaginaActiva(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {navegacion.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderizarPagina()}
      </main>
    </div>
  );
}

// Componente Dashboard
function Dashboard({ navegacion, setPaginaActiva }) {
  const [estadisticas, setEstadisticas] = useState({
    usuarios: { total: 0, activos: 0 },
    estaciones: { total: 0, activas: 0 },
    transportes: { total: 0, disponibles: 0 },
    prestamos: { activos: 0, finalizados: 0 }
  });

  React.useEffect(() => {
    try {
      const { UsuarioController } = require('./controllers/UsuarioController.js');
      const { EstacionController } = require('./controllers/EstacionController.js');
      const { TransporteController } = require('./controllers/TransporteController.js');
      const { PrestamoController } = require('./controllers/PrestamoController.js');

      const statsUsuarios = UsuarioController.obtenerEstadisticas();
      const statsEstaciones = EstacionController.obtenerEstadisticas();
      const statsTransportes = TransporteController.obtenerEstadisticas();
      const statsPrestamos = PrestamoController.obtenerEstadisticas();

      setEstadisticas({
        usuarios: statsUsuarios,
        estaciones: statsEstaciones,
        transportes: statsTransportes,
        prestamos: statsPrestamos
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  }, []);

  const tarjetas = [
    {
      titulo: 'Usuarios',
      valor: estadisticas.usuarios.total,
      subtitulo: `${estadisticas.usuarios.activos} activos`,
      icono: Users,
      color: 'green'
    },
    {
      titulo: 'Estaciones',
      valor: estadisticas.estaciones.total,
      subtitulo: `${estadisticas.estaciones.activas} activas`,
      icono: MapPin,
      color: 'blue'
    },
    {
      titulo: 'Transportes',
      valor: estadisticas.transportes.total,
      subtitulo: `${estadisticas.transportes.disponibles} disponibles`,
      icono: Bike,
      color: 'purple'
    },
    {
      titulo: 'Préstamos',
      valor: estadisticas.prestamos.activos,
      subtitulo: `${estadisticas.prestamos.finalizados} finalizados`,
      icono: Play,
      color: 'orange'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Bienvenido a EcoMove
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Sistema inteligente de transporte ecológico compartido para ciudades sostenibles. 
          Gestiona usuarios, estaciones, vehículos y préstamos desde un solo lugar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tarjetas.map((tarjeta) => {
          const IconoComponente = tarjeta.icono;
          const colores = {
            green: 'bg-green-600 text-white',
            blue: 'bg-blue-600 text-white',
            purple: 'bg-purple-600 text-white',
            orange: 'bg-orange-600 text-white'
          };

          return (
            <div key={tarjeta.titulo} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${colores[tarjeta.color]}`}>
                  <IconoComponente className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {tarjeta.valor}
                  </h3>
                  <p className="text-sm font-medium text-gray-600">
                    {tarjeta.titulo}
                  </p>
                  <p className="text-xs text-gray-500">
                    {tarjeta.subtitulo}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Características del Sistema */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Características del Sistema
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
            <Leaf className="h-6 w-6 text-green-600" />
            <div>
              <h3 className="font-medium text-gray-800">100% Ecológico</h3>
              <p className="text-sm text-gray-600">Transportes eléctricos y bicicletas</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
            <MapPin className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="font-medium text-gray-800">Red de Estaciones</h3>
              <p className="text-sm text-gray-600">Puntos estratégicos en la ciudad</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
            <BarChart3 className="h-6 w-6 text-orange-600" />
            <div>
              <h3 className="font-medium text-gray-800">Análisis en Tiempo Real</h3>
              <p className="text-sm text-gray-600">Estadísticas y métricas del sistema</p>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Acciones Rápidas
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {navegacion.slice(1).map((item) => {
            const IconoComponente = item.icono;
            return (
              <button
                key={item.id}
                onClick={() => setPaginaActiva(item.id)}
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors duration-200"
              >
                <IconoComponente className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-700">{item.nombre}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
