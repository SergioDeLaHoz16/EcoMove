export class Usuario {
  constructor({ id, nombre, segundoNombre, primerApellido, segundoApellido, email, documento, tipoDocumento, fechaRegistro, prestamosActivos = [], direccion, celular }) {
    this.id = id || this.generateId();
    this.nombre = nombre;
    this.segundoNombre = segundoNombre || '';
    this.primerApellido = primerApellido || '';
    this.segundoApellido = segundoApellido || '';
    this.email = email;
    this.documento = documento;
    this.tipoDocumento = tipoDocumento || '';
    this.direccion = direccion || '';
    this.celular = celular || '';
    this.fechaRegistro = fechaRegistro || new Date().toISOString();
    this.prestamosActivos = prestamosActivos;
    this.activo = true;
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  validar() {
    const errores = [];
    if (!this.nombre || this.nombre.trim().length < 2) {
      errores.push('El nombre debe tener al menos 2 caracteres');
    }
    if (!this.primerApellido || this.primerApellido.trim().length < 2) {
      errores.push('El primer apellido es requerido');
    }
    if (!this.email || !this.isValidEmail(this.email)) {
      errores.push('Debe proporcionar un email válido');
    }
    if (!this.documento || !/^[a-zA-Z0-9]{5,}$/.test(this.documento)) {
      errores.push('El documento debe tener al menos 5 caracteres alfanuméricos');
    }
    if (!this.tipoDocumento) {
      errores.push('El tipo de documento es requerido');
    }
    if (!this.direccion || this.direccion.trim().length < 3) {
      errores.push('La dirección es requerida');
    }
    if (!this.celular || this.celular.trim().length < 7) {
      errores.push('El número de celular es requerido');
    }
    return errores;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  tienePrestamosActivos() {
    return this.prestamosActivos.length > 0;
  }

  agregarPrestamoActivo(prestamoId) {
    if (!this.prestamosActivos.includes(prestamoId)) {
      this.prestamosActivos.push(prestamoId);
    }
  }

  removerPrestamoActivo(prestamoId) {
    this.prestamosActivos = this.prestamosActivos.filter(id => id !== prestamoId);
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      segundoNombre: this.segundoNombre,
      primerApellido: this.primerApellido,
      segundoApellido: this.segundoApellido,
      email: this.email,
      documento: this.documento,
      tipoDocumento: this.tipoDocumento,
      direccion: this.direccion,
      celular: this.celular,
      fechaRegistro: this.fechaRegistro,
      prestamosActivos: this.prestamosActivos,
      activo: this.activo
    };
  }

  static fromJSON(data) {
    return new Usuario(data);
  }
}
