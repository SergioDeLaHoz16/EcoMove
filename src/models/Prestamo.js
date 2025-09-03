export class Prestamo {
  constructor({ 
    id, 
    usuarioId, 
    transporteId, 
    estacionOrigenId, 
    estacionDestinoId = null,
    fechaInicio,
    fechaFin = null,
    duracionMinutos = 0,
    estado = 'activo' // activo, finalizado, cancelado
  }) {
    this.id = id || this.generateId();
    this.usuarioId = usuarioId;
    this.transporteId = transporteId;
    this.estacionOrigenId = estacionOrigenId;
    this.estacionDestinoId = estacionDestinoId;
    this.fechaInicio = fechaInicio || new Date().toISOString();
    this.fechaFin = fechaFin;
    this.duracionMinutos = duracionMinutos;
    this.estado = estado;
    this.tarifaCalculada = 0;
    this.pagado = false;
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  validar() {
    const errores = [];

    if (!this.usuarioId) {
      errores.push('Debe especificar un usuario');
    }

    if (!this.transporteId) {
      errores.push('Debe especificar un transporte');
    }

    if (!this.estacionOrigenId) {
      errores.push('Debe especificar una estación de origen');
    }

    return errores;
  }

  iniciar() {
    if (this.estado !== 'activo') {
      throw new Error('El préstamo no está en estado activo');
    }

    this.fechaInicio = new Date().toISOString();
  }

  finalizar(estacionDestinoId, tarifaCalculada) {
    if (this.estado !== 'activo') {
      throw new Error('El préstamo no está activo');
    }

    this.fechaFin = new Date().toISOString();
    this.estacionDestinoId = estacionDestinoId;
    this.estado = 'finalizado';
    this.tarifaCalculada = tarifaCalculada;
    
    // Calcular duración en minutos
    const inicio = new Date(this.fechaInicio);
    const fin = new Date(this.fechaFin);
    this.duracionMinutos = Math.ceil((fin - inicio) / (1000 * 60));
  }

  cancelar(motivo) {
    if (this.estado === 'finalizado') {
      throw new Error('No se puede cancelar un préstamo finalizado');
    }

    this.estado = 'cancelado';
    this.fechaFin = new Date().toISOString();
    this.motivoCancelacion = motivo;
  }

  marcarComoPagado() {
    if (this.estado !== 'finalizado') {
      throw new Error('Solo se pueden marcar como pagados los préstamos finalizados');
    }

    this.pagado = true;
    this.fechaPago = new Date().toISOString();
  }

  obtenerDuracionFormateada() {
    if (!this.duracionMinutos) return '0 min';
    
    const horas = Math.floor(this.duracionMinutos / 60);
    const minutos = this.duracionMinutos % 60;
    
    if (horas > 0) {
      return `${horas}h ${minutos}min`;
    }
    return `${minutos} min`;
  }

  estaActivo() {
    return this.estado === 'activo';
  }

  toJSON() {
    return {
      id: this.id,
      usuarioId: this.usuarioId,
      transporteId: this.transporteId,
      estacionOrigenId: this.estacionOrigenId,
      estacionDestinoId: this.estacionDestinoId,
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin,
      duracionMinutos: this.duracionMinutos,
      estado: this.estado,
      tarifaCalculada: this.tarifaCalculada,
      pagado: this.pagado,
      fechaPago: this.fechaPago,
      motivoCancelacion: this.motivoCancelacion
    };
  }

  static fromJSON(data) {
    return new Prestamo(data);
  }
}