import * as React from 'react'
// navigation
import { createStackNavigator,TransitionPresets } from '@react-navigation/stack'
// screens
import Login from '../screens/Login'
import Authenticate from '../screens/Authenticate'

const MainStack = createStackNavigator() 

const Navigation = () => {
  return (
    <MainStack.Navigator headerMode="none">
      <MainStack.Screen name="Login" component={Login} options={{ ...TransitionPresets.SlideFromRightIOS }}/>
      <MainStack.Screen name="Authenticate" component={Authenticate} options={{ ...TransitionPresets.SlideFromRightIOS }}/>
    </MainStack.Navigator>
  )
}

export default Navigation

