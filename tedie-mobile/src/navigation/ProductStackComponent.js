import React from 'react'
// navigator
import { createStackNavigator, TransitionPresets  } from '@react-navigation/stack'
// screens
import Categories from '../screens/Categories'
import Products from '../screens/Products'
import Product from '../screens/Product'
import Locations from '../screens/Locations'
const ProductStack = createStackNavigator()

const ProductStackComponent = () => {
  return (
    <ProductStack.Navigator headerMode="none">

      <ProductStack.Screen name="Categorias" component={Categories} options={{ ...TransitionPresets.SlideFromRightIOS }} />
      <ProductStack.Screen name="Localizações2" component={Locations} options={{ ...TransitionPresets.SlideFromRightIOS }} />
      <ProductStack.Screen name="Produtos" component={Products} options={{ ...TransitionPresets.SlideFromRightIOS }} />
      <ProductStack.Screen name="Produto" component={Product} options={{ ...TransitionPresets.SlideFromRightIOS }} />
    </ProductStack.Navigator>
  )
}

export default ProductStackComponent
