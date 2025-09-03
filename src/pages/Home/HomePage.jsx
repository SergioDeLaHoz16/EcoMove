import Header from "../../components/HomePage/Header"
import HeroSection from "../../components/HomePage/HeroSection"
import FeaturesSection from "../../components/HomePage/FeaturesSection"
import CategoriesSection from "../../components/HomePage/CategorySection"
import ServicesSection from "../../components/HomePage/ServicesSection"
import RentalSection from "../../components/HomePage/RentalSection"
import PricingSection from "../../components/HomePage/PricingSection"

const Homepage = ({ onLoginClick, onRegisterClick }) => {
  console.log("[v0] Homepage rendering with props:", { onLoginClick, onRegisterClick })
  return (
    <div className="min-h-screen bg-white">
      <Header onLoginClick={onLoginClick} onRegisterClick={onRegisterClick} />
      <HeroSection />
      <FeaturesSection />
      <ServicesSection />
      <RentalSection />
      <CategoriesSection />
      <PricingSection />
    </div>
  )
}

export default Homepage
