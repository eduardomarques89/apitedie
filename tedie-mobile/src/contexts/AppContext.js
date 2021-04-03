import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext } from 'react';

export const AppContext = createContext();

export const initialState = {
  token: undefined,
  address: undefined,
  carrinho: [],
  sessao: undefined,
  market: {},
};

export const appReducer = (state, action) => {
  switch (action.type) {
    case 'createAddress':
      return createAddress(state, action);
    case 'createSessao':
      return createSessao(state, action);
    case 'getToken':
      return { ...state, token: action.payload };
    case 'addMarketSelect':
      return addMarketSelect(state, action);
    case 'addCpfOrCpnj':
      return addCpfOrCpnj(state, action);
    case 'LOAD_USER_DATA':
      return action.payload;
    case 'LOG_OUT':
      AsyncStorage.removeItem('sessao');
      return initialState;
    default:
      return state;
  }
};

function addCpfOrCpnj(state, action) {
  return { ...state, cpf: action.value };
}

function addMarketSelect(state, action) {
  return { ...state, market: action.market };
}
function createAddress(state, action) {
  let local = action.payload;
  if (local && (local.CEP == undefined || local.CEP == '')) {
    const CEP = convergeCep(local);
    local = { ...local, CEP };
  }
  return { ...state, address: local };
}

function createSessao(state, action) {
  const { sessao } = action.payload;
  AsyncStorage.setItem('sessao', JSON.stringify(sessao));
  return { ...state, sessao };
}

export const convergeCep = (local) => {
  try {
    return (local?.results[0]?.address_components.filter((ac) => ac.types.filter((ty) => ty == 'postal_code')?.length > 0)[0]?.short_name ?? '').replace('-', '');
  } catch (e) {
  }
};
