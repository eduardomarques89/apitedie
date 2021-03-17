import React, { useState, useCallback, useEffect } from 'react'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
// components
import Navbar from '../../components/Navbar'
import ScreenContainer from '../../components/ScreenContainer'
import Typography from '../../components/Typography'
import OrderItem from '../../components/OrderItem'
// theme
import theme from '../../theme'
// services
import { getOrders } from '../../services/orders'
import {useNavigation} from '@react-navigation/native'

const Orders = ({ navigation }) => {
  const navigate = useNavigation()
  const [ordersLoader, setOrderLoader] = useState(false)
  const [orders, setOrders] = useState([])

  const loadOrders = useCallback(async () => {
    setOrderLoader(true)

    const orderResponse = await getOrders()
    setOrders(orderResponse)

    setOrderLoader(false)
  }, [setOrderLoader, setOrders, getOrders])

  useEffect(() => {
    debugger
    loadOrders()
  }, [])

  return (
    <React.Fragment>
      <Navbar
        left={
          <TouchableOpacity hitSlop={theme.hitSlop} onPress={() => {
            if(navigate.canGoBack()){
              navigate.goBack()
            }
          }}>
            <Ionicons name="md-arrow-back" size={25} color="#fff" />
          </TouchableOpacity>
        }
        title={
          <Typography size="small" color="#fff">
            Pedidos
          </Typography>
        }
      />

      <ScreenContainer>
        {!ordersLoader && orders.length > 0
          && orders.map((order, index) => (
            <OrderItem
              order={order}
              onPress={() => navigation.navigate('Pedido', { order: order })}
              key={index}
            />
          ))
        }
      </ScreenContainer>
    </React.Fragment>
  )
}

export default Orders