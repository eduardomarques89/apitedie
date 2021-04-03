import { createContext } from 'react';

export const CheckoutContext = createContext();

export const checkoutInitialState = {
  selectedMarketIndex: 0,
  opcaoPagamento: undefined,
  cupom: undefined,
  horarioEntregaPorEstabelecimento: [],
  enderecoEntregaPorEstabelecimento: [],
  cartaoPorEstabelecimento: [],
};

export const appCheckoutReducer = (state = checkoutInitialState, action) => {
  switch (action.type) {
    case 'setSelectedMarketIndex':
      return { ...state, selectedMarketIndex: action.payload.selectedMarketIndex };
    case 'setOpcaoPagamento':
      return { ...state, opcaoPagamento: action.payload.opcaoPagamento };
    case 'setCupom':
      return { ...state, cupom: action.payload.cupom };
    case 'setHorarioEntregaPorEstabelecimento':
      return { ...state, horarioEntregaPorEstabelecimento: action.payload.horarioEntregaPorEstabelecimento };
    case 'setEnderecoEntregaPorEstabelecimento':
      return { ...state, enderecoEntregaPorEstabelecimento: action.payload.enderecoEntregaPorEstabelecimento };
    case 'setCartaoPorEstabelecimento':
      return { ...state, cartaoPorEstabelecimento: action.payload.cartaoPorEstabelecimento };
    case 'CLEAR_CART':
      return checkoutInitialState;
    default:
      return state;
  }
};
