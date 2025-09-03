export class Estacion {
  constructor({ id, nombre, direccion, latitud, longitud, capacidad, transportesDisponibles = [] }) {
    this.id = id || this.generateId();
    this.nombre = nombre;
    this.direccion = direccion;
    this.latitud = latitud;
    this.longitud = longitud;
    this.capacidad = capacidad;
    this.transportesDisponibles = transportesDisponibles;
    this.fechaCreacion = new Date().toISOString();
    this.activa = true;
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  validar() {
    const errores = [];

    if (!this.nombre || this.nombre.trim().length < 3) {
      errores.push('El nombre debe tener al menos 3 caracteres');
    }

    if (!this.direccion || this.direccion.trim().length < 5) {
      errores.push('La dirección debe tener al menos 5 caracteres');
    }

    if (!this.latitud || !this.isValidLatitude(this.latitud)) {
      errores.push('La latitud debe estar entre -90 y 90 grados');
    }

    if (!this.longitud || !this.isValidLongitude(this.longitud)) {
      errores.push('La longitud debe estar entre -180 y 180 grados');
    }

    if (!this.capacidad || this.capacidad < 1) {
      errores.push('La capacidad debe ser mayor a 0');
    }

    return errores;
  }

  isValidLatitude(lat) {
    const num = parseFloat(lat);
    return !isNaN(num) && num >= -90 && num <= 90;
  }

  isValidLongitude(lng) {
    const num = parseFloat(lng);
    return !isNaN(num) && num >= -180 && num <= 180;
  }

  agregarTransporte(transporteId) {
    if (!this.transportesDisponibles.includes(transporteId)) {
      this.transportesDisponibles.push(transporteId);
    }
  }

  removerTransporte(transporteId) {
    this.transportesDisponibles = this.transportesDisponibles.filter(id => id !== transporteId);
  }

  tieneCapacidad() {
    return this.transportesDisponibles.length < this.capacidad;
  }

  obtenerOcupacion() {
    return {
      ocupados: this.transportesDisponibles.length,
      capacidad: this.capacidad,
      disponibles: this.capacidad - this.transportesDisponibles.length,
      porcentajeOcupacion: Math.round((this.transportesDisponibles.length / this.capacidad) * 100)
    };
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      direccion: this.direccion,
      latitud: this.latitud,
      longitud: this.longitud,
      capacidad: this.capacidad,
      transportesDisponibles: this.transportesDisponibles,
      fechaCreacion: this.fechaCreacion,
      activa: this.activa
    };
  }

  static fromJSON(data) {
    return new Estacion(data);
  }
}