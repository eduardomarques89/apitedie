import React, {
  useContext, useEffect, useRef, useState, useCallback,
} from 'react';
import {
  StyleSheet, FlatList, View, TouchableOpacity, TextInput, StatusBar,
} from 'react-native';
// components
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenContainer } from 'react-native-screens';
import MainNavbar from '../components/MainNavbar';
import Typography from '../components/Typography';
import ProductItem from '../components/ProductItem';
import { getProductsByCEP } from '../services/products';
import { AppContext } from '../contexts/AppContext';
import ContentContainer from '../components/ContentContainer';
import Avatar from '../components/Avatar';
import api from '../services/axios';
// theme
import theme from '../theme';

const Deals = ({ navigation }) => {
  const { state, dispatch } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [productsFilter, setProductsFilter] = useState([]);
  const [refresh, setRefresh] = useState({
    refreshing: false,
    page: 1,
  });
  const [filter, setFilter] = useState('');
  const fetchProducts = async (cep) => {
    console.log(cep);
    const value = await api.get(`produtos/Ofertas?CEP=${cep}&offset=${10 * (refresh.page - 1)}&limite=${10 * refresh.page}&searchQuery=${filter}`);
    console.log(`produtos/Ofertas?CEP=${cep}&offset=${10 * (refresh.page - 1)}&limite=${10 * refresh.page}&searchQuery=${filter}`);
    const productsOferta = value.data.filter((product) => product.Oferta === 'S');
    if (!state.market?.IdEmpresa) {
      setProductsFilter(productsOferta);
    }

    const FilterValues = productsOferta.filter((value) => value.IdEmpresa === state.market.IdEmpresa);
    setProductsFilter(FilterValues);
  };

  const loadProducts = async () => {
    const local = state.address;
    // carrega produtos com localizacao do localstorage
    if (local?.CEP != undefined && local?.CEP != '') {
      fetchProducts(local.CEP.replace('-', ''));
    } else {
      try {
        const cep = local?.results[0]?.address_components.filter((ac) => ac.types.filter((ty) => ty == 'postal_code')?.length > 0)[0]?.short_name ?? '';
        fetchProducts(cep.replace('-', ''));
      } catch (e) {
        console.log(e);
        debugger;
      }
    }
  };
  useFocusEffect(useCallback(() => {
    loadProducts();
  }, [state.address, state.market.IdEmpresa, filter]));
  return (
    <>
      <StatusBar backgroundColor={theme.palette.primary} />
      <MainNavbar
        navigation={navigation}
        left={
        state.market
        && (
        <>
          <Avatar
            size={35}
            color={theme.palette.secondary}
            image={state.market.Logo}
          />
          <Typography size="small" color="#fff">
            {state.market.Nome}
          </Typography>
        </>
        )
      }
      />
      <ScreenContainer style={{ padding: 16, flex: 1 }}>
        <ContentContainer>
          <View style={styles.searchContainer}>
            <Ionicons name="md-search" size={30} color={theme.palette.primary} />
            <TextInput
              style={styles.textInput}
              value={filter}
              onChangeText={(value) => {
                setFilter(value);
              }}
              placeholder="Digite um produto"
            />
          </View>
        </ContentContainer>
        <View style={styles.container}>
          <Typography size="medium" color="#000">
            Ofertas
          </Typography>
          <View>
            <FlatList
              refre
              contentContainerStyle={{ paddingBottom: 120 }}
              data={productsFilter}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => navigation.navigate('Produto', { product: item, empresaId: item.IdEmpresa })}>
                  <ProductItem product={{ ...item }} />
                </TouchableOpacity>
              )}

              keyExtractor={(item) => `${item.Id}`}
              numColumns={2}
              columnWrapperStyle={{ flexWrap: 'wrap', flexDirection: 'row' }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </ScreenContainer>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    // flex: 1,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
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
export default Deals;
