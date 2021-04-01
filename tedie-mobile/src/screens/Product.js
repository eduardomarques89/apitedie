import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet, View, TouchableOpacity, Text, ScrollView, Image, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// components
import ScreenContainer from '../components/ScreenContainer';
import Typography from '../components/Typography';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import ProductItem from '../components/ProductItem';
import api from '../services/axios';
import { AppContext } from '../contexts/AppContext';
import { CartContext } from '../contexts/CartContext';
// theme
import theme from '../theme';
import Avatar from '../components/Avatar';

const Product = ({ navigation, route }) => {
  const { state, dispatch } = useContext(AppContext);
  const { cartState, cartDispatch } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);
  const [productValue, setProductValue] = useState(0);
  const [productTotal, setProductTotal] = useState(0);
  const [empresa, setEmpresa] = useState({});

  const { product, empresaId } = route.params;

  useEffect(() => {
    // console.log(empresaName)

    async function fetch() {
      const empresa = await api.get(`Empresas/${empresaId}`);
      setEmpresa(empresa.data);
    }

    if (product.Preco_De > 0) {
      setProductValue(product.Preco_De);
    } else {
      setProductValue(product.Preco_Por);
    }
    fetch();
  }, []);

  useEffect(() => {
    const total = productValue * quantity;
    setProductTotal(total);
  }, [quantity]);

  const handleRemove = (quantity) => {
    if (quantity > 1) { setQuantity(quantity - 1); }
  };

  const handleAdd = (quantity) => {
    setQuantity(quantity + 1);
  };

  async function addProduct() {
    const payload = { product, quantity: (quantity + 1) };
    const action = { type: 'createCarrinho', payload };
    dispatch(action);
    // console.log('product');
    // console.log(product);
    if (!cartState.markets.find((market) => market.IdEmpresa === product.IdEmpresa)) {
      const { data } = await api.post(`api/Empresas/${product.IdEmpresa}`);
      const action = { type: 'setMarkets', payload: { markets: [...cartState.markets, data] } };
      cartDispatch(action);
    }
  }

  useEffect(() => {
    const products = state.carrinho.find((value) => value.product.Id === product.Id);
    setQuantity(products.quantity);
  }, []);

  return (
    <>

      <StatusBar backgroundColor={theme.palette.primary} />
      <Navbar
        left={(
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} hitSlop={theme.hitSlop} onPress={() => navigation.pop()}>
            <Ionicons name="md-arrow-back" size={30} color="#fff" style={{ marginRight: 8 }} />
            {
             empresa.Logo
            && <Avatar image={empresa.Logo} size={35} />
           }
            <Typography size="small" color="#fff">
              {empresa.Nome || 'Produto'}
            </Typography>
          </TouchableOpacity>
        )}

        right={(
          <>
            <TouchableOpacity
              style={styles.navbarButton}
              hitSlop={theme.hitSlop}
              onPress={() => navigation.navigate('Localizações2')}
            >
              <Ionicons name="md-pin" size={30} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navbarButton}
              hitSlop={theme.hitSlop}
              onPress={() => navigation.navigate('Produtos')}
            >
              <Ionicons name="md-search" size={30} color="#fff" />
            </TouchableOpacity>
          </>
        )}
      />

      <ScreenContainer>
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image
              resizeMode="center" //
              style={{ width: '100%', height: '100%' }}
              source={{
                uri: product.imagem,
              }}
            />
          </View>
          <Typography size="large" color="#000">
            {product.Nome}
          </Typography>

          <View style={styles.descriptionContainer}>
            <>
              {product.Descricao && (
                <Typography size="small" color="#000">
                  {product.Descricao}
                </Typography>
              )}
              {!product.Descricao && (
                <Typography size="small" color="#000">
                  Sem descrição disponível
                </Typography>
              )}
            </>
          </View>

          <View style={styles.priceContainer}>
            <Typography size="medium" color="#000">
              por R$
              {' '}
              {(productValue ?? 0)?.toFixed(2).toString().replace('.', ',')}
            </Typography>
          </View>
        </View>
      </ScreenContainer>

      <View style={styles.bottomContainer}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity hitSlop={theme.hitSlop} onPress={() => handleRemove(quantity)}>
            <Ionicons name="md-remove" size={30} color={theme.palette.primary} />
          </TouchableOpacity>

          <Text style={styles.quantity}>{quantity}</Text>

          <TouchableOpacity hitSlop={theme.hitSlop} onPress={() => handleAdd(quantity)}>
            <Ionicons name="md-add" size={30} color={theme.palette.primary} />
          </TouchableOpacity>
        </View>

        <Button
          background={theme.palette.secondary}
          color={theme.palette.primary}
          width="50%"
          text={`Adicionar R$${productTotal.toFixed(2).toString().replace('.', ',')}`}
          onPress={addProduct}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    paddingBottom: 104,
  },

  imageContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 16,
  },

  descriptionContainer: {
    width: '100%',
  },

  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 16,
  },

  bottomContainer: {
    width: '100%',
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
  },

  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: theme.palette.primary,
  },

  quantity: {
    paddingHorizontal: 16,
  },

  horizontalList: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  navbarButton: {
    marginHorizontal: 8,
  },
});

export default Product;
