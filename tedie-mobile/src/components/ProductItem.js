import React, {
  useContext, useEffect, useState, useCallback,
} from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// components
import { useFocusEffect } from '@react-navigation/native';
import ContentContainer from './ContentContainer';
import Typography from './Typography';
// theme
import theme from '../theme';
import { AppContext } from '../contexts/AppContext';
import { useQuantity } from '../hooks/useQuantity';
import { CartContext } from '../contexts/CartContext';
import api from '../services/axios';

const ProductItem = ({ product, skeleton }) => {
  const { state, dispatch } = useContext(AppContext);
  const { cartState, cartDispatch } = useContext(CartContext);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    if (product) {
      const existProduct = cartState.products.find((productState) => productState.product.Id === product.Id);
      if (existProduct) {
        setQuantity(existProduct.quantity);
      } else {
        setQuantity(0);
      }
    }
  }, [cartState.products]);

  async function carregaCarrinho(marketId) {
    try {
      const market = await api.get(`Empresas/${marketId}`);
      const action = { type: 'Add_MARKET', payload: { market: market.data } };
      cartDispatch(action);
    } catch {
    }
  }
  const handleRemove = (quantity) => {
    if (quantity - 1 < 0) return;
    const payload = { product, quantity: 1 };
    let action = { type: 'REMOVE_PRODUCT', payload };
    cartDispatch(action);
    setQuantity(quantity + 1);
    if (quantity - 1 == 0) {
      action = { type: 'select', payload: { selected: undefined, selectedNome: undefined } };
      cartDispatch(action);
    }
    if (quantity - 1 < 0) {
      setQuantity(0);
    } else {
      setQuantity(quantity - 1);
    }
  };

  const handleAdd = async (quantity) => {
    const existMarket = cartState.markets.find((market) => market.market.IdEmpresa === product.IdEmpresa);
    if (!existMarket) {
      await carregaCarrinho(product.IdEmpresa);
    }

    const payload = { product, quantity: 1 };
    const action = { type: 'ADD_PRODUCT', payload };
    cartDispatch(action);
    setQuantity(quantity + 1);
  };

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

        {!product.Imagem && (
          <View style={styles.image} />
        )}

        {product.Imagem && (
          <Image
            style={styles.image}
            resizeMode="contain"
            source={{
              uri: product.Imagem,
            }}
          />
        )}

        <View style={styles.quantityContainer}>
          <TouchableOpacity
            hitSlop={theme.hitSlop}
            onPress={(e) => { e.preventDefault(); handleRemove(quantity); }}
          >
            <Ionicons name="md-remove" size={25} color={theme.palette.primary} />
          </TouchableOpacity>

          <Text style={styles.quantity}>{quantity}</Text>

          <TouchableOpacity
            hitSlop={theme.hitSlop}
            onPress={(e) => { e.preventDefault(); handleAdd(quantity); }}
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
        R$
        {' '}
        {(product.Preco_Por ? product.Preco_Por : product.Preco_De ?? 0).toFixed(2).toString().replace('.', ',')}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: 200,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
  },

  image: {
    width: 100,
    height: 100,
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
    elevation: 2,
  },

  quantity: {
    paddingHorizontal: 8,
  },

  offerContainer: {
    padding: 4,
    backgroundColor: theme.palette.primary,
    borderRadius: 100,
    position: 'absolute',
    top: 0,
    left: -16,
    elevation: 2,
    zIndex: 5,
  },

  textContainer: {
    width: 120,
    alignSelf: 'center',
  },
});

export default ProductItem;
