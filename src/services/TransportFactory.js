import { Transporte } from '../models/Transporte.js';

export class TransportFactory {
  static createTransport(tipo, codigo, estacionId, datos = {}) {
    const transporteBase = {
      id: this.generateId(),
      codigo,
      tipo,
      estacionId,
      disponible: true,
      fechaCreacion: new Date().toISOString(),
      ...datos
    };

    switch (tipo.toLowerCase()) {
      case 'bicicleta':
        return new Transporte({
          ...transporteBase,
          caracteristicas: {
            cambios: datos.cambios || 7,
            tamaño: datos.tamaño || 'mediano',
            tipoFreno: datos.tipoFreno || 'disco',
            cesta: datos.cesta || false,
            ...datos.caracteristicas
          }
        });

      case 'scooter':
        return new Transporte({
          ...transporteBase,
          caracteristicas: {
            autonomia: datos.autonomia || 25,
            velocidadMaxima: datos.velocidadMaxima || 25,
            peso: datos.peso || 12,
            plegable: datos.plegable || true,
            ...datos.caracteristicas
          }
        });

      case 'auto_electrico':
        return new Transporte({
          ...transporteBase,
          caracteristicas: {
            autonomia: datos.autonomia || 300,
            plazas: datos.plazas || 4,
            tipoConector: datos.tipoConector || 'Tipo 2',
            asistenciaTecnica: datos.asistenciaTecnica || true,
            ...datos.caracteristicas
          }
        });

      default:
        throw new Error(`Tipo de transporte no válido: ${tipo}`);
    }
  }

  static getAvailableTypes() {
    return ['bicicleta', 'scooter', 'auto_electrico'];
  }

  static getTypeFeatures(tipo) {
    const features = {
      bicicleta: {
        icono: '🚲',
        descripcion: 'Bicicleta urbana ecológica',
        caracteristicasDisponibles: ['cambios', 'tamaño', 'tipoFreno', 'cesta']
      },
      scooter: {
        icono: '🛴',
        descripcion: 'Scooter eléctrico urbano',
        caracteristicasDisponibles: ['autonomia', 'velocidadMaxima', 'peso', 'plegable']
      },
      auto_electrico: {
        icono: '🚗',
        descripcion: 'Automóvil eléctrico compartido',
        caracteristicasDisponibles: ['autonomia', 'plazas', 'tipoConector', 'asistenciaTecnica']
      }
    };

    return features[tipo] || null;
  }

  static generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
