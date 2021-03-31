import React, {
  useCallback, useContext, useEffect, useRef, useState,
} from 'react';
import {
  StyleSheet, FlatList, View, TouchableOpacity, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// components
import { ScreenContainer } from 'react-native-screens';
import { FlingGestureHandler } from 'react-native-gesture-handler';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Navbar from '../components/Navbar';
import Typography from '../components/Typography';
import ProductItem from '../components/ProductItem';
import Avatar from '../components/Avatar';
// theme
import theme from '../theme';
import { getProductsByCEP } from '../services/products';
import { AppContext } from '../contexts/AppContext';
import ContentContainer from '../components/ContentContainer';
import api from '../services/axios';

const Products = ({ navigation, route }) => {
  const navigate = useNavigation();
  const { state, dispatch } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [productsFilter, setProductsFilter] = useState([]);
  const [empresa, setEmpresa] = useState({});
  const [filter, setFilter] = useState('');
  const { categoriaId, onlyOffer } = route.params ?? {};

  const loadProducts = async () => {
    const local = state.address;
    // carrega produtos com localizacao do localstorage
    if (local.CEP != undefined && local.CEP != '') {
      const response = await getProductsByCEP(local.CEP.replace('-', ''));
      setProducts(response);
      setProductsFilter(response);
      const empresa = await api.get('Empresas/');
      setEmpresa(empresa.data);
      console.log(empresa);
    } else {
      try {
        const cep = local.results[0]?.address_components.filter((ac) => ac.types.filter((ty) => ty == 'postal_code')?.length > 0)[0]?.short_name ?? '';
        const response = await getProductsByCEP(cep.replace('-', ''));
        setProducts(response);
        setProductsFilter(response);
      } catch (e) {
        console.log(e);
        debugger;
      }
    }
  };

  useFocusEffect(useCallback(() => {
    async function fechData() {
      try {
        if (state?.market?.logo) {
          const { data } = await api.get(`Produtos?idempresa=${state.market.IdEmpresa}&categoria=${categoriaId}`);
          setProducts(data);
          setProductsFilter(data);
        } else {
          const { data } = await api.get(`Produtos?categoria=${categoriaId}`);
          setProducts(data);
          setProductsFilter(data);
        }
      } catch (e) {
        console.log(e);
      }
    }
    fechData();
  }, []));

  async function filtrar(value) {
    if (value === '') {
      setProductsFilter(products);
    } else {
      setProductsFilter(products.filter((p) => p.Nome.toLowerCase().includes(value.toLowerCase())));
    }
    setFilter(value);
  }

  return (
    <>
      <Navbar
        left={(
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center' }}
            hitSlop={theme.hitSlop}
            onPress={() => {
              if (navigate.canGoBack()) {
                navigate.goBack();
              }
            }}
          >
            <Ionicons name="md-arrow-back" size={30} color="#fff" style={{ marginRight: 8 }} />
            {
             state?.market?.Logo
            && <Avatar image={state?.market?.Logo} size={35} />
           }
            <Typography size="small" color="#fff">
              {state?.market?.Nome || 'Produtos'}
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

            {/* <TouchableOpacity
              style={styles.navbarButton}
              hitSlop={theme.hitSlop}
              onPress={() =>navigation.navigate('Categorias', { screen: 'Produtos' })
              }
            >
              <Ionicons name="md-search" size={30} color="#fff" />
            </TouchableOpacity> */}
          </>
        )}
      />

      <ScreenContainer style={{ padding: 16 }}>

        <ContentContainer>
          <View style={styles.searchContainer}>
            <Ionicons name="md-search" size={30} color={theme.palette.primary} />

            <TextInput
              style={styles.textInput}
              value={filter}
              onChangeText={(value) => filtrar(value)}
              placeholder="Digite um produto"
            />
          </View>
        </ContentContainer>

        <View style={styles.container}>
          {categoriaId
            && (
            <FlatList
              data={productsFilter}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => navigation.navigate('Produto', { product: item, empresaId: empresa.IdEmpresa })}>
                  <ProductItem product={item} />
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index}
              numColumns={2}
              showsVerticalScrollIndicator={false}
            />
            )}
          {!categoriaId && onlyOffer
            && (
            <FlatList
              data={productsFilter}
              renderItem={({ item }) => item.hasOffer && (
              <TouchableOpacity onPress={() => navigation.navigate('Produto', { product: item, empresaId: empresa.IdEmpresa })}>
                <ProductItem product={item} />
              </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index}
              numColumns={2}
              showsVerticalScrollIndicator={false}
            />
            )}
          {!categoriaId && !onlyOffer
            && (
            <FlatList
              data={productsFilter}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => navigation.navigate('Produto', { product: item })}>
                  <ProductItem product={item} />
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index}
              numColumns={2}
              showsVerticalScrollIndicator={false}
            />
            )}
        </View>

      </ScreenContainer>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  navbarButton: {
    marginHorizontal: 8,
  },
  textInput: {
    width: '85%',
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginLeft: 16,
    backgroundColor: '#fafafa',
    borderRadius: 16,
  },

});

export default Products;
