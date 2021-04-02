import React, { useEffect, useState } from 'react';
import {
  StyleSheet, View, TouchableOpacity, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// components
import { useNavigation } from '@react-navigation/native';
import Navbar from '../../components/Navbar';
import ScreenContainer from '../../components/ScreenContainer';
import ContentContainer from '../../components/ContentContainer';
import Typography from '../../components/Typography';
import Divider from '../../components/Divider';
import Box from '../../components/Box';
import Button from '../../components/Button';
// theme
import theme from '../../theme';

const Order = ({ navigation, route }) => {
  const navigate = useNavigation();
  const [order, setOrder] = useState({});
  const { order: orderParam } = route.params;

  useEffect(() => {
    console.log(orderParam);
    setOrder({
      ...orderParam,
      Data: new Date(),
    });
  }, [orderParam]);

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
                {`${order?.Data?.getDate() || '00'}-${order?.Data?.getMonth() || '00'}-${order?.Data?.getFullYear() || '00'}`}
              </Typography>
            </View>
          </View>

          <Divider />

          {order.review && (
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
          )}

          {!order.review && (
          <Button
            background={theme.palette.primary}
            color="#fff"
            width="100%"
            text="Avaliar Pedido"
            onPress={() => navigation.navigate('Avaliar', { review: null })}
          />
          )}

          <Divider />

          <View style={styles.lineContainer}>
            <Ionicons name="ios-cart" size={25} color={theme.palette.success} />
            <Typography size="small" color={theme.palette.success}>
              {order.statusMessage}
            </Typography>
          </View>

          {order.status === 'finished' && (
          <TouchableOpacity>
            <Typography size="small" color={theme.palette.primary}>
              Refazer Pedido!
            </Typography>
          </TouchableOpacity>
          )}

          <Divider />

          <Typography size="medium" color={theme.palette.dark}>
            Pedido #0003
          </Typography>

          <View style={styles.lineSpaceContainerMargin}>
            <View style={styles.columnContainer}>
              <Typography size="small" color={theme.palette.dark}>
                Produto 01
              </Typography>
              <Typography size="caption" color={theme.palette.light}>
                1x un.
              </Typography>
            </View>

            <Typography size="small" color={theme.palette.dark}>
              {`R$ ${(order?.Valor || 0).toFixed(2).replace('.', ',')}`}
            </Typography>
          </View>

          <View style={styles.lineSpaceContainerMargin}>
            <View style={styles.columnContainer}>
              <Typography size="small" color={theme.palette.dark}>
                Produto 02
              </Typography>
              <Typography size="caption" color={theme.palette.light}>
                2x 300g.
              </Typography>
            </View>

            <Typography size="small" color={theme.palette.dark}>
              R$ 15,00
            </Typography>
          </View>

          <View style={styles.lineSpaceContainerMargin}>
            <View style={styles.columnContainer}>
              <Typography size="small" color={theme.palette.dark}>
                Produto 03
              </Typography>
              <Typography size="caption" color={theme.palette.light}>
                1x 1.5kg.
              </Typography>
            </View>

            <Typography size="small" color={theme.palette.dark}>
              R$ 15,00
            </Typography>
          </View>

          <View style={styles.lineSpaceContainerMargin}>
            <View style={styles.columnContainer}>
              <Typography size="small" color={theme.palette.dark}>
                Produto 04
              </Typography>
              <Typography size="caption" color={theme.palette.light}>
                4x un.
              </Typography>
            </View>

            <Typography size="small" color={theme.palette.dark}>
              R$ 15,00
            </Typography>
          </View>

          <Divider />

          <View style={styles.lineSpaceContainer}>
            <Typography size="small" color={theme.palette.light}>
              Total em produtos
            </Typography>
            <Typography size="small" color={theme.palette.light}>

              {`R$ ${((order?.Valor || 0) - (order?.Taxa || 0)).toFixed(2).replace('.', ',')}`}
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

          <View style={styles.lineSpaceContainer}>
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
          </View>

          <View style={styles.lineSpaceContainer}>
            <Typography size="medium" color={theme.palette.dark}>
              Total
            </Typography>
            <Typography size="medium" color={theme.palette.dark}>

              {`R$ ${((order?.Valor || 0)).toFixed(2).replace('.', ',')}`}
            </Typography>
          </View>

          <Divider />

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
          </View>

          <Divider />

          <View style={styles.columnContainer}>
            <Typography size="caption" color={theme.palette.light}>
              Entregue em
            </Typography>
            <Typography size="small" color={theme.palette.dark}>
              Rua Dr. Guilherme Redher, 274
            </Typography>
            <Typography size="small" color={theme.palette.light}>
              Vila N. S. de Fátima
            </Typography>
            <Typography size="small" color={theme.palette.light}>
              São João da Boa Vista - SP
            </Typography>
          </View>
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
