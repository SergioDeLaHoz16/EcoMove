"use client"

import { createContext, useContext, useEffect, useReducer } from "react"
import { rentalService } from "../services/RentalService.js"

const RentalCartContext = createContext()

// Reducer for cart state management
const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET_CART_STATE":
      return {
        ...state,
        ...action.payload,
      }
    case "ADD_ITEM":
      return {
        ...state,
        items: [...state.items, action.payload],
        itemCount: state.itemCount + 1,
      }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
        itemCount: state.itemCount - 1,
      }
    case "UPDATE_ITEM":
      return {
        ...state,
        items: state.items.map((item) => (item.id === action.payload.id ? action.payload : item)),
      }
    case "CLEAR_CART":
      return {
        ...state,
        items: [],
        itemCount: 0,
        totalPrice: 0,
      }
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      }
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    default:
      return state
  }
}

const initialState = {
  items: [],
  totalPrice: 0,
  itemCount: 0,
  loading: false,
  error: null,
}

export const RentalCartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Subscribe to cart service changes
  useEffect(() => {
    const cartService = rentalService.getCartService()

    // Load initial state from storage
    cartService.loadFromStorage()

    // Subscribe to changes
    const unsubscribe = cartService.subscribe((cartState) => {
      dispatch({
        type: "SET_CART_STATE",
        payload: cartState,
      })
    })

    // Get initial state
    const initialCartState = cartService.getState()
    dispatch({
      type: "SET_CART_STATE",
      payload: initialCartState,
    })

    return unsubscribe
  }, [])

  // Save to storage whenever state changes
  useEffect(() => {
    if (state.items.length > 0) {
      rentalService.getCartService().saveToStorage()
    }
  }, [state.items])

  const addToCart = async (vehicleId, vehicleType, vehicleName, rentalType, startTime, endTime) => {
    dispatch({ type: "SET_LOADING", payload: true })
    dispatch({ type: "SET_ERROR", payload: null })

    try {
      const cartService = rentalService.getCartService()
      const newItem = cartService.addItem(vehicleId, vehicleType, vehicleName, rentalType, startTime, endTime)

      dispatch({ type: "SET_LOADING", payload: false })
      return newItem
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message })
      throw error
    }
  }

  const removeFromCart = (itemId) => {
    try {
      const cartService = rentalService.getCartService()
      cartService.removeItem(itemId)
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message })
    }
  }

  const updateItemEndTime = (itemId, newEndTime) => {
    try {
      const cartService = rentalService.getCartService()
      cartService.updateItemEndTime(itemId, newEndTime)
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message })
    }
  }

  const clearCart = () => {
    const cartService = rentalService.getCartService()
    cartService.clearCart()
  }

  const startRental = (cartItem) => {
    try {
      return rentalService.startRental(cartItem)
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message })
      throw error
    }
  }

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateItemEndTime,
    clearCart,
    startRental,
  }

  return <RentalCartContext.Provider value={value}>{children}</RentalCartContext.Provider>
}

export const useRentalCart = () => {
  const context = useContext(RentalCartContext)
  if (!context) {
    throw new Error("useRentalCart must be used within a RentalCartProvider")
  }
  return context
}
