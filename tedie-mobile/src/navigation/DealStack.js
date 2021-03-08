import * as React from 'react'
// navigation
import { createStackNavigator,TransitionPresets } from '@react-navigation/stack'
// screens
import Product from '../screens/Product'
import Products from '../screens/Products'
import Locations from '../screens/Locations'
import Deals from '../screens/Deals'

const {Navigator,Screen} = createStackNavigator() 

const DealStack = () => {
  return (
    <Navigator headerMode="none">
      <Screen name="Deals" component={Deals} options={{ ...TransitionPresets.SlideFromRightIOS }}/>
      <Screen name="Produto" component={Product} options={{ ...TransitionPresets.SlideFromRightIOS }}/>
      <Screen name="Produtos2" component={Products} options={{ ...TransitionPresets.SlideFromRightIOS }}/>
      <Screen name="Localizações2" component={Locations} options={{ ...TransitionPresets.SlideFromRightIOS }}/>
    </Navigator>
  )
}

export default DealStack

