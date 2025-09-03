import React, { useState } from 'react';
import { Check } from 'lucide-react';

const PricingSection = () => {
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  const plans = [
    {
      name: "Gratis",
      price: "$0",
      period: "por mes",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt",
      features: [
        "Lorem ipsum lorem lorem lorem lorem dolor",
        "Lorem ipsum lorem lorem lorem lorem dolor",
        "Lorem ipsum lorem lorem lorem lorem dolor",
        "Lorem ipsum lorem lorem lorem lorem dolor",
        "Lorem ipsum lorem lorem lorem lorem dolor"
      ],
      buttonText: "Registrate Ahora",
      buttonStyle: "bg-green-200 hover:bg-green-300 text-green-800",
      popular: false
    },
    {
      name: "Pro",
      price: "$ 300.000",
      period: "por mes",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt",
      features: [
        "Lorem ipsum lorem lorem lorem lorem dolor",
        "Lorem ipsum lorem lorem lorem lorem dolor",
        "Lorem ipsum lorem lorem lorem lorem dolor",
        "Lorem ipsum lorem lorem lorem lorem dolor",
        "Lorem ipsum lorem lorem lorem lorem dolor"
      ],
      buttonText: "Registrate Ahora",
      buttonStyle: "bg-green-700 hover:bg-green-800 text-white",
      popular: true
    },
    {
      name: "Empresa",
      price: "Personalizado",
      period: "",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt",
      features: [
        "Lorem ipsum lorem lorem lorem lorem dolor",
        "Lorem ipsum lorem lorem lorem lorem dolor",
        "Lorem ipsum lorem lorem lorem lorem dolor",
        "Lorem ipsum lorem lorem lorem lorem dolor",
        "Lorem ipsum lorem lorem lorem lorem dolor"
      ],
      buttonText: "Contactate",
      buttonStyle: "bg-green-200 hover:bg-green-300 text-green-800",
      popular: false
    }
  ];

  return (
    <section className="relative bg-gradient-to-br from-green-50 to-green-100 py-20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-200 rounded-full opacity-30"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-green-300 rounded-full opacity-20"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8">
            <span className="text-green-800">Planes </span>
            <span className="text-green-600">Flexibles</span>
            <span className="text-green-800"> para </span>
            <span className="text-green-600">Cada Necesidad</span>
          </h2>
          
          <p className="text-lg text-gray-700 mb-8 max-w-4xl mx-auto">
            Elije tu plan que se adapte a tus necesidades. Ya sea con poco o ampliando luego tu plan, nuestros 
            precios apoyan a individuos, equipos y organizaciones con potentes funciones para mejorar su 
            flujo de trabajo.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                billingPeriod === 'monthly' 
                  ? 'bg-green-700 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                billingPeriod === 'annual' 
                  ? 'bg-green-700 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Anual
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div key={index} className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${plan.popular ? 'ring-2 ring-green-500 scale-105' : ''}`}>
              <div className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period && <span className="text-gray-600 ml-2">{plan.period}</span>}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{plan.description}</p>
                </div>

                <button className={`w-full py-4 rounded-lg font-semibold transition-colors mb-8 ${plan.buttonStyle}`}>
                  {plan.buttonText}
                </button>

                <div className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;