import { useContext, useEffect } from "react"
import { AppContext } from "../contexts/AppContext"

export const useQuantity = (product) => {
    const { state } = useContext(AppContext);
    const quantity = state.carrinho.filter(c => c.product.Id == product.Id)[0]?.quantity ?? 0
    return { quantity: quantity }
}