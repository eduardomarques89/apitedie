import { useContext, useEffect } from 'react';
import { CartContext } from '../contexts/CartContext';

export const useQuantity = (product) => {
  const { cartState } = useContext(CartContext);
  const quantity = cartState.products.find((c) => c.product.Id == product.Id)?.quantity ?? 0;
  return { quantity };
};
