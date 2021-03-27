import React, { useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
// navigation
import { NavigationContainer } from '@react-navigation/native';
import { AppearanceProvider } from 'react-native-appearance';
import Navigation from './src/navigation';
// services
import { AppContext, appReducer, initialState } from './src/contexts/AppContext';
import { CartContext, appCartReducer, cartInitialState } from './src/contexts/CartContext';
import { CheckoutContext, appCheckoutReducer, checkoutInitialState } from './src/contexts/CheckoutContext';
import { getMarketsListByIds } from './src/services/market';

export default function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [cartState, cartDispatch] = useReducer(appCartReducer, cartInitialState);
  const [checkoutState, checkoutDispatch] = useReducer(appCheckoutReducer, checkoutInitialState);

  async function loadLocalization() {
    const address = JSON.parse(await AsyncStorage.getItem('Localization'));
    const action = { type: 'createAddress', payload: address };
    dispatch(action);
  }

  async function loadCarrinho() {
    const carrinho = JSON.parse(await AsyncStorage.getItem('carrinho'));
    if (!carrinho) return;
    const action = { type: 'loadCarrinho', payload: carrinho };
    dispatch(action);
  }

  async function loadSessao() {
    const sessao = JSON.parse(await AsyncStorage.getItem('sessao'));
    const token = JSON.parse(await AsyncStorage.getItem('token'));
    const action = { type: 'createSessao', payload: { sessao } };
    const actionToken = { type: 'getToken', payload: token };
    dispatch(action);
    dispatch(actionToken);
  }

  function getSelectedMarkets() {
    return state.carrinho
      .filter((c, i, v) => v.findIndex((f) => f.product.IdEmpresa == c.product.IdEmpresa) == i)
      .map((c) => c.product.IdEmpresa);
  }

  async function loadMarkets() {
    const selectedMarkets = getSelectedMarkets();
    getMarketsListByIds(selectedMarkets)
      .then((markets) => {
        const action = { type: 'setMarkets', payload: { markets } };
        cartDispatch(action);
      });
  }

  useEffect(() => {
    loadSessao();
    loadLocalization();
    loadCarrinho();
  }, []);

  useEffect(() => {
    loadMarkets();
  }, [state.carrinho]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <CheckoutContext.Provider value={{ checkoutState, checkoutDispatch }}>
        <CartContext.Provider value={{ cartState, cartDispatch }}>
          <AppearanceProvider>
            <NavigationContainer>
              <Navigation />
            </NavigationContainer>
          </AppearanceProvider>
        </CartContext.Provider>
      </CheckoutContext.Provider>
    </AppContext.Provider>
  );
}
