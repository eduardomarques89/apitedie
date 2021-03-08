import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
// components
import ContentContainer from './ContentContainer'
import Typography from './Typography'
// theme
import theme from '../theme'
import { AppContext } from '../contexts/AppContext'
import { useQuantity } from '../hooks/useQuantity'
import { CartContext } from '../contexts/CartContext'
import { getMarketsListByIds } from '../services/market'

const ProductItem = ({ product, skeleton }) => {
  const { state, dispatch } = useContext(AppContext);
  const { cartState, cartDispatch } = useContext(CartContext);
  const { quantity } = useQuantity(product)

  const handleRemove = (quantity) => {
    if (quantity - 1 < 0) return
    const payload = { product: product, quantity: (quantity - 1) }
    let action = { type: 'createCarrinho', payload: payload }
    dispatch(action)

    action = { type: "setTotalCompras", payload: { totalCompras: 0 } }
    cartDispatch(action)

    action = { type: "setSomaParcial", payload: { somaParcial: [] } }
    cartDispatch(action)

    carregaCarrinho() 

    action = { type: "setTotalComprasPorEstabelecimento", payload: { totalComprasPorEstabelecimento: [] } }
    cartDispatch(action)

    if (quantity - 1 == 0) {
      action = { type: "select", payload: { selected: undefined, selectedNome: undefined } }
      cartDispatch(action)
    }
  }

  const handleAdd = (quantity) => {
    const payload = { product: product, quantity: (quantity + 1) }
    let action = { type: 'createCarrinho', payload: payload }
    dispatch(action)

    action = { type: "setTotalCompras", payload: { totalCompras: 0 } }
    cartDispatch(action)

    action = { type: "setSomaParcial", payload: { somaParcial: [] } }
    cartDispatch(action)

    carregaCarrinho() 

    action = { type: "setTotalComprasPorEstabelecimento", payload: { totalComprasPorEstabelecimento: [] } }
    cartDispatch(action)
  }

  function getSelectedMarkets() {
    return state.carrinho
      .filter((c, i, v) => v.findIndex((f) => f.product.IdEmpresa == c.product.IdEmpresa) == i)
      .map(c => c.product.IdEmpresa)
  }

  async function carregaCarrinho() {
    const selectedMarkets = getSelectedMarkets()
    getMarketsListByIds(selectedMarkets)
      .then(markets => {
        const action = { type: "setMarkets", payload: { markets: markets } }
        cartDispatch(action);
      })
  }

  return (
    <View style={styles.container}>
      <ContentContainer>
        {product.hasOffer && (
          <View style={styles.offerContainer}>
            <Typography size="small" color="#fff">
              {product.off}
            </Typography>
          </View>
        )}

        {!product.imagem && (
          <View style={styles.image} />
        )}

        {product.imagem && (
          <Image
            style={styles.image}
            resizeMode="contain"
            source={{
              uri: product.imagem,
            }}
          />
        )}

        <View style={styles.quantityContainer}>
          <TouchableOpacity
            hitSlop={theme.hitSlop}
            onPress={(e) => { e.preventDefault(); handleRemove(quantity) }}
          >
            <Ionicons name="md-remove" size={25} color={theme.palette.primary} />
          </TouchableOpacity>

          <Text style={styles.quantity}>{quantity}</Text>

          <TouchableOpacity
            hitSlop={theme.hitSlop}
            onPress={(e) => { e.preventDefault(); handleAdd(quantity) }}
          >
            <Ionicons name="md-add" size={25} color={theme.palette.primary} />
          </TouchableOpacity>
        </View>
      </ContentContainer>

      <View style={styles.textContainer}>
        <Typography size="small" color="#000" wrap>
          {product.Nome}
        </Typography>
      </View>

      {/* <Typography size="small" color="#000">
        big bom
      </Typography> */}

      <Typography size="small" color="#000">
        R$ {(product.Preco_Por ? product.Preco_Por : product.Preco_De ?? 0).toFixed(2).toString().replace('.', ',')}
      </Typography>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 200,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16
  },

  image: {
    width: 100,
    height: 100
  },

  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.secondary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    position: 'absolute',
    bottom: 0,
    right: -16,
    elevation: 2
  },

  quantity: {
    paddingHorizontal: 8
  },

  offerContainer: {
    padding: 4,
    backgroundColor: theme.palette.primary,
    borderRadius: 100,
    position: 'absolute',
    top: 0,
    left: -16,
    elevation: 2,
    zIndex: 5
  },

  textContainer: {
    width: 120,
    alignSelf: 'center'
  }
})

export default ProductItem
