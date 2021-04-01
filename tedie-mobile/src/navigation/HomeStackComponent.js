import React from 'react';
// navigator
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
// screens
import Home from '../screens/Home';
import Locations from '../screens/Locations';
import LocationsCheckout from '../screens/LocationsCheckout';
import Location from '../screens/Location';
import Market from '../screens/Market';
import Product from '../screens/Product';
import Products from '../screens/Products';

const HomeStack = createStackNavigator();

const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

const HomeStackComponent = () => (
  <HomeStack.Navigator headerMode="none">
    <HomeStack.Screen
      name="Início"
      component={Home}
      options={{
        ...TransitionPresets.ModalPresentationIOS,
      }}
    />
    {/* <HomeStack.Screen
        name="Localizações"
        component={Locations}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      /> */}

    {/* <MainStack.Screen name="Produtos2" component={Products} />
      <MainStack.Screen name="Localizações2" component={Locations} /> */}
    <HomeStack.Screen
      name="Localização"
      component={Locations}
      options={{
        ...TransitionPresets.SlideFromRightIOS,
      }}
    />
    <HomeStack.Screen
      name="Mercado"
      component={Market}
      options={{
        ...TransitionPresets.SlideFromRightIOS,
      }}
    />
    <HomeStack.Screen
      name="Produto"
      component={Product}
      options={{
        ...TransitionPresets.SlideFromRightIOS,
      }}
    />
    <HomeStack.Screen
      name="Produtos"
      component={Products}
      options={{
        ...TransitionPresets.SlideFromRightIOS,
      }}
    />
  </HomeStack.Navigator>
);

export default HomeStackComponent;
