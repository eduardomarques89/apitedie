import React, {
  useEffect, useState, useCallback, useRef, useContext,
} from 'react';
import {
  StyleSheet, View, StatusBar, ScrollView, SafeAreaView, FlatList, TouchableWithoutFeedback, Image, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
// components
import Swiper from 'react-native-swiper';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

const Home = ({ navigation }) => {
  const { state, dispatch } = useContext(AppContext);
  const [deliveryType, setDeliveryType] = useState('all');
  const [loadingMarkets, setLoadingMarkets] = useState(false);
  const [markets, setMarkets] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsDestaque, setProductsDestaque] = useState([]);
  const [banners, setBanners] = useState([]);
  const toastRef = useRef();

  const loadMarkets = async () => {
    setLoadingMarkets(true);
    try {
      const response = await getMarketsByLocation(state.address);
      setMarkets(response);
    } catch {
      setMarkets([]);
    } finally {
      setLoadingMarkets(false);
    }
  };

  const loadProducts = async () => {
    const local = state.address;
    // carrega produtos com localizacao do localstorage
    if (local.CEP != undefined && local.CEP != '') {
      const response = await getProductsByCEP(local.CEP.replace('-', ''));
      setProducts(response);
      const productsDestaque = response.filter((product) => product.Destaque === 'S');
      setProductsDestaque(productsDestaque);
    } else {
      const cep = local?.results[0]?.address_components.filter((ac) => ac.types.filter((ty) => ty == 'postal_code')?.length > 0)[0]?.short_name ?? '';
      console.log(cep);
      if (!cep) {
        return;
      }
      try {
        const response = await getProductsByCEP(cep.replace('-', ''));
        setProducts(response);
      } catch (e) {
      }
    }
  };

  async function askLocalizationPermission() {
    const location = JSON.parse(await AsyncStorage.getItem('Localization'));
    console.log('location');
    console.log(location);
    if (location && !state.address) {
      const action = { type: 'createAddress', payload: location };
      dispatch(action);
      return;
    }
    (async () => {
      const { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        toastRef.current?.show('Permissão para acessar localização foi negada', 3000);
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const local = await getLocationByLatLong(location.coords.latitude, location.coords.longitude);
      await AsyncStorage.setItem('Localization', JSON.stringify(local));
      console.log('locationsadsd');
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
      console.log('ifoioio');
      console.log(state.address);
      console.log(bannersFilter);
      setBanners(bannersFilter);
    } else {
      askLocalizationPermission();
    }
  }

  useFocusEffect(useCallback(() => {
    console.log('oioi');
    loadAll();
  }, [state.address]));

  return (
    <>
      <MainNavbar navigation={navigation} />
      <View style={styles.container}>

        <StatusBar backgroundColor={theme.palette.primary} />

        <CartFab />

        <ScreenContainer>
          <ContentContainer>
            <TouchableWithoutFeedback onPress={() => navigation.navigate('Localização')}>
              <View style={styles.locationContainer}>
                <Ionicons name="md-locate" size={25} color={theme.palette.primary} />

                <View style={styles.locationInfo}>
                  <Typography size="small" color="#000">
                    {state?.address?.CEP
                      ? (state.address?.results ? state?.address?.results[0]?.formatted_address : state.address.Beautify)
                      : 'Selecione uma localização'}
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
                  if (!market) {
                    return;
                  }

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

          <FlatList
            data={productsDestaque}
            keyExtractor={(item) => `${item.Id}`}
            horizontal
            renderItem={({ item }) => (
              <TouchableOpacity key={item.Id} onPress={() => navigation.navigate('Produto', { product: item, empresaId: item.IdEmpresa })}>
                <ProductItem
                  product={item}
                />

              </TouchableOpacity>
            )}
          />

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
          !loadingMarkets && markets?.length > 0
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
    </>
  );
};

const styles = StyleSheet.create({
  navbarButton: {
    marginHorizontal: 8,
    marginTop: 0,
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
