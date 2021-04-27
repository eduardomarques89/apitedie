import React, { useContext } from 'react';
// navigator
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
// screens
import Account from '../screens/Account/Account';
import Orders from '../screens/Account/Orders';
import Order from '../screens/Account/Order';
import Coupons from '../screens/Coupons';
import Profile from '../screens/Account/Profile';
import Locations from '../screens/Locations';
import Cards from '../screens/OrderPayments';
import Card from '../screens/Card';
import Help from '../screens/Account/Help';
import MyCode from '../screens/Account/MyCode';
import Rating from '../screens/Account/Rating';
import Tickets from '../screens/Tickets';
import Ticket from '../screens/Ticket';
import { AppContext } from '../contexts/AppContext';
import Login from './Login';
import Beneficios from '../screens/Account/Beneficios';

const AccountStack = createStackNavigator();

const AccountStackComponent = () => {
  const { state, dispatch } = useContext(AppContext);
  return (
    <AccountStack.Navigator headerMode="none">
      <AccountStack.Screen name="Conta" component={Account} options={{ ...TransitionPresets.SlideFromRightIOS }} />
      <AccountStack.Screen name="Pedidos" component={Orders} options={{ ...TransitionPresets.SlideFromRightIOS }} />
      <AccountStack.Screen name="Pedido" component={Order} options={{ ...TransitionPresets.SlideFromRightIOS }} initialParams={{ order: {} }} />
      <AccountStack.Screen name="Cupons" component={Coupons} options={{ ...TransitionPresets.SlideFromRightIOS }} />
      <AccountStack.Screen name="Perfil" component={Profile} options={{ ...TransitionPresets.SlideFromRightIOS }} />
      <AccountStack.Screen name="Localização" component={Locations} options={{ ...TransitionPresets.SlideFromRightIOS }} />
      <AccountStack.Screen name="Pagamento" component={Cards} options={{ ...TransitionPresets.SlideFromRightIOS }} />
      <AccountStack.Screen name="Cartão" component={Card} options={{ ...TransitionPresets.SlideFromRightIOS }} />
      <AccountStack.Screen name="Ajuda" component={Help} options={{ ...TransitionPresets.SlideFromRightIOS }} />
      <AccountStack.Screen name="Indicação" component={MyCode} options={{ ...TransitionPresets.SlideFromRightIOS }} />
      <AccountStack.Screen name="Avaliar" component={Rating} options={{ ...TransitionPresets.SlideFromRightIOS }} />
      <AccountStack.Screen name="Tickets" component={Tickets} options={{ ...TransitionPresets.SlideFromRightIOS }} />
      <AccountStack.Screen name="Ticket" component={Ticket} options={{ ...TransitionPresets.SlideFromRightIOS }} />
      <AccountStack.Screen name="Benefícios" component={Beneficios} options={{ ...TransitionPresets.SlideFromRightIOS }} />
      <AccountStack.Screen name="Rating" component={Rating} options={{ ...TransitionPresets.SlideFromRightIOS }} />
    </AccountStack.Navigator>
  );
};

export default AccountStackComponent;
