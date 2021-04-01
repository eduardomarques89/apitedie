import React, {
  useState, useEffect, useCallback, useContext,
} from 'react';
import {
  StyleSheet, View, TouchableOpacity, ScrollView, Image, FlatList, SafeAreaView, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
// components
import { useNavigation } from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import theme from '../theme';
import ScreenContainer from '../components/ScreenContainer';
import Navbar from '../components/Navbar';
import Typography from '../components/Typography';
import MarketItem from '../components/MarketItem';
import ProductItem from '../components/ProductItem';
import CategoryItem from '../components/CategoryItem';
import { AppContext } from '../contexts/AppContext';
// services
import { getProducts } from '../services/market';
import Avatar from '../components/Avatar';
import api from '../services/axios';

const Market = ({ navigation, route }) => {
  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigation();
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [marketProducts, setMarketProducts] = useState([]);
  const [marketProductsFilter, setMarketProductsFilter] = useState([]);
  const [banners, setBanners] = useState([]);
  const { market } = route.params;

  const loadMarketProducts = useCallback(async () => {
    const token = await AsyncStorage.getItem('token');

    setLoadingProducts(true);
    const [products, banners] = await Promise.all([api.get(`produtos/?token=${token}&Idempresa=${market.IdEmpresa}`), api.get('banner')]);
    const bannerEmpresa = banners.data.filter((banner) => banner.Destaque === 'S' && banner.IdEmpresa === market.IdEmpresa);
    setBanners(bannerEmpresa);
    console.log(products.data);
    setMarketProducts([...products.data]);
    setMarketProductsFilter(products.data.filter((p) => p.hasOffer));
    setLoadingProducts(false);
  }, [setLoadingProducts, getProducts, setMarketProducts]);

  useEffect(() => {
    loadMarketProducts();
  }, []);

  return (
    <>

      <StatusBar backgroundColor={theme.palette.primary} />
      <Navbar
        left={(
          <>
            <TouchableOpacity
              hitSlop={theme.hitSlop}
              style={{ marginRight: 16 }}
              onPress={() => {
                if (navigate.canGoBack()) {
                  dispatch({ type: 'addMarketSelect', market: {} });
                  navigate.goBack();
                }
              }}
            >
              <Ionicons name="md-arrow-back" size={25} color="#fff" />
            </TouchableOpacity>
            <Avatar image={market.Logo} size={35} />
          </>
        )}
        title={(
          <Typography size="small" color="#fff">
            {market.Nome}
          </Typography>
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
              onPress={() => navigation.navigate('Categorias', { screen: 'Produtos' })}
            >
              <Ionicons name="md-search" size={30} color="#fff" />
            </TouchableOpacity>
          </>
        )}
      />

      {/* <View style={styles.containerItem}> */}
      <SafeAreaView style={{ flex: 1 }}>

        <View>

          <FlatList
            data={marketProducts}
            keyExtractor={(item) => item.Id}
            style={{
              padding: 16, paddingBottom: 90,
            }}
            // contentContainerStyle={}
            ListHeaderComponent={(
              <>
                <Swiper style={styles.swiper} showsPagination={false}>
                  {banners.map((banner) => (
                    <Image key={banner.IdBanner} source={{ uri: banner.Imagem }} style={styles.banner} />
                  ))}
                </Swiper>
                <Typography size="large" color={theme.palette.dark}>
                  Destaques
                </Typography>
              </>
              )}
            ListFooterComponent={(
              <>
                <View style={{ alignSelf: 'flex-start' }}>

                  <Typography size="large" color={theme.palette.dark}>
                    Produtos
                  </Typography>
                </View>
                <View style={styles.categoriesContainer}>
                  {!loadingProducts && marketProducts.length > 0 && (
                  <FlatList

                    style={{ paddingBottom: 50 }}
                    data={marketProducts}
                    numColumns={2}
                    keyExtractor={(item) => item.Id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => navigation.navigate('Produto', { product: { ...item, imagem: item.Imagem }, empresaId: item.IdEmpresa })}
                      >
                        <ProductItem
                          product={{ ...item, imagem: item.Imagem }}
                        />
                      </TouchableOpacity>
                    )}
                  />
                  )}
                </View>
              </>
              )}
            numColumns={2}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => navigation.navigate('Produto', { product: { ...item, imagem: item.Imagem }, empresaId: item.IdEmpresa })}
              >
                <ProductItem
                  product={{ ...item, imagem: item.Imagem }}
                />
              </TouchableOpacity>
            )}
          />
        </View>

      </SafeAreaView>
    </>

  );
};

const styles = StyleSheet.create({
  horizontalList: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 16,
  },
  containerItem: {
    flex: 1,
    paddingBottom: 90,

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
  categoriesContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexShrink: 1,
  },
  navbarButton: {
    marginHorizontal: 8,
  },
});

export default Market;
