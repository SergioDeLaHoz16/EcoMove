import React, { useState, useEffect } from 'react';
import { Users, Edit2, Trash2, Plus } from 'lucide-react';
import { UsuarioController } from '../controllers/UsuarioController.js';
import { UsuarioForm } from '../components/UsuarioForm.jsx';

export function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = () => {
    try {
      const todosLosUsuarios = UsuarioController.obtenerTodos();
      setUsuarios(todosLosUsuarios);
    } catch (error) {
      mostrarMensaje('error', 'Error cargando usuarios');
    }
  };

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);
  };

  const handleCrearUsuario = (datosUsuario) => {
    try {
      UsuarioController.crear(datosUsuario);
      cargarUsuarios();
      setMostrarFormulario(false);
      mostrarMensaje('success', 'Usuario creado exitosamente');
    } catch (error) {
      mostrarMensaje('error', error.message);
    }
  };

  const handleEditarUsuario = (datosUsuario) => {
    try {
      UsuarioController.actualizar(usuarioEditando.id, datosUsuario);
      cargarUsuarios();
      setUsuarioEditando(null);
      mostrarMensaje('success', 'Usuario actualizado exitosamente');
    } catch (error) {
      mostrarMensaje('error', error.message);
    }
  };

  const handleEliminarUsuario = (id) => {
    if (window.confirm('¿Está seguro de eliminar este usuario?')) {
      try {
        UsuarioController.eliminar(id);
        cargarUsuarios();
        mostrarMensaje('success', 'Usuario eliminado exitosamente');
      } catch (error) {
        mostrarMensaje('error', error.message);
      }
    }
  };

  const formatearFecha = (fechaISO) => {
    return new Date(fechaISO).toLocaleDateString('es-ES');
  };

  if (mostrarFormulario) {
    return (
      <div>
        <UsuarioForm 
          onSubmit={handleCrearUsuario}
          onCancel={() => setMostrarFormulario(false)}
        />
      </div>
    );
  }

  if (usuarioEditando) {
    return (
      <div>
        <UsuarioForm 
          usuario={usuarioEditando}
          onSubmit={handleEditarUsuario}
          onCancel={() => setUsuarioEditando(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
            <p className="text-gray-600">Administrar usuarios del sistema EcoMove</p>
          </div>
        </div>
        
        <button
          onClick={() => setMostrarFormulario(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
        >
          <Plus className="h-4 w-4" />
          Nuevo Usuario
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

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {usuarios.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No hay usuarios registrados</p>
            <button
              onClick={() => setMostrarFormulario(true)}
              className="mt-4 text-green-600 hover:text-green-700 font-medium"
            >
              Crear el primer usuario
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Registro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usuarios.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {usuario.nombre}
                        </div>
                        <div className="text-sm text-gray-500">
                          {usuario.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {usuario.documento}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatearFecha(usuario.fechaRegistro)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          usuario.activo 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {usuario.activo ? 'Activo' : 'Inactivo'}
                        </span>
                        {usuario.tienePrestamosActivos() && (
                          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            En uso
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setUsuarioEditando(usuario)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                          title="Editar usuario"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEliminarUsuario(usuario.id)}
                          disabled={usuario.tienePrestamosActivos()}
                          className="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed p-1 rounded hover:bg-red-50 transition-colors"
                          title={usuario.tienePrestamosActivos() ? 'No se puede eliminar: tiene préstamos activos' : 'Eliminar usuario'}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}