import React from "react";

const TarifaInfo = ({ modelo, fechaInicio, fechaFin }) => {
  if (!modelo || !fechaInicio || !fechaFin) return null;

  // Obtener tarifa base del modelo (configurada por el admin)
  const tarifaBase = modelo.tarifa || 0;

  // Calcular días de arrendamiento
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  const dias = Math.max(1, Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24)));

  // Calcular tarifa total
  const tarifaTotal = tarifaBase * dias;

  // Tarifa adicional por retraso (ejemplo: 20% extra por día de retraso)
  const tarifaRetraso = (tarifaBase * 0.2).toFixed(2);

  return (
    <div className="mb-4 p-4 bg-gray-50 rounded border text-left">
      <div className="mb-2">
        <span className="font-medium">Tarifa base por día:</span> €{tarifaBase.toFixed(2)}
      </div>
      <div className="mb-2">
        <span className="font-medium">Días de arrendamiento:</span> {dias}
      </div>
      <div className="mb-2">
        <span className="font-medium">Total estimado:</span> <span className="text-green-700 font-bold">€{tarifaTotal.toFixed(2)}</span>
      </div>
      <div className="mt-2 text-yellow-700 text-sm">
        Si te pasas de la fecha de entrega, se cobrará una tarifa adicional de <b>€{tarifaRetraso}</b> por cada día extra.
      </div>
    </div>
  );
};

export default TarifaInfo;
