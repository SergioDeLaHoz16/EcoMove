"use client"
import { ShoppingCart } from "lucide-react"
import { useRentalCart } from "../../contexts/RentalCartContext.jsx"
import { Store } from "lucide-react"
const RentalCartButton = ({ onClick }) => {
  const { itemCount } = useRentalCart()

  return (
    <button onClick={onClick} className="relative p-2 text-gray-600 hover:text-green-600 transition-colors">
      <Store className="w-5 h-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      )}
    </button>
  )
}

export default RentalCartButton
