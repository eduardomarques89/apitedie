import React, { useEffect, useCallback } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
// components
import ContentContainer from './ContentContainer'
import Box from './Box'
import Typography from './Typography'
import Divider from './Divider'
// theme
import theme from '../theme'

const OrderItem = ({ order, onPress }) => {

  const calculateTotalValue = useCallback((value, off, deliveryTax) => {
    value = Number.parseFloat(value)
    off = Number.parseFloat(off)
    deliveryTax = Number.parseFloat(deliveryTax)

    let sum = value + off + deliveryTax

    return sum.toFixed(2).replace('.', ',')
  }, [])

  return (
    <TouchableOpacity onPress={onPress}>
      <ContentContainer>
        <Box direction="row" justify="space-between" alignItems="center">
          <Box direction="row" justify="flex-start" alignItems="center">
            <View style={styles.orderMarketIcon} />

            <Box direction="column" justify="center" alignItems="flex-start">
              <Typography size="small" color={theme.palette.dark}>
                #{order.NumeroPedido}
              </Typography>
              {order.status === 'incoming' && (
                <Typography size="caption" color={theme.palette.success}>
                  A caminho
                </Typography>
              )}
              {order.status === 'finished' && (
                <Typography size="caption" color={theme.palette.success}>
                  Finalizado
                </Typography>
              )}
              <Typography size="small" color={theme.palette.dark}>
                R$ {calculateTotalValue(order.Valor, order.Desconto, order.Taxa)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider />

        {order.status === 'waiting_confirmation' && (
          <Box direction="row" justify="flex-start" alignItems="center">
            <Ionicons name="ios-checkmark-circle" size={25} color={theme.palette.light} />
            <Typography size="small" color={theme.palette.light}>
              {order.statusMessage}
            </Typography>
          </Box>
        )}

        {order.status === 'confirmed' && (
          <Box direction="row" justify="flex-start" alignItems="center">
            <Ionicons name="ios-checkmark-circle" size={25} color={theme.palette.success} />
            <Typography size="small" color={theme.palette.success}>
              {order.statusMessage}
            </Typography>
          </Box>
        )}

        {order.status === 'incoming' && (
          <Box direction="row" justify="flex-start" alignItems="center">
            <Ionicons name="ios-cart" size={25} color={theme.palette.success} />
            <Typography size="small" color={theme.palette.success}>
              {order.statusMessage}
            </Typography>
          </Box>
        )}

        {order.status === 'cancelled' && (
          <Box direction="row" justify="flex-start" alignItems="center">
            <Ionicons name="ios-close-circle" size={25} color={theme.palette.primary} />
            <Typography size="small" color={theme.palette.primary}>
              {order.statusMessage}
            </Typography>
          </Box>
        )}

        {order.status === 'collect' && (
          <Box direction="row" justify="flex-start" alignItems="center">
            <Ionicons name="ios-basket" size={25} color={theme.palette.success} />
            <Typography size="small" color={theme.palette.success}>
              {order.statusMessage}
            </Typography>
          </Box>
        )}

        {order.status === 'finished' && (
          <Box direction="row" justify="flex-start" alignItems="center">
            <Ionicons name="ios-cart" size={25} color={theme.palette.success} />
            <Typography size="small" color={theme.palette.success}>
              {order.statusMessage}
            </Typography>
          </Box>
        )}
      </ContentContainer>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  orderMarketIcon: {
    width: 40,
    height: 40,
    backgroundColor: theme.palette.secondary,
    borderRadius: 100
  }
})


export default OrderItem

