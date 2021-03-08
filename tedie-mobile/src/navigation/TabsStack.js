import React,{useContext} from 'react'
// navigation
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
// navigators
import ProductStackComponent from './ProductStackComponent'
import HomeStackComponent from './HomeStackComponent'
import CartStackComponent from './CartStackComponent'
import AccountStackComponent from './AccountStackComponent'
// screens
import DealStack from './DealStack'
import Welcome from '../screens/Welcome'
// theme
import theme from '../theme';
import { Ionicons } from '@expo/vector-icons'
const Tabs = createBottomTabNavigator()

const TabsNavigator = () => {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName

          if (route.name === 'Início') iconName = 'md-home'
          if (route.name === 'Categorias') iconName = 'md-grid'
          if (route.name === 'Carrinho') iconName = 'md-cart'
          if (route.name === 'Promoções') iconName = 'md-pricetag'
          if (route.name === 'Conta') iconName = 'md-person'

          return <Ionicons name={iconName} size={30} color={color} />
        }
      })}
      tabBarOptions={{
        style: { backgroundColor: theme.palette.primary },
        activeTintColor: theme.palette.secondary,
        inactiveTintColor: 'white',
      }}
    >
      <Tabs.Screen name="Início" component={HomeStackComponent}  />
      <Tabs.Screen name="Categorias" component={ProductStackComponent} />
      <Tabs.Screen name="Carrinho" component={CartStackComponent} />
      <Tabs.Screen name="Promoções" component={DealStack} />
      <Tabs.Screen name="Conta" component={AccountStackComponent} />
    </Tabs.Navigator>
  )
}

export default TabsNavigator

