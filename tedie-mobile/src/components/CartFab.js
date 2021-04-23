import React, {
  useState, useRef, useContext, useEffect, useCallback,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Image,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// components
import { useNavigation } from '@react-navigation/native';
import theme from '../theme';
import { CartContext } from '../contexts/CartContext';

const CartFab = () => {
  const { cartState, cartDispatch } = useContext(CartContext);
  const [markets, setMarkets] = useState([]);
  const [isOpen, setOpen] = useState(false);
  const openFabAnimation = useRef(new Animated.Value(0)).current;
  const navigate = useNavigation();

  async function handleSelectMarket(market) {
    const action = { type: 'select', payload: market };
    cartDispatch(action);
    navigate.navigate('Carrinho');
  }
  useEffect(() => {
    setMarkets(cartState.markets);
  }, [cartState.markets]);

  const openFab = () => {
    Animated.timing(openFabAnimation, {
      toValue: 1,
      duration: 250,
      useNativeDriver: 'true',
    }).start();
  };

  const closeFab = () => {
    Animated.timing(openFabAnimation, {
      toValue: 0,
      duration: 250,
      useNativeDriver: 'true',
    }).start();
  };

  const handleOpenFab = () => {
    setOpen(!isOpen);
    isOpen ? closeFab() : openFab();
  };

  return (
    <>

      <View style={styles.miniFabContainer}>
        {markets.map((obj) => (
          <TouchableWithoutFeedback key={obj.market.IdEmpresa} onPress={() => handleSelectMarket(obj)}>

            <Animated.View
              style={[
                styles.miniFab,
                {
                  transform: [
                    { scaleX: openFabAnimation },
                    { scaleY: openFabAnimation },
                  ],
                },
              ]}
            >
              <Animated.Image
                style={[
                  styles.miniFabImage,
                  {
                    transform: [
                      { scaleX: 1 },
                      { scaleY: 1 },
                    ],
                  },
                ]}
                source={{
                  uri: `${obj.market.Logo}`,
                }}
                resizeMode="contain"
              />
              <View style={styles.quantityContainer}>
                <Text style={styles.quantityText}>{obj.quantity}</Text>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        ))}
      </View>

      <TouchableWithoutFeedback onPress={() => handleOpenFab()}>
        <View style={styles.fabContainer}>
          {!isOpen && (
            <Ionicons name="md-cart" size={25} color={theme.palette.dark} />
          )}
          {isOpen && (
            <Ionicons name="md-close" size={25} color={theme.palette.dark} />
          )}
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityText}>
              {markets.reduce((marketPrev, marketCurrent) => marketPrev + marketCurrent.quantity,
                0)}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
};

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
    elevation: 4,
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
    color: '#fff',
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
    elevation: 4,
  },
  miniFabImage: {
    height: 60,
    width: 60,
    borderRadius: 100,
  },
  fabBackdrop: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.dark,
    opacity: 0.5,
    zIndex: 999,
    position: 'absolute',
  },
});

export default CartFab;
