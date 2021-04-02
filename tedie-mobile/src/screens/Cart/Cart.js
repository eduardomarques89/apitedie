import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet, View, ScrollView, Text, FlatList, StatusBar,
} from 'react-native';
// components
import { TouchableOpacity } from 'react-native-gesture-handler';
import MainNavbar from '../../components/MainNavbar';
import ScreenContainer from '../../components/ScreenContainer';
import Typography from '../../components/Typography';
import CartItem from '../../components/CartItem';
import Button from '../../components/Button';
import Box from '../../components/Box';
import Avatar from '../../components/Avatar';
// theme
import theme from '../../theme';
import { AppContext } from '../../contexts/AppContext';
import { CartContext } from '../../contexts/CartContext';
import { getProductsAtacadoByCEP } from '../../services/products';

const Cart = ({ navigation }) => {
  const { cartState, cartDispatch } = useContext(CartContext);
  const { state, dispatch } = useContext(AppContext);
  const [cart, setCart] = useState([]);

  const [produtosAtacado, setProdutosAtacado] = useState([]);

  function getSelectedMarkets() {
    // return state.carrinho
    //   .filter((c, i, v) => v.findIndex((f) => f.product.IdEmpresa == c.product.IdEmpresa) == i)
    //   .map((c) => c.product.IdEmpresa);
  }

  async function carregaCarrinho() {
    // const selectedMarkets = getSelectedMarkets();
    // getMarketsListByIds(selectedMarkets)
    //   .then((markets) => {
    //     const action = { type: 'setMarkets', payload: { markets } };
    //     cartDispatch(action);
    //   });
  }

  function deleteItem(IdEmpresa) {
    const productDelete = state.carrinho.find(({ product }) => product.id === IdEmpresa);
    console.log(productDelete);
    // state.carrinho[0]
    // .filter(market => market.product.IdEmpresa == (cartState.selected ? cartState.selected : cartState.markets[0].IdEmpresa))
  }

  async function calculaTotalCompraPorEstabelecimento() {
    const selectedMarkets = getSelectedMarkets();
    const est = [];
    let valParc;
    selectedMarkets.forEach((s) => {
      valParc = state.carrinho.filter((c) => c.product.IdEmpresa == s).reduce((acc, v) => acc + calculaValorItem(v.product.Id, v.quantity), 0);
      est[`"${s}"`] = valParc;
    });
    const action = { type: 'setTotalComprasPorEstabelecimento', payload: { totalComprasPorEstabelecimento: est } };
    cartDispatch(action);
  }

  async function calculaTotalCompras() {
    const valorCompra = state.carrinho.reduce((acc, v) => acc + calculaValorItem(v.product.Id, v.quantity), 0);
    const action = { type: 'setTotalCompras', payload: { totalCompras: valorCompra } };
    cartDispatch(action);
  }

  async function loadProdutosAtacado() {
    if (!produtosAtacado || produtosAtacado.length == 0) {
      const pa = await getProductsAtacadoByCEP('13870410');
      // const pa = await getProductsAtacadoByCEP(state.address.CEP)
      setProdutosAtacado(pa);
    }
  }

  useEffect(() => {
    if (!produtosAtacado || produtosAtacado.length == 0) {
      return;
    }
    carregaCarrinho();
    calculaTotalCompras();
    calculaTotalCompraPorEstabelecimento();
  }, [state.carrinho, produtosAtacado]);

  useEffect(() => {
    loadProdutosAtacado();
  }, []);

  useEffect(() => {
    if (!cartState.selected && cartState.markets.length > 0) {
      const newCart = state.carrinho.filter((product) => product.product.IdEmpresa === cartState.markets[0].IdEmpresa);
      setCart(cartState.markets[0]);
    } else {
      const newCart = state.carrinho.filter((product) => product.product.IdEmpresa === cartState.selected);
      setCart(newCart);
    }
  }, [state.carrinho, cartState.selected]);

  async function handleSelectMarket(market) {
    const action = { type: 'select', payload: { IdEmpresa: market.IdEmpresa, Nome: market.Nome } };
    cartDispatch(action);
  }

  function calculaValorItem(idProduto, quantity) {
    let valor = 0;
    if (produtosAtacado.length == 0) return;
    let pAtacado = produtosAtacado
      .filter((p) => p.Id == idProduto)
      .filter((p) => p.Qtde_Inicial <= quantity && p.Qtde_Final >= quantity)[0];
    if (!pAtacado) {
      const pMaior = produtosAtacado.reduce((acc, v) => {
        if (v.Qtde_Final > acc.Qtde_Final) return v;
        return acc;
      });
      if (quantity >= pMaior.Qtde_Final) { pAtacado = pMaior; } else {
        const pMenor = produtosAtacado.reduce((acc, v) => {
          if (v.Qtde_Inicial <= acc.Qtde_Inicial) return v;
          return acc;
        });
        pAtacado = pMenor;
      }
    }
    valor = quantity * pAtacado.Preco_De;
    return valor;
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
            keyExtractor={(item) => `${item.IdEmpresa}`}
            horizontal
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ borderRadius: 100, overflow: 'hidden' }}
                onPress={() => handleSelectMarket(item)}
              >
                <Avatar
                  image={item.Logo}
                  styles={styles.cartImage}
                  size={60}
                  color={theme.palette.secondary}
                  selected={(cartState.selected ? cartState.selected : cartState.markets[0].IdEmpresa) == item.IdEmpresa}
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
              handleDeleteItem={() => dispatch({ type: 'deleteItem', id: item.product.Id })}
              cartItem={item}
              valorCalculado={() => calculaValorItem(item.product.Id, item.quantity)}
            />
          )}
        />
        {/* </View> */}
        <View style={styles.bottomContainer}>
          <Typography size="small" color="#000">
            {/* Total soma  {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
            .format(cartState.totalCompras)} */}
            Total R$
            {' '}
            {Number.parseFloat(cartState.totalCompras).toFixed(2).replace('.', ',')}
          </Typography>
          <TouchableOpacity
            style={{ marginRight: 32 }}
            onPress={() => {
              if (state.carrinho.length > 0) {
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
          {/* <Button
            background={theme.palette.secondary}
            color={theme.palette.primary}
            width="50%"
            text="Checkout"
            onPress={() => {
              if (state.carrinho.length > 0) {
                navigation.navigate('Checkout');
              }
            }}
          /> */}
        </View>
      </View>

    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    // paddingBottom: 96
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
    // marginBottom:50,
    backgroundColor: '#fff',
    // position: 'absolute',
    // bottom: 0
  },

  cartsContainer: {
    paddingTop: 8,
    marginBottom: 16,
    // paddingBottom:32
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
