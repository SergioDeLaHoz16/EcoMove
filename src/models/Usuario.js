export class Usuario {
  constructor({ id, nombre, email, documento, fechaRegistro, prestamosActivos = [] }) {
    this.id = id || this.generateId();
    this.nombre = nombre;
    this.email = email;
    this.documento = documento;
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

    if (!this.email || !this.isValidEmail(this.email)) {
      errores.push('Debe proporcionar un email válido');
    }

    if (!this.documento || this.documento.trim().length < 5) {
      errores.push('El documento debe tener al menos 5 caracteres');
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
      email: this.email,
      documento: this.documento,
      fechaRegistro: this.fechaRegistro,
      prestamosActivos: this.prestamosActivos,
      activo: this.activo
    };
  }

  static fromJSON(data) {
    return new Usuario(data);
  }
}
