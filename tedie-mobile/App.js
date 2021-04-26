import React, { useEffect, useReducer, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// navigation
import { NavigationContainer } from '@react-navigation/native';
import { AppearanceProvider } from 'react-native-appearance';
import { View } from 'react-native';
import Navigation from './src/navigation';
// services
import { AppContext, appReducer, initialState } from './src/contexts/AppContext';
import { CartContext, appCartReducer, cartInitialState } from './src/contexts/CartContext';
import { CheckoutContext, appCheckoutReducer, checkoutInitialState } from './src/contexts/CheckoutContext';
import { getMarketsListByIds } from './src/services/market';

export default function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [firstRender, setFirstRender] = useState(true);
  const [loading, setLoading] = useState(true);
  const [cartState, cartDispatch] = useReducer(appCartReducer, cartInitialState);
  const [checkoutState, checkoutDispatch] = useReducer(appCheckoutReducer, checkoutInitialState);

  async function loadMarkets(marketsOld) {
    const selectedMarkets = marketsOld.map((market) => market.market.IdEmpresa);
    const markets = await getMarketsListByIds(selectedMarkets);
    return markets;
  }

  useEffect(() => {
    async function getItems() {
      setLoading(true);
      const items = JSON.parse(await AsyncStorage.getItem('items'));
      if (items) {
        const actionState = { type: 'LOAD_USER_DATA', payload: { ...items.state } };
        dispatch(actionState);
        try {
          const newMarkets = await loadMarkets(items.market.markets);
          const markets = items.market.markets.map((market) => {
            const newMarket = newMarkets.find((marketa) => marketa.IdEmpresa === market.market.IdEmpresa);
            if (newMarket) {
              return { ...market, market: newMarket };
            }
            return market;
          });
          setLoading(false);
          const action = { type: 'LOAD_MARKET_DATA', payload: { ...items.market, markets } };
          cartDispatch(action);
        } catch {
          setLoading(false);
        }
      }
    }
    getItems();
  }, []);

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }
    async function setItems() {
      await AsyncStorage.setItem('items', JSON.stringify({
        state,
        market: cartState,
      }));
    }
    setItems();
  }, [state, cartState]);

  if (loading) {
    return <View style={{ flex: 1, backgroundColor: '#d70d0f' }} />;
  }

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
