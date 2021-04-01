import React, {
  useState, useCallback, useEffect, useContext,
} from 'react';
import { TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// components
import { useNavigation } from '@react-navigation/native';
import theme from '../theme';
import Navbar from '../components/Navbar';
import ScreenContainer from '../components/ScreenContainer';
import Typography from '../components/Typography';
import CouponItem from '../components/CouponItem';
// services
import { getCoupons } from '../services/coupons';
import { CheckoutContext } from '../contexts/CheckoutContext';

const Coupons = ({ navigation }) => {
  const navigate = useNavigation();
  const [couponsLoader, setCouponsLoader] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const { checkoutState, checkoutDispatch } = useContext(CheckoutContext);

  const loadCoupons = useCallback(async () => {
    setCouponsLoader(true);

    const couponsResponse = await getCoupons();
    setCoupons(couponsResponse);

    setCouponsLoader(false);
  }, [setCouponsLoader, setCoupons, getCoupons]);

  useEffect(() => {
    loadCoupons();
  }, [loadCoupons]);

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

      <ScreenContainer>
        {coupons.length > 0 && !couponsLoader
          && coupons.map((coupon) => (
            <TouchableOpacity onPress={() => selecionaCupom(coupon)}>
              <CouponItem
                key={coupon.IdCupom}
                coupon={coupon}
              />
            </TouchableOpacity>
          ))}
      </ScreenContainer>
    </>
  );
};

export default Coupons;
