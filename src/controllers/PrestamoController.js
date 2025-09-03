import { Prestamo } from '../models/Prestamo.js';
import { LocalStorageService } from '../services/LocalStorageService.js';
import { CalculadoraTarifa } from '../services/TarifaStrategy.js';

export class PrestamoController {
  static obtenerTodos() {
    const prestamosData = LocalStorageService.loadLoans();
    return prestamosData.map(data => Prestamo.fromJSON(data));
  }

  static obtenerPorId(id) {
    const prestamos = this.obtenerTodos();
    return prestamos.find(prestamo => prestamo.id === id);
  }

  static async crear(datosPrestamo) {
    try {
      const prestamo = new Prestamo(datosPrestamo);
      const errores = prestamo.validar();

      if (errores.length > 0) {
        throw new Error(`Errores de validación: ${errores.join(', ')}`);
      }

      // Verificar que el usuario exista
      const { UsuarioController } = await import('./UsuarioController.js');
      const usuario = UsuarioController.obtenerPorId(prestamo.usuarioId);
      
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar que el transporte exista y esté disponible
      const { TransporteController } = await import('./TransporteController.js');
      const transporte = TransporteController.obtenerPorId(prestamo.transporteId);
      
      if (!transporte) {
        throw new Error('Transporte no encontrado');
      }

      if (!transporte.disponible) {
        throw new Error('El transporte no está disponible');
      }

      // Verificar que la estación de origen exista
      const { EstacionController } = await import('./EstacionController.js');
      const estacionOrigen = EstacionController.obtenerPorId(prestamo.estacionOrigenId);
      
      if (!estacionOrigen) {
        throw new Error('Estación de origen no encontrada');
      }

      const prestamos = this.obtenerTodos();
      prestamos.push(prestamo);
      
      // Prestar el transporte
      TransporteController.prestar(prestamo.transporteId);
      
      // Agregar préstamo activo al usuario
      usuario.agregarPrestamoActivo(prestamo.id);
      UsuarioController.actualizar(usuario.id, usuario);

      LocalStorageService.saveLoans(prestamos.map(p => p.toJSON()));

      return prestamo;
    } catch (error) {
      console.error('Error creando préstamo:', error);
      throw error;
    }
  }

  static async finalizar(prestamoId, estacionDestinoId) {
    try {
      const prestamos = this.obtenerTodos();
      const indice = prestamos.findIndex(p => p.id === prestamoId);

      if (indice === -1) {
        throw new Error('Préstamo no encontrado');
      }

      const prestamo = prestamos[indice];

      if (prestamo.estado !== 'activo') {
        throw new Error('El préstamo no está activo');
      }

      // Obtener el transporte para calcular la tarifa
      const { TransporteController } = await import('./TransporteController.js');
      const transporte = TransporteController.obtenerPorId(prestamo.transporteId);

      if (!transporte) {
        throw new Error('Transporte no encontrado');
      }

      // Calcular duración
      const inicio = new Date(prestamo.fechaInicio);
      const fin = new Date();
      const duracionMinutos = Math.ceil((fin - inicio) / (1000 * 60));

      // Calcular tarifa
      const calculadora = new CalculadoraTarifa();
      const tarifa = calculadora.calcular(transporte.tipo, duracionMinutos);

      // Finalizar préstamo
      prestamo.finalizar(estacionDestinoId, tarifa);

      // Devolver transporte a la estación
      TransporteController.devolver(prestamo.transporteId, estacionDestinoId);

      // Remover préstamo activo del usuario
      const { UsuarioController } = await import('./UsuarioController.js');
      const usuario = UsuarioController.obtenerPorId(prestamo.usuarioId);
      
      if (usuario) {
        usuario.removerPrestamoActivo(prestamoId);
        UsuarioController.actualizar(usuario.id, usuario);
      }

      LocalStorageService.saveLoans(prestamos.map(p => p.toJSON()));

      return prestamo;
    } catch (error) {
      console.error('Error finalizando préstamo:', error);
      throw error;
    }
  }

  static obtenerPorUsuario(usuarioId) {
    const prestamos = this.obtenerTodos();
    return prestamos.filter(prestamo => prestamo.usuarioId === usuarioId);
  }

  static obtenerActivos() {
    const prestamos = this.obtenerTodos();
    return prestamos.filter(prestamo => prestamo.estado === 'activo');
  }

  static obtenerHistorial(usuarioId = null) {
    const prestamos = this.obtenerTodos();
    
    if (usuarioId) {
      return prestamos.filter(p => p.usuarioId === usuarioId && p.estado === 'finalizado');
    }
    
    return prestamos.filter(p => p.estado === 'finalizado');
  }

  static obtenerEstadisticas() {
    const prestamos = this.obtenerTodos();
    
    const activos = prestamos.filter(p => p.estado === 'activo');
    const finalizados = prestamos.filter(p => p.estado === 'finalizado');
    const cancelados = prestamos.filter(p => p.estado === 'cancelado');

    const ingresosTotales = finalizados.reduce((total, p) => total + (p.tarifaCalculada || 0), 0);
    const duracionPromedio = finalizados.length > 0 
      ? finalizados.reduce((total, p) => total + p.duracionMinutos, 0) / finalizados.length
      : 0;

    return {
      total: prestamos.length,
      activos: activos.length,
      finalizados: finalizados.length,
      cancelados: cancelados.length,
      ingresosTotales: Math.round(ingresosTotales * 100) / 100,
      duracionPromedio: Math.round(duracionPromedio)
    };
  }
}