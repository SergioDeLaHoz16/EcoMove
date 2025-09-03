export class LocalStorageService {
  static save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error guardando en localStorage:', error);
      throw new Error('No se pudo guardar la información');
    }
  }

  static load(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error cargando de localStorage:', error);
      return null;
    }
  }

  static remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error eliminando de localStorage:', error);
    }
  }

  static clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error limpiando localStorage:', error);
    }
  }

  static exists(key) {
    return localStorage.getItem(key) !== null;
  }

  // Métodos específicos para las entidades
  static saveUsers(users) {
    this.save('ecomove_usuarios', users);
  }

  static loadUsers() {
    return this.load('ecomove_usuarios') || [];
  }

  static saveStations(stations) {
    this.save('ecomove_estaciones', stations);
  }

  static loadStations() {
    return this.load('ecomove_estaciones') || [];
  }

  static saveTransports(transports) {
    this.save('ecomove_transportes', transports);
  }

  static loadTransports() {
    return this.load('ecomove_transportes') || [];
  }

  static saveLoans(loans) {
    this.save('ecomove_prestamos', loans);
  }

  static loadLoans() {
    return this.load('ecomove_prestamos') || [];
  }

  static savePayments(payments) {
    this.save('ecomove_pagos', payments);
  }

  static loadPayments() {
    return this.load('ecomove_pagos') || [];
  }
}