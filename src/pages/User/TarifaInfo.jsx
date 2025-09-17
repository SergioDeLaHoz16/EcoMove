import React from "react";

const TarifaInfo = ({ modelo, fechaInicio, fechaFin, dias, tarifaTotal, formatPrice, pricing }) => {
  if (!modelo || !fechaInicio || !fechaFin || !pricing) return null;

  // Tarifa adicional por retraso (ejemplo: 20% extra por día de retraso)
  const tarifaRetraso = pricing.daily * 0.2;

  return (
    <div className="mb-4 p-4 bg-gray-50 rounded border text-left">
      <div className="mb-2">
        <span className="font-medium">Tarifa base por día:</span> {formatPrice(pricing.daily)}
      </div>
      <div className="mb-2">
        <span className="font-medium">Días de arrendamiento:</span> {dias}
      </div>
      <div className="mb-2">
        <span className="font-medium">Total estimado:</span> <span className="text-green-700 font-bold">{formatPrice(tarifaTotal)}</span>
      </div>
      <div className="mt-2 text-yellow-700 text-sm">
        Si te pasas de la fecha de entrega, se cobrará una tarifa adicional de <b>{formatPrice(tarifaRetraso)}</b> por cada día extra.
      </div>
    </div>
  );
};

export default TarifaInfo;
