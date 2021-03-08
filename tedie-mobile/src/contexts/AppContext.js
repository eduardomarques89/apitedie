import AsyncStorage from '@react-native-community/async-storage';
import { createContext } from 'react';

export const AppContext = createContext();

export const appReducer = (state, action) => {
  switch (action.type) {
    case 'createCarrinho':
      return createCarrinho(state, action);
    case 'loadCarrinho':
      return loadCarrinho(state, action);
    case 'createAddress':
      return createAddress(state, action);
    case 'createSessao':
      return createSessao(state, action);
    case 'getToken':
      return { ...state, token: action.payload };
    case 'deleteItem':
      return deleteItem(state, action);
    case 'deleteQuantyItem':
      return deleteQuantyItem(state, action);
    case 'addQuantyItem':
      return addQuantyItem(state, action);
    case 'addMarketSelect':
      return addMarketSelect(state, action);
    case 'addCpfOrCpnj':
      return addCpfOrCpnj(state, action);
    default:
      return state;
  }
};

export const initialState = {
  token: undefined,
  address: undefined,
  carrinho: new Array(),
  sessao: undefined,
  market: {},
};

function addCpfOrCpnj(state, action) {
  return { ...state, cpf: action.value };
}

function addMarketSelect(state, action) {
  return { ...state, market: action.market };
}

function createCarrinho(state, action) {
  if (action.payload.product) {
    const carrinho = [...state.carrinho.filter((c) => c.product.Id != action.payload.product.Id)];
    if (action.payload.quantity > 0) {
      carrinho.push(action.payload);
    }
    AsyncStorage.setItem('carrinho', JSON.stringify(carrinho));
    return { ...state, carrinho };
  }
  AsyncStorage.setItem('carrinho', JSON.stringify([]));
  return { ...state, carrinho: [] };
}

function loadCarrinho(state, action) {
  return { ...state, carrinho: action.payload };
}

function createAddress(state, action) {
  let local = action.payload;
  if (local && (local.CEP == undefined || local.CEP == '')) {
    const CEP = convergeCep(local);
    console.log(CEP);
    local = { ...local, CEP };
  }
  return { ...state, address: local };
}

function createSessao(state, action) {
  const { sessao } = action.payload;
  // AsyncStorage.setItem("sessao", JSON.stringify(sessao))
  return { ...state, sessao: { IdCliente: 54 } };
}
function deleteItem(state, action) {
  const newCarrinho = state.carrinho.filter(({ product }) => product.Id !== action.id);
  return { ...state, carrinho: newCarrinho };
}
function deleteQuantyItem(state, action) {
  const newCarrinho = [];
  for (let i = 0; i < state.carrinho.length; i++) {
    if (state.carrinho[i].product.Id === action.id) {
      const newQuantity = state.carrinho[i].quantity - 1;
      if (newQuantity !== 0) {
        newCarrinho.push({ product: { ...state.carrinho[i].product }, quantity: newQuantity });
      }
    } else {
      newCarrinho.push({ ...state.carrinho[i] });
    }
  }
  AsyncStorage.setItem('carrinho', JSON.stringify(newCarrinho));
  return { ...state, carrinho: newCarrinho };
}
function addQuantyItem(state, action) {
  const newCarrinho = [];
  for (let i = 0; i < state.carrinho.length; i++) {
    if (state.carrinho[i].product.Id === action.id) {
      const newQuantity = state.carrinho[i].quantity + 1;
      newCarrinho.push({ product: { ...state.carrinho[i].product }, quantity: newQuantity });
    } else {
      newCarrinho.push({ ...state.carrinho[i] });
    }
  }
  AsyncStorage.setItem('carrinho', JSON.stringify(newCarrinho));
  return { ...state, carrinho: newCarrinho };
}

export const convergeCep = (local) => {
  try {
    return (local.results[0]?.address_components.filter((ac) => ac.types.filter((ty) => ty == 'postal_code')?.length > 0)[0]?.short_name ?? '').replace('-', '');
  } catch (e) {
    console.log(e);
    debugger;
  }
};
