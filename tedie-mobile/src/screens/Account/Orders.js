import React, {
  useState, useCallback, useEffect, useContext,
} from 'react';
import { TouchableOpacity, StatusBar, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// components
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Navbar from '../../components/Navbar';
import ScreenContainer from '../../components/ScreenContainer';
import Typography from '../../components/Typography';
import OrderItem from '../../components/OrderItem';
import { AppContext } from '../../contexts/AppContext';
import Loader from '../../components/Loader';
// theme
import theme from '../../theme';
// services
import api from '../../services/axios';

const Orders = ({ navigation }) => {
  const { state } = useContext(AppContext);
  const navigate = useNavigation();
  const [ordersLoader, setOrderLoader] = useState(false);
  const [orders, setOrders] = useState([]);

  useFocusEffect(useCallback(() => {
    async function fetch() {
      setOrderLoader(true);
      if (!state?.sessao?.IdCliente) {
        setOrderLoader(false);
        return;
      }

      try {
        const { data } = await api.get(`Pedidos/Usuario/${state?.sessao?.IdCliente}`);
        setOrders(data);

        setOrderLoader(false);
      } catch (e) {
        console.log(e);
      }
    }
    fetch();
  }, []));

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
            Pedidos
          </Typography>
        )}
      />

      <Loader show={ordersLoader} />
      {!ordersLoader && orders.length > 0
          && (
          <ScreenContainer>
            <FlatList
              data={orders}
              keyExtractor={(item) => `${item.NumeroPedido}`}
              renderItem={({ item }) => (
                <OrderItem
                  order={item}
                  onPress={() => navigation.navigate('Pedido', { order: item })}
                />
              )}
            />
          </ScreenContainer>
          )}
    </>
  );
};

export default Orders;
