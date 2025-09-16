import { Usuario } from '../models/Usuario.js';
import { LocalStorageService } from '../services/LocalStorageService.js';

export class UsuarioController {
  static obtenerTodos() {
    const usuariosData = LocalStorageService.loadUsers();
    return usuariosData.map(data => Usuario.fromJSON(data));
  }

  static obtenerPorId(id) {
    const usuarios = this.obtenerTodos();
    return usuarios.find(usuario => usuario.id === id);
  }

  static crear(datosUsuario) {
    try {
      const usuario = new Usuario(datosUsuario);
      const errores = usuario.validar();

      if (errores.length > 0) {
        throw new Error(`Errores de validación: ${errores.join(', ')}`);
      }

      // Verificar que el email no esté duplicado
      const usuarios = this.obtenerTodos();
      const emailExiste = usuarios.some(u => u.email === usuario.email);
      
      if (emailExiste) {
        throw new Error('Ya existe un usuario con este email');
      }

      // Verificar que el documento no esté duplicado
      const documentoExiste = usuarios.some(u => u.documento === usuario.documento);
      
      if (documentoExiste) {
        throw new Error('Ya existe un usuario con este documento');
      }

      usuarios.push(usuario);
      LocalStorageService.saveUsers(usuarios.map(u => u.toJSON()));

      return usuario;
    } catch (error) {
      console.error('Error creando usuario:', error);
      throw error;
    }
  }

  static actualizar(id, datosActualizados) {
    try {
      const usuarios = this.obtenerTodos();
      const indice = usuarios.findIndex(usuario => usuario.id === id);

      if (indice === -1) {
        throw new Error('Usuario no encontrado');
      }

      // Actualizar datos manteniendo el id original
      Object.assign(usuarios[indice], datosActualizados);
      usuarios[indice].id = id; // Asegurar que el ID no cambie

      const errores = usuarios[indice].validar();
      if (errores.length > 0) {
        throw new Error(`Errores de validación: ${errores.join(', ')}`);
      }

      LocalStorageService.saveUsers(usuarios.map(u => u.toJSON()));
      return usuarios[indice];
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      throw error;
    }
  }

  static eliminar(id) {
    try {
      const usuarios = this.obtenerTodos();
      const usuario = usuarios.find(u => u.id === id);

      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar que no tenga préstamos activos
      if (usuario.tienePrestamosActivos()) {
        throw new Error('No se puede eliminar un usuario con préstamos activos');
      }

      const usuariosFiltrados = usuarios.filter(u => u.id !== id);
      LocalStorageService.saveUsers(usuariosFiltrados.map(u => u.toJSON()));

      return true;
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      throw error;
    }
  }

  static buscarPorEmail(email) {
    const usuarios = this.obtenerTodos();
    return usuarios.find(usuario => usuario.email === email);
  }

  static obtenerEstadisticas() {
    const usuarios = this.obtenerTodos();
    
    return {
      total: usuarios.length,
      activos: usuarios.filter(u => u.activo).length,
      conPrestamosActivos: usuarios.filter(u => u.tienePrestamosActivos()).length,
      registrosRecientes: usuarios.filter(u => {
        const fechaRegistro = new Date(u.fechaRegistro);
        const hace30Dias = new Date();
        hace30Dias.setDate(hace30Dias.getDate() - 30);
        return fechaRegistro > hace30Dias;
      }).length
    };
  }
}
