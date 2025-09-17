import React, { useState } from 'react';
import { User, Mail, CreditCard, UserPlus } from 'lucide-react';
import { UsuarioController } from '../../controllers/UsuarioController.js';

export function UsuarioForm({ onSubmit, usuario = null, onCancel }) {
  const [showToast, setShowToast] = useState(false);
  const [formData, setFormData] = useState({
    nombre: usuario?.nombre || '',
    segundoNombre: usuario?.segundoNombre || '',
    primerApellido: usuario?.primerApellido || '',
    segundoApellido: usuario?.segundoApellido || '',
    tipoDocumento: usuario?.tipoDocumento || '',
    numeroDocumento: usuario?.numeroDocumento || '',
    email: usuario?.email || '',
    direccion: usuario?.direccion || '',
    celular: usuario?.celular || ''
  });
  const [errors, setErrors] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);

    // Validaciones
    if (!formData.nombre.trim()) {
      setErrors(['El nombre es requerido']);
      return;
    }
    if (!formData.primerApellido.trim()) {
      setErrors(['El primer apellido es requerido']);
      return;
    }
    if (!formData.tipoDocumento) {
      setErrors(['El tipo de documento es requerido']);
      return;
    }
    if (!formData.numeroDocumento.trim()) {
      setErrors(['El número de documento es requerido']);
      return;
    }
    if (!formData.email.trim()) {
      setErrors(['El email es requerido']);
      return;
    }
    if (!formData.direccion.trim()) {
      setErrors(['La dirección es requerida']);
      return;
    }
    if (!formData.celular.trim()) {
      setErrors(['El número de celular es requerido']);
      return;
    }

    try {
      let usuarioCreado;
      if (!usuario) {
        usuarioCreado = UsuarioController.crear({
          nombre: formData.nombre,
          segundoNombre: formData.segundoNombre,
          primerApellido: formData.primerApellido,
          segundoApellido: formData.segundoApellido,
          tipoDocumento: formData.tipoDocumento,
          documento: formData.numeroDocumento,
          email: formData.email,
          direccion: formData.direccion,
          celular: formData.celular
        });
        if (onSubmit) onSubmit(usuarioCreado);
        setFormData({
          nombre: '',
          segundoNombre: '',
          primerApellido: '',
          segundoApellido: '',
          tipoDocumento: '',
          numeroDocumento: '',
          email: '',
          direccion: '',
          celular: ''
        });
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2500);
      } else {
        // Edición: solo pasa los datos al callback
        if (onSubmit) onSubmit(formData);
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
    <div className="bg-white rounded-lg shadow-md p-6 relative">
      <div className="flex items-center gap-3 mb-6">
        <UserPlus className="h-6 w-6 text-green-600" />
        <h2 className="text-xl font-semibold text-gray-800">
          {usuario ? 'Editar Usuario' : 'Nuevo Usuario'}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              placeholder="Primer nombre"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Segundo Nombre</label>
            <input
              type="text"
              value={formData.segundoNombre}
              onChange={(e) => handleChange('segundoNombre', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              placeholder="Segundo nombre"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Primer Apellido</label>
            <input
              type="text"
              value={formData.primerApellido}
              onChange={(e) => handleChange('primerApellido', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              placeholder="Primer apellido"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Segundo Apellido</label>
            <input
              type="text"
              value={formData.segundoApellido}
              onChange={(e) => handleChange('segundoApellido', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              placeholder="Segundo apellido"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de documento</label>
            <select
              value={formData.tipoDocumento}
              onChange={e => handleChange('tipoDocumento', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
            >
              <option value="">Seleccione</option>
              <option value="cc">Cédula de Ciudadanía</option>
              <option value="pasaporte">Pasaporte</option>
            </select>
          </div>
          
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Número de documento</label>
            <input
              type="text"
              value={formData.numeroDocumento}
              onChange={(e) => handleChange('numeroDocumento', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              placeholder="Número de documento"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              placeholder="usuario@ejemplo.com"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
            <input
              type="text"
              value={formData.direccion}
              onChange={(e) => handleChange('direccion', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              placeholder="Dirección de residencia"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Número de celular</label>
            <input
              type="text"
              value={formData.celular}
              onChange={(e) => handleChange('celular', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              placeholder="Número de celular"
            />
          </div>
        </div>

        

       

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            {usuario ? 'Actualizar' : 'Crear Usuario'}
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
      {showToast && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-700 text-white px-8 py-4 rounded-xl shadow-2xl z-50 animate-fade-in text-lg font-bold flex items-center gap-2">
          <span>✅</span> Usuario registrado exitosamente
        </div>
      )}
    </div>
  );
}
