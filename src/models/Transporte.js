export class Transporte {
  constructor({ id, codigo, tipo, estacionId, disponible = true, caracteristicas = {}, fechaCreacion }) {
    this.id = id || this.generateId();
    this.codigo = codigo;
    this.tipo = tipo;
    this.estacionId = estacionId;
    this.disponible = disponible;
    this.caracteristicas = caracteristicas;
    this.fechaCreacion = fechaCreacion || new Date().toISOString();
    this.estado = 'operativo'; // operativo, mantenimiento, fuera_servicio
    this.ultimoMantenimiento = null;
    this.kilometraje = 0;
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  validar() {
    const errores = [];

    if (!this.codigo || this.codigo.trim().length < 3) {
      errores.push('El código debe tener al menos 3 caracteres');
    }

    if (!this.tipo || !this.isValidType(this.tipo)) {
      errores.push('Tipo de transporte no válido');
    }

    if (!this.estacionId) {
      errores.push('Debe asignar una estación');
    }

    return errores;
  }

  isValidType(tipo) {
    const tiposValidos = ['bicicleta', 'scooter', 'auto_electrico'];
    return tiposValidos.includes(tipo.toLowerCase());
  }

  prestar() {
    if (!this.disponible) {
      throw new Error('El transporte no está disponible');
    }
    
    if (this.estado !== 'operativo') {
      throw new Error('El transporte no está en estado operativo');
    }

    this.disponible = false;
    this.estacionId = null; // Ya no está en ninguna estación
  }

  devolver(estacionId) {
    this.disponible = true;
    this.estacionId = estacionId;
  }

  cambiarEstado(nuevoEstado) {
    const estadosValidos = ['operativo', 'mantenimiento', 'fuera_servicio'];
    
    if (!estadosValidos.includes(nuevoEstado)) {
      throw new Error('Estado no válido');
    }

    this.estado = nuevoEstado;
    
    if (nuevoEstado === 'mantenimiento') {
      this.ultimoMantenimiento = new Date().toISOString();
      this.disponible = false;
    } else if (nuevoEstado === 'operativo') {
      this.disponible = true;
    } else if (nuevoEstado === 'fuera_servicio') {
      this.disponible = false;
    }
  }

  agregarKilometraje(km) {
    this.kilometraje += km;
  }

  obtenerInformacion() {
    return {
      id: this.id,
      codigo: this.codigo,
      tipo: this.tipo,
      disponible: this.disponible,
      estado: this.estado,
      kilometraje: this.kilometraje,
      caracteristicas: this.caracteristicas
    };
  }

  toJSON() {
    return {
      id: this.id,
      codigo: this.codigo,
      tipo: this.tipo,
      estacionId: this.estacionId,
      disponible: this.disponible,
      caracteristicas: this.caracteristicas,
      fechaCreacion: this.fechaCreacion,
      estado: this.estado,
      ultimoMantenimiento: this.ultimoMantenimiento,
      kilometraje: this.kilometraje
    };
  }

  static fromJSON(data) {
    return new Transporte(data);
  }
}