import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet, View, Text, FlatList, StatusBar,
} from 'react-native';
// components
import { TouchableOpacity } from 'react-native-gesture-handler';
import MainNavbar from '../../components/MainNavbar';
import Typography from '../../components/Typography';
import CartItem from '../../components/CartItem';
import Box from '../../components/Box';
import Avatar from '../../components/Avatar';
// theme
import theme from '../../theme';
import { CartContext } from '../../contexts/CartContext';

const Cart = ({ navigation }) => {
  const { cartState, cartDispatch } = useContext(CartContext);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (cartState?.selected?.market) {
      const existSelect = cartState.markets.find((market) => market.market.IdEmpresa === cartState?.selected?.market.IdEmpresa);
      if (!existSelect) {
        const action = { type: 'select', payload: {} };
        cartDispatch(action);
      }
    }
  }, [cartState.markets]);

  useEffect(() => {
    if (cartState?.selected?.market) {
      const newCart = cartState.products.filter((product) => product.product.IdEmpresa === cartState.selected.market.IdEmpresa);
      setCart(newCart);
    } else {
      setCart([]);
    }
  }, [cartState.selected, cartState.products]);

  async function handleSelectMarket(market) {
    const action = { type: 'select', payload: market };
    cartDispatch(action);
  }

  return (
    <>

      <StatusBar backgroundColor={theme.palette.primary} />
      <MainNavbar navigation={navigation} />
      <View style={styles.cartsContainer}>
        <Box direction="row" justify="flex-start" alignItems="center">
          <Typography size="medium" color={theme.palette.dark}>
            Meus Carrinhos
          </Typography>
        </Box>

        {cartState.markets?.length > 0 && (
          <FlatList
            style={{ marginLeft: 8 }}
            data={cartState.markets}
            keyExtractor={(item) => `${item.market.IdEmpresa}`}
            horizontal
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ borderRadius: 100, overflow: 'hidden' }}
                onPress={() => handleSelectMarket(item)}
              >
                <Avatar
                  image={item.market.Logo}
                  styles={styles.cartImage}
                  size={60}
                  color={theme.palette.secondary}
                  selected={(cartState.selected ? cartState.selected : cartState.markets[0].IdEmpresa) == item.market.IdEmpresa}
                />
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      <View style={styles.container}>
        <Typography size="medium" color="#000">
          {cartState.markets?.length > 0 && (cartState.selectedNome ? cartState.selectedNome : cartState.markets[0].Nome)}
        </Typography>

        <FlatList
          data={cart}

          keyExtractor={(item) => `${item.product.Id}`}
          renderItem={({ item }) => (
            <CartItem
              cartItem={item}
            />
          )}
        />
        <View style={styles.bottomContainer}>
          <Typography size="small" color="#000">
            Total R$
            {' '}
            {Number.parseFloat(cartState.total || 0).toFixed(2).replace('.', ',')}
          </Typography>
          <TouchableOpacity
            style={{ marginRight: 32 }}
            onPress={() => {
              if (cartState.products.length > 0) {
                navigation.navigate('Checkout');
              }
            }}
          >
            <View style={[styles.button, { backgroundColor: theme.palette.secondary, width: '100%' }]}>
              <Text style={{ color: theme.palette.primary }}>
                Finalizar

              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    marginVertical: 16,
    borderRadius: 8,
  },

  bottomContainer: {
    width: '100%',
    height: 90,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#fff',
  },

  cartsContainer: {
    paddingTop: 8,
    marginBottom: 16,
  },
  cartsList: {
    height: 65,
    flexDirection: 'row',
    paddingLeft: 16,
    marginVertical: 8,
  },
  cartImage: {
    marginRight: 8,
    borderRadius: 50,
    overflow: 'hidden',
  },
});

export default Cart;
