import React, { useState, useRef, useContext, useEffect, useCallback } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Image,
  Animated
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

// components
import theme from '../theme'
import { CartContext } from '../contexts/CartContext'
import { CheckoutContext } from '../contexts/CheckoutContext'
import { AppContext } from '../contexts/AppContext'
import {useNavigation,useFocusEffect} from '@react-navigation/native'

const CartFab = () => {
  const { cartState, cartDispatch } = useContext(CartContext);
  const { state, dispatch } = useContext(AppContext);
  const [lista, setLista] = useState([])
  const [isOpen, setOpen] = useState(false)
  const openFabAnimation = useRef(new Animated.Value(0)).current
  const navigate = useNavigation()

  async function handleSelectMarket(market) {
    const action = { type: "select", payload: { IdEmpresa: market.IdEmpresa, Nome: market.Nome } }
    cartDispatch(action);
    navigate.navigate("Carrinho")
  }

  async function atualiza() {
    let l = cartState.markets.map(market => {
      const qtd = state.carrinho.filter(c => c.product.IdEmpresa == market.IdEmpresa).map(c => c.quantity).reduce((a, v) => { return a + v }, 0)
      const obj = { market, qtd: qtd }
      return obj
    })

    l = l.filter(v => v.qtd > 0)
    setLista(l)
  }

  useFocusEffect(useCallback(() => {
    atualiza()
  }, [cartState.markets]))

  const openFab = () => {
    Animated.timing(openFabAnimation, {
      toValue: 1,
      duration: 250,
      useNativeDriver: 'true'
    }).start()
  }

  const closeFab = () => {
    Animated.timing(openFabAnimation, {
      toValue: 0,
      duration: 250,
      useNativeDriver: 'true'
    }).start()
  }

  const handleOpenFab = () => {
    setOpen(!isOpen)
    isOpen ? closeFab() : openFab()
  }

  return (
    <React.Fragment>
      {/* {isOpen && (
        <View style={styles.fabBackdrop} />
      )} */}

      <View style={styles.miniFabContainer}>
        {lista.map(obj => {
          return (
            <TouchableWithoutFeedback key={obj.market.IdEmpresa} onPress={() =>handleSelectMarket(obj.market)}>

            <Animated.View key={Math.random(100)} style={[
              styles.miniFab,
              {
                transform: [
                  { scaleX: openFabAnimation },
                  { scaleY: openFabAnimation }
                ]
              }
            ]}>
              <Animated.Image
                style={[
                  styles.miniFabImage,
                  {
                    transform: [
                      { scaleX: 1 },
                      { scaleY: 1 }
                    ]
                  }
                ]}
                source={{
                  uri: `${obj.market.Logo}`,
                }}
                resizeMode="contain"
              />
              <View style={styles.quantityContainer}>
                <Text style={styles.quantityText}>{obj.qtd}</Text>
              </View>
            </Animated.View>
            </TouchableWithoutFeedback>
          )
        })}
      </View>

      <TouchableWithoutFeedback  onPress={() => handleOpenFab()}>
        <View style={styles.fabContainer}>
          {!isOpen && (
            <Ionicons name="md-cart" size={25} color={theme.palette.dark} />
          )}
          {isOpen && (
            <Ionicons name="md-close" size={25} color={theme.palette.dark} />
          )}
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityText}>
              {lista.reduce((a, v) => { return a + v.qtd }, 0)}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
  fabContainer: {
    height: 70,
    width: 70,
    backgroundColor: theme.palette.secondary,
    // color: theme.palette.dark,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    zIndex: 9999,
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: 16,
    elevation: 4
  },
  quantityContainer: {
    height: 25,
    maxWidth: 40,
    padding: 4,
    backgroundColor: theme.palette.primary,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  quantityText: {
    color: '#fff'
  },
  miniFabContainer: {
    width: 70,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    zIndex: 9999,
    position: 'absolute',
    bottom: 86,
    right: 0,
    margin: 16,
  },
  miniFab: {
    height: 60,
    width: 60,
    backgroundColor: theme.palette.secondary,
    // color: theme.palette.dark,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    zIndex: 9999,
    marginBottom: 16,
    elevation: 4
  },
  miniFabImage: {
    height: 60,
    width: 60,
     borderRadius: 100 
  },
  fabBackdrop: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.dark,
    opacity: 0.5,
    zIndex: 999,
    position: 'absolute'
  }
})

export default CartFab