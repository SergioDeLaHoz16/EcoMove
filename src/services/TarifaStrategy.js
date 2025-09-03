export class TarifaStrategy {
  calculate(tipoTransporte, duracionMinutos) {
    throw new Error('Método calculate debe ser implementado por las subclases');
  }
}

export class TarifaBicicleta extends TarifaStrategy {
  calculate(tipoTransporte, duracionMinutos) {
    const tarifaBase = 2.0;
    const tarifaPorMinuto = 0.1;
    
    // Primeros 30 minutos tarifa base, después por minuto
    if (duracionMinutos <= 30) {
      return tarifaBase;
    }
    
    const minutosAdicionales = duracionMinutos - 30;
    return tarifaBase + (minutosAdicionales * tarifaPorMinuto);
  }
}

export class TarifaScooter extends TarifaStrategy {
  calculate(tipoTransporte, duracionMinutos) {
    const tarifaActivacion = 3.0;
    const tarifaPorMinuto = 0.25;
    
    return tarifaActivacion + (duracionMinutos * tarifaPorMinuto);
  }
}

export class TarifaAutoElectrico extends TarifaStrategy {
  calculate(tipoTransporte, duracionMinutos) {
    const tarifaBase = 15.0;
    const tarifaPorHora = 12.0;
    
    // Mínimo 1 hora
    const horas = Math.max(1, Math.ceil(duracionMinutos / 60));
    return tarifaBase + (horas * tarifaPorHora);
  }
}

export class CalculadoraTarifa {
  constructor() {
    this.estrategias = {
      'bicicleta': new TarifaBicicleta(),
      'scooter': new TarifaScooter(),
      'auto_electrico': new TarifaAutoElectrico()
    };
  }

  calcular(tipoTransporte, duracionMinutos) {
    const estrategia = this.estrategias[tipoTransporte.toLowerCase()];
    
    if (!estrategia) {
      throw new Error(`No hay estrategia de tarifa para el tipo: ${tipoTransporte}`);
    }

    const tarifa = estrategia.calculate(tipoTransporte, duracionMinutos);
    return Math.round(tarifa * 100) / 100; // Redondear a 2 decimales
  }

  obtenerDetallesTarifa(tipoTransporte) {
    const detalles = {
      'bicicleta': {
        descripcion: 'Tarifa base de €2.00 por los primeros 30 minutos, luego €0.10 por minuto adicional',
        tarifaMinima: 2.0
      },
      'scooter': {
        descripcion: 'Tarifa de activación de €3.00 + €0.25 por minuto',
        tarifaMinima: 3.0
      },
      'auto_electrico': {
        descripcion: 'Tarifa base de €15.00 + €12.00 por hora (mínimo 1 hora)',
        tarifaMinima: 27.0
      }
    };

    return detalles[tipoTransporte.toLowerCase()] || null;
  }
}