import * as React from 'react';
// navigation
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
// screens
import TabsStack from './TabsStack';
import Welcome from '../screens/Welcome';
import Products from '../screens/Products';
import Locations from '../screens/Locations';
import Login from './Login';

const MainStack = createStackNavigator();

const Navigation = () => (
  <MainStack.Navigator headerMode="none">
    <MainStack.Screen name="Welcome" component={Welcome} options={{ ...TransitionPresets.SlideFromRightIOS }} />
    <MainStack.Screen name="tabs" component={TabsStack} options={{ ...TransitionPresets.SlideFromRightIOS }} />
    <MainStack.Screen name="Produtos2" component={Products} options={{ ...TransitionPresets.SlideFromRightIOS }} />
    <MainStack.Screen name="Localizações2" component={Locations} options={{ ...TransitionPresets.SlideFromRightIOS }} />
    <MainStack.Screen name="Login" component={Login} options={{ ...TransitionPresets.SlideFromRightIOS }} />

  </MainStack.Navigator>
);

export default Navigation;
