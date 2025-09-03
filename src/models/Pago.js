export class Pago {
  constructor({ 
    id, 
    prestamoId, 
    monto, 
    metodoPago = 'efectivo', 
    fechaPago,
    estado = 'pendiente' // pendiente, completado, fallido
  }) {
    this.id = id || this.generateId();
    this.prestamoId = prestamoId;
    this.monto = monto;
    this.metodoPago = metodoPago;
    this.fechaPago = fechaPago || new Date().toISOString();
    this.estado = estado;
    this.referencia = this.generarReferencia();
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  generarReferencia() {
    return `ECO-${Date.now().toString(36).toUpperCase()}`;
  }

  validar() {
    const errores = [];

    if (!this.prestamoId) {
      errores.push('Debe especificar un préstamo');
    }

    if (!this.monto || this.monto <= 0) {
      errores.push('El monto debe ser mayor a 0');
    }

    if (!this.metodoPago) {
      errores.push('Debe especificar un método de pago');
    }

    return errores;
  }

  procesar() {
    if (this.estado !== 'pendiente') {
      throw new Error('El pago no está en estado pendiente');
    }

    // Simular procesamiento de pago
    this.estado = 'completado';
    this.fechaProcesamiento = new Date().toISOString();
  }

  fallar(motivo) {
    this.estado = 'fallido';
    this.motivoFallo = motivo;
    this.fechaFallo = new Date().toISOString();
  }

  esCompletado() {
    return this.estado === 'completado';
  }

  obtenerMontoFormateado() {
    return `€${this.monto.toFixed(2)}`;
  }

  toJSON() {
    return {
      id: this.id,
      prestamoId: this.prestamoId,
      monto: this.monto,
      metodoPago: this.metodoPago,
      fechaPago: this.fechaPago,
      estado: this.estado,
      referencia: this.referencia,
      fechaProcesamiento: this.fechaProcesamiento,
      motivoFallo: this.motivoFallo,
      fechaFallo: this.fechaFallo
    };
  }

  static fromJSON(data) {
    return new Pago(data);
  }
}