import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet, View, Image, TouchableOpacity, Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// components
import ModalDropdown from 'react-native-modal-dropdown';
import ContentContainer from './ContentContainer';
import Typography from './Typography';
import { CartContext } from '../contexts/CartContext';
import { AppContext } from '../contexts/AppContext';
// theme
import theme from '../theme';

const CartItem = ({ cartItem }) => {
  const { cartState, cartDispatch } = useContext(CartContext);
  const { state, dispatch } = useContext(AppContext);

  function handleValueDropdown() {
    const payload = { product: cartItem.product, quantity: cartItem.quantity };
    const action = { type: 'REMOVE_PRODUCT', payload };
    cartDispatch(action);
  }

  const handleRemove = () => {
    const payload = { product: cartItem.product, quantity: 1 };
    const action = { type: 'REMOVE_PRODUCT', payload };
    cartDispatch(action);
  };

  const handleAdd = async (quantity) => {
    const payload = { product: cartItem.product, quantity: 1 };
    const action = { type: 'ADD_PRODUCT', payload };
    cartDispatch(action);
  };

  return (
    <View style={styles.container}>
      <ContentContainer>
        {cartItem.product.Imagem && (
          <Image
            style={styles.image}
            resizeMode="contain"
            source={{
              uri: cartItem.product.Imagem,
            }}
          />
        )}
      </ContentContainer>

      <View style={styles.infoContainer}>
        <View style={styles.infoLine}>
          <Typography size="small" color="#000">
            {cartItem.product.Nome}
          </Typography>
          <ModalDropdown options={['Retirar item']} onSelect={(value) => handleValueDropdown(value)} dropdownStyle={{ height: 40 }}>
            <Ionicons name="md-more" size={30} color={theme.palette.primary} />
          </ModalDropdown>
        </View>

        <View style={styles.infoLine}>
          <Typography size="small" color="#000">
            Qtd.
          </Typography>
          <Typography size="small" color="#000">
            {cartItem.quantity}
          </Typography>
        </View>

        <View style={styles.infoLine}>
          <Typography size="small" color="#000">
            Total
          </Typography>
          <Typography size="small" color="#000">
            R$
            {' '}
            {Number.parseFloat(cartItem.quantity * cartItem.product.Preco_Por).toFixed(2).replace('.', ',')}
          </Typography>
        </View>
        <View style={styles.quantityContainer}>
          <TouchableOpacity

            hitSlop={theme.hitSlop}
            onPress={() => handleRemove(cartItem.quantity)}
          >
            <Ionicons name="md-remove" size={25} color={theme.palette.primary} />
          </TouchableOpacity>

          <Text style={styles.quantity}>{cartItem.quantity}</Text>

          <TouchableOpacity
            hitSlop={theme.hitSlop}
            onPress={() => handleAdd(cartItem)}
          >
            <Ionicons name="md-add" size={25} color={theme.palette.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },

  image: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },

  infoContainer: {
    width: '50%',
    // height: 130,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    paddingTop: 16,
    paddingLeft: 8,
  },

  infoLine: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.palette.secondary,
    borderRadius: 8,
    marginTop: 8,
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 16,
    // position: 'absolute',
    // bottom: 0,
    // right: -16,
    elevation: 2,
  },

  quantity: {
    paddingHorizontal: 8,
  },
});

export default CartItem;
