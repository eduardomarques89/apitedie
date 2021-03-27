import { createContext } from 'react';

export const CartContext = createContext();

export const cartInitialState = {
  selected: undefined,
  selectedNome: undefined,
  totalCompras: 0,
  markets: [],
  totalComprasPorEstabelecimento: [],
};

export const appCartReducer = (state = cartInitialState, action) => {
  switch (action.type) {
    case 'select':
      return { ...state, selected: action.payload.IdEmpresa, selectedNome: action.payload.Nome };
    case 'setTotalCompras':
      return { ...state, totalCompras: action.payload.totalCompras };
    case 'setSomaParcial':
      return { ...state, totalCompras: action.payload.somaParcial };
    case 'setMarkets':
      return { ...state, markets: action.payload.markets };
    case 'setTotalComprasPorEstabelecimento':
      return { ...state, totalComprasPorEstabelecimento: action.payload.totalComprasPorEstabelecimento };
    case 'CLEAR_CART':
      return { ...cartInitialState };
    default:
      return state;
  }
};
