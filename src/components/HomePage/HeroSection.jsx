"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Check, Play, Zap, Shield, Leaf } from "lucide-react"

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const heroSlides = [
    {
      title: "Obten tu Bicicleta y Patineta",
      subtitle: "Electrica Favorita",
      description:
        "Puedes conseguir tu patineta o bicicleta ideal para tus necesidades entre nuestras colecciones de ultimo modelo con tecnologia avanzada.",
      image: "https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=800",
      features: ["Tiempo de carga 5 - 6 h", "Peso Maximo 100kg", "Velocidad Maxima 60km"],
    },
    {
      title: "Movilidad Sostenible",
      subtitle: "Para el Futuro",
      description:
        "Únete a la revolución de la movilidad eléctrica. Nuestros vehículos son 100% ecológicos y perfectos para la ciudad moderna.",
      image: "https://images.pexels.com/photos/1149601/pexels-photo-1149601.jpeg?auto=compress&cs=tinysrgb&w=800",
      features: ["0% Emisiones", "Tecnología Avanzada", "Diseño Moderno"],
    },
    {
      title: "Renta Fácil",
      subtitle: "y Conveniente",
      description:
        "Sistema de renta por horas o días. Encuentra tu vehículo, selecciona el tiempo y disfruta de la mejor experiencia de movilidad.",
      image: "https://images.pexels.com/photos/1149601/pexels-photo-1149601.jpeg?auto=compress&cs=tinysrgb&w=800",
      features: ["Renta por Horas", "Múltiples Estaciones", "App Móvil"],
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [])

  const currentSlideData = heroSlides[currentSlide]
  

  return (
    <section className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 overflow-hidden min-h-screen flex items-center">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-200 rounded-full opacity-30 animate-float"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-emerald-300 rounded-full opacity-20 animate-pulse-slow"></div>
        <div
          className="absolute bottom-20 left-1/4 w-24 h-24 bg-teal-200 rounded-full opacity-25 animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-40 right-1/3 w-40 h-40 bg-green-300 rounded-full opacity-15 animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        ></div>

        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div
            className={`space-y-8 transform transition-all duration-1000 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}
          >
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium animate-fade-in">
                <Leaf className="w-4 h-4" />
                <span>100% Eco-Friendly</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold leading-tight animate-slide-up">
                <span className="text-green-800">{currentSlideData.title.split(" ").slice(0, 2).join(" ")} </span>
                <br />
                <span className="text-green-600 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {currentSlideData.subtitle}
                </span>
              </h1>
            </div>

            <div
              className={`space-y-4 text-gray-700 transform transition-all duration-1000 delay-300 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}
            >
              <p className="text-lg leading-relaxed">{currentSlideData.description}</p>
              <p className="text-lg leading-relaxed">
                Además, ofrecemos servicios de reparación internos para tu comodidad
              </p>
            </div>

            <div
              className={`flex flex-col sm:flex-row gap-4 transform transition-all duration-1000 delay-500 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}
            >
              <button className="group bg-green-700 hover:bg-green-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center space-x-2">
                <span>Rentar Ahora</span>
                <Zap className="w-5 h-5 group-hover:animate-pulse" />
              </button>

              <button className="group border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2">
                <Play className="w-5 h-5" />
                <span>Ver Demo</span>
              </button>
            </div>

            <div
              className={`flex flex-wrap gap-4 pt-4 transform transition-all duration-1000 delay-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}
            >
              {currentSlideData.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-full shadow-sm hover:shadow-md transition-all duration-300 animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <div
              className={`flex items-center space-x-6 pt-6 transform transition-all duration-1000 delay-900 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}
            >
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Seguro y Confiable</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 bg-green-100 rounded-full border-2 border-white flex items-center justify-center"
                    >
                      <span className="text-xs text-green-600 font-bold">U</span>
                    </div>
                  ))}
                </div>
                <span className="text-sm text-gray-600">+1000 usuarios activos</span>
              </div>
            </div>
          </div>

          <div
            className={`relative transform transition-all duration-1000 delay-300 ${isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}
          >
            <div className="relative z-10">
              <div className="relative bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl p-8 shadow-2xl">
                <img
                  src={currentSlideData.image || "/placeholder.svg"}
                  alt="Electric Vehicle"
                  className="w-full h-auto max-w-lg mx-auto rounded-2xl shadow-lg hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute -top-4 -right-4 bg-white px-6 py-3 rounded-2xl shadow-xl flex items-center space-x-3 animate-float">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-bold text-gray-800">Disponible Ahora</span>
                </div>

                <div
                  className="absolute -bottom-4 -left-4 bg-white px-6 py-3 rounded-2xl shadow-xl flex items-center space-x-3 animate-float"
                  style={{ animationDelay: "1s" }}
                >
                  <Zap className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-bold text-gray-800">Carga Rápida</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center mt-12 space-x-4">
          <button
            onClick={prevSlide}
            className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-green-600" />
          </button>

          <div className="flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-green-600 w-8" : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
          >
            <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-green-600" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
