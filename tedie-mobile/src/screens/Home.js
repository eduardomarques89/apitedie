import React, {
  useEffect, useState, useCallback, useRef, useContext,
} from 'react';
import {
  StyleSheet, View, StatusBar, ScrollView, SafeAreaView, FlatList, TouchableWithoutFeedback, Image, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// components
import Swiper from 'react-native-swiper';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-community/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import ScreenContainer from '../components/ScreenContainer';
import ContentContainer from '../components/ContentContainer';
import MainNavbar from '../components/MainNavbar';
import Typography from '../components/Typography';
import ProductItem from '../components/ProductItem';
import MarketItem from '../components/MarketItem';
import Pill from '../components/Pill';
// theme
import theme from '../theme';
import CartFab from '../components/CartFab';
// services
import { getMarketsByLocation } from '../services/market';
import { getProductsByCEP } from '../services/products';
import { getLocationByLatLong } from '../services/locations';
import { AppContext } from '../contexts/AppContext';
import api from '../services/axios';
import cartActions from '../store';

const Home = ({ navigation }) => {
  const { state, dispatch } = useContext(AppContext);
  const [deliveryType, setDeliveryType] = useState('all');
  const [loadingMarkets, setLoadingMarkets] = useState(false);
  const [markets, setMarkets] = useState([]);
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const toastRef = useRef();
  const cart = useSelector((state) => state.cart);

  const loadMarkets = async () => {
    setLoadingMarkets(true);
    const response = await getMarketsByLocation(state.address);
    setMarkets(response);
    setLoadingMarkets(false);
  };

  const loadProducts = async () => {
    const local = state.address;
    // carrega produtos com localizacao do localstorage
    if (local.CEP != undefined && local.CEP != '') {
      const response = await getProductsByCEP(local.CEP.replace('-', ''));
      setProducts(response);
    } else {
      try {
        const cep = local.results[0]?.address_components.filter((ac) => ac.types.filter((ty) => ty == 'postal_code')?.length > 0)[0]?.short_name ?? '';
        const response = await getProductsByCEP(cep.replace('-', ''));
        setProducts(response);
      } catch (e) {
        console.log(e);
        debugger;
      }
    }
  };

  async function askLocalizationPermission() {
    if (await AsyncStorage.getItem('Localization')) return;
    (async () => {
      const { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        toastRef.current?.show('Permissão para acessar localização foi negada', 3000);
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const local = await getLocationByLatLong(location.coords.latitude, location.coords.longitude);
      await AsyncStorage.setItem('Localization', JSON.stringify(local));

      const action = { type: 'createAddress', payload: local };
      dispatch(action);
    })();
  }

  async function loadAll() {
    if (state.address) {
      loadMarkets();
      loadProducts();
      const banners = await api.get('banner');
      const bannersFilter = banners.data.filter((value) => value.Destaque === 'S');
      setBanners(bannersFilter);
    } else {
      askLocalizationPermission();
    }
  }

  useEffect(() => {
    loadAll();
  }, [state.address]);

  return (
    <View style={styles.container}>

      <StatusBar backgroundColor={theme.palette.primary} />
      <MainNavbar navigation={navigation} />

      <CartFab />

      <ScreenContainer>
        <ContentContainer>
          <TouchableWithoutFeedback onPress={() => navigation.navigate('Localização')}>
            <View style={styles.locationContainer}>
              <Ionicons name="md-locate" size={25} color={theme.palette.primary} />

              <View style={styles.locationInfo}>
                <Typography size="small" color="#000">
                  {state.address
                    ? (state.address?.results ? state.address.results[0].formatted_address : state.address.Beautify)
                    : ''}
                </Typography>
              </View>

              <Ionicons name="ios-arrow-forward" size={25} color={theme.palette.primary} />
            </View>
          </TouchableWithoutFeedback>
        </ContentContainer>

        <Swiper style={styles.swiper}>
          {
            banners.map((banner) => (
              <TouchableOpacity
                key={banner.IdBanner}
                onPress={() => {
                  const market = markets.find((market) => market.IdEmpresa === banner.IdEmpresa);

                  dispatch({ type: 'addMarketSelect', market });
                  navigation.navigate('Mercado', { market });
                }}
              >
                <Image source={{ uri: banner.Imagem }} style={styles.banner} />
              </TouchableOpacity>
            ))
          }
        </Swiper>

        <Typography size="medium" color="#000">
          Destaques
        </Typography>

        <ScrollView
          contentContainerStyle={styles.horizontalList}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {products.filter((p) => p.hasOffer).map((p, index) => (
            <TouchableOpacity key={p.Id} onPress={() => navigation.navigate('Produto', { product: p, empresaId: p.IdEmpresa })}>
              <ProductItem
                product={p}
                key={index}
              />

            </TouchableOpacity>
          ))}
        </ScrollView>

        <Typography size="medium" color="#000">
          Perto de você
        </Typography>

        <ScrollView
          contentContainerStyle={styles.horizontalList}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <Pill
            selected={deliveryType === 'all'}
            title="Todos"
            onPress={() => setDeliveryType('all')}
          />

          <Pill
            selected={deliveryType === 'delivery'}
            title="Entrega"
            onPress={() => setDeliveryType('delivery')}
          />

          <Pill
            selected={deliveryType === 'pickup'}
            title="Retirada"
            onPress={() => setDeliveryType('pickup')}
          />
        </ScrollView>

        {
          loadingMarkets && (
            <>
              <MarketItem skeleton />
              <MarketItem skeleton />
              <MarketItem skeleton />
            </>
          )
        }
        {
          !loadingMarkets && markets.length > 0
          && (
          <FlatList
            data={markets}
            keyExtractor={(item) => `${item.IdEmpresa}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  dispatch({ type: 'addMarketSelect', market: item });
                  navigation.navigate('Mercado', { market: item });
                }}
                key={item.IdEmpresa}
              >
                <MarketItem market={item} />
              </TouchableOpacity>
            )}
          />
          )
        }
      </ScreenContainer>

      {/* </ScreenContainer> */}

    </View>
  );
};

const styles = StyleSheet.create({
  navbarButton: {
    marginHorizontal: 8,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationInfo: {
    maxWidth: 200,
    marginHorizontal: 16,
  },

  horizontalList: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 16,
  },
  swiper: {
    marginBottom: 16,

    height: 120,
  },
  banner: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
});

export default Home;
