import React, {
  useState, useCallback, useContext,
} from 'react';
import { TouchableOpacity, StatusBar, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// components
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import theme from '../theme';
import Navbar from '../components/Navbar';
import Typography from '../components/Typography';
import CouponItem from '../components/CouponItem';
import Loader from '../components/Loader';
// services
import api from '../services/axios';
import { CheckoutContext } from '../contexts/CheckoutContext';
import { AppContext } from '../contexts/AppContext';

const Coupons = ({ navigation }) => {
  const navigate = useNavigation();
  const [couponsLoader, setCouponsLoader] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const { checkoutState, checkoutDispatch } = useContext(CheckoutContext);
  const { state } = useContext(AppContext);

  const loadCoupons = useCallback(async () => {
    setCouponsLoader(true);

    const couponsResponse = await api(`CuponsCliente/${state?.sessao?.IdCliente}`);
    setCoupons(couponsResponse.data);

    setCouponsLoader(false);
  }, []);

  useFocusEffect(useCallback(() => {
    loadCoupons();
  }, [loadCoupons]));

  async function selecionaCupom(cupom) {
    const action = { type: 'setCupom', payload: { cupom } };
    checkoutDispatch(action);

    navigation.pop();
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
            Cupons
          </Typography>
        )}
      />
      <Loader show={couponsLoader} />
      {!couponsLoader && (
      <FlatList
        contentContainerStyle={{ margin: 16 }}
        data={coupons}
        keyExtractor={(item) => `${item.IdCupom}`}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => selecionaCupom(item)}>
            <CouponItem
              coupon={item}
            />
          </TouchableOpacity>
        )}
      />
      )}
    </>
  );
};

export default Coupons;
