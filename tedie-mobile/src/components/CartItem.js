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

const CartItem = ({ cartItem, valorCalculado, handleDeleteItem }) => {
  const { cartState, cartDispatch } = useContext(CartContext);
  const { state, dispatch } = useContext(AppContext);

  function handleValueDropdown(value) {
    if (value === 0) {
      handleDeleteItem();
    }
  }

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
            {/* {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorCalculado)} */}
            R$
            {' '}
            {Number.parseFloat(valorCalculado()).toFixed(2).replace('.', ',')}
          </Typography>
        </View>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            hitSlop={theme.hitSlop}
            onPress={() => dispatch({ type: 'deleteQuantyItem', id: cartItem.product.Id })}
          >
            <Ionicons name="md-remove" size={25} color={theme.palette.primary} />
          </TouchableOpacity>

          <Text style={styles.quantity}>{cartItem.quantity}</Text>

          <TouchableOpacity
            hitSlop={theme.hitSlop}
            onPress={() => dispatch({ type: 'addQuantyItem', id: cartItem.product.Id })}
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
