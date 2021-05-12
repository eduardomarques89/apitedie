import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet, View, TouchableOpacity, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/Button';
// components
import Navbar from '../../components/Navbar';
import ScreenContainer from '../../components/ScreenContainer';
import ContentContainer from '../../components/ContentContainer';
import Typography from '../../components/Typography';
import Divider from '../../components/Divider';
import api from '../../services/axios';
import { CartContext } from '../../contexts/CartContext';
// theme
import theme from '../../theme';

const Order = ({ navigation, route }) => {
  const navigate = useNavigation();
  const [order, setOrder] = useState({});
  const { order: orderParam } = route.params;
  const { cartDispatch } = useContext(CartContext);

  useEffect(() => {
    async function fetchData() {
      const response = await api.get(`PedidosItem/Item/${orderParam.NumeroPedido}`);
      const data = new Date(orderParam.Data);
      setOrder({
        ...orderParam,
        orders: response.data,
        Data: `${data.getDate() || '00'}-${(data.getMonth() + 1) || '00'}-${data.getFullYear() || '00'}`,
        valorByProducts: orderParam.Valor - orderParam.Taxa,
      });
    }
    fetchData();
  }, [orderParam]);

  async function repeatOrder() {
    const products = order.itens.map((product) => ({
      product: {
        Id: product.IdProduto,
        nome: product.NomeItem,
        Desconto: product.Desconto,
        Status: product.Status,
        Observacao: product.Observacao,
        Preco_Por: product.Valor_unit,
        Preco_De: product.Valor_unit,
        IdEmpresa: order.IdEmpresa,
      },
      quantity: product.Quantidade,
    }
    ));
    try {
      const { data } = await api.get(`Empresas/${order.IdEmpresa}`);
      cartDispatch({
        type: 'Add_MARKET',
        payload: {
          market: data,
        },
      });
      cartDispatch({
        type: 'ADD_MORE_PRODUCTS',
        payload: {
          products,
        },
      });
      navigate.navigate('Checkout');
    } catch (e) {
      console.log(e);
      alert('error');
    }
  }

  return (
    <>

      <StatusBar backgroundColor={theme.palette.primary} />
      <Navbar
        left={(
          <TouchableOpacity
            hitSlop={theme.hitSlop}
            onPress={() => {
              if (navigate.canGoBack()) {
                navigate.goBack();
              }
            }}
          >
            <Ionicons name="md-arrow-back" size={25} color="#fff" />
          </TouchableOpacity>
        )}
        title={(
          <Typography size="small" color="#fff">
            Detalhes do pedido
          </Typography>
        )}
      />

      <ScreenContainer>
        <ContentContainer>
          <View style={styles.lineContainer}>
            <View style={styles.orderMarketIcon} />
            <View style={styles.columnContainer}>
              <Typography size="medium" color={theme.palette.dark}>
                Big Bom
              </Typography>
              <Typography size="caption" color={theme.palette.light}>
                Realizado em -
                {' '}
                {`${order?.Data || '00-00-00'}`}
              </Typography>
            </View>
          </View>

          <Divider />

          {
(order?.itens?.length > 0) && order.itens.map((order, index) => (
  <View key={index} style={styles.lineSpaceContainerMargin}>
    <View style={styles.columnContainer}>
      <Typography size="small" color={theme.palette.dark}>
        {`Produto ${index + 1}`}
      </Typography>
      <Typography size="caption" color={theme.palette.light}>
        {order.Quantidade}
        x un.
      </Typography>
    </View>

    <Typography size="small" color={theme.palette.dark}>
      {`R$ ${(order?.Valor || 0).toFixed(2).replace('.', ',')}`}
    </Typography>
  </View>

))

  }
          <TouchableOpacity onPress={repeatOrder}>
            <Typography size="small" color={theme.palette.primary}>
              Refazer Pedido!
            </Typography>
          </TouchableOpacity>

          <Divider />

          <Typography size="medium" color={theme.palette.dark}>
            Pedido #
            {order.NumeroPedido}
          </Typography>

          <Divider />

          <View style={styles.lineSpaceContainer}>
            <Typography size="small" color={theme.palette.light}>
              Total em produtos
            </Typography>
            <Typography size="small" color={theme.palette.light}>

              {`R$ ${((order?.valorByProducts || 0)).toFixed(2).replace('.', ',')}`}
            </Typography>
          </View>

          <View style={styles.lineSpaceContainer}>
            <Typography size="small" color={theme.palette.light}>
              Entrega
            </Typography>
            <Typography size="small" color={theme.palette.success}>

              {`R$ ${((order?.Taxa || 0)).toFixed(2).replace('.', ',')}`}
            </Typography>
          </View>

          {/* {order.review && (
          <TouchableOpacity onPress={() => navigation.navigate('Avaliar', { review: order.review })}>
            <Box direction="row" justify="space-between" alignItems="center" noMargin>
              <Box direction="column" justify="center" alignItems="flex-start" noMargin>
                <Typography size="small" color={theme.palette.dark}>
                  Sua Avaliação
                </Typography>
                <Box direction="row" justify="center" alignItems="center" noMargin>
                  <Typography size="small" color={theme.palette.secondary}>
                    {order.review.nota.toFixed(1)}
                  </Typography>
                  <Ionicons name="md-star" size={20} color={theme.palette.secondary} />
                </Box>
              </Box>

              <Typography size="small" color={theme.palette.primary}>
                ver
              </Typography>
            </Box>
          </TouchableOpacity>
          )} */}

          {!order.review && (
          <Button
            background={theme.palette.primary}
            color="#fff"
            width="100%"
            text="Avaliar Pedido"
            onPress={() => navigation.navigate('Rating', { order })}
          />
          )}
          <Divider />

          {/*

          <View style={styles.lineContainer}>
            <Ionicons name="ios-cart" size={25} color={theme.palette.success} />
            <Typography size="small" color={theme.palette.success}>
              {order.statusMessage}
            </Typography>
          </View>

          {order.status === 'finished' && (
           */}

          {/* <View style={styles.lineSpaceContainer}>
            <View style={styles.columnContainer}>
              <Typography size="small" color={theme.palette.light}>
                Cupom
              </Typography>
              <Typography size="caption" color={theme.palette.light}>
                Fim de semana
              </Typography>
            </View>
            <Typography size="small" color={theme.palette.success}>
              - R$ 12,00
            </Typography>
          </View> */}

          <View style={styles.lineSpaceContainer}>
            <Typography size="medium" color={theme.palette.dark}>
              Total
            </Typography>
            <Typography size="medium" color={theme.palette.dark}>

              {`R$ ${((order?.Valor || 0)).toFixed(2).replace('.', ',')}`}
            </Typography>
          </View>

          {/* <Divider />

          <View style={styles.lineSpaceContainer}>
            <View style={styles.columnContainer}>
              <Typography size="small" color={theme.palette.dark}>
                Pago no TEDIE
              </Typography>
              <Typography size="caption" color={theme.palette.light}>
                Crédito VISA
              </Typography>
            </View>
            <Typography size="small" color={theme.palette.dark}>
              **** 1234
            </Typography>
          </View> */}

          <Divider />

          {order?.Endereco ? (
            <View style={styles.columnContainer}>
              <Typography size="caption" color={theme.palette.light}>
                Entregue em
              </Typography>
              {(order?.Endereco || 'rua,bairro').split(',').map((value) => (
                <Typography size="small" color={theme.palette.dark}>
                  {`${value}`}
                </Typography>
              ))}
            </View>
          ) : (
            <>
            </>
          )}

        </ContentContainer>
      </ScreenContainer>
    </>
  );
};

const styles = StyleSheet.create({
  lineContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  lineSpaceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lineSpaceContainerMargin: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  columnContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  orderMarketIcon: {
    width: 40,
    height: 40,
    backgroundColor: theme.palette.secondary,
    borderRadius: 100,
  },
});

export default Order;
