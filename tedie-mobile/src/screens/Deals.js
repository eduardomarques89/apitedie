import React, {
  useContext, useEffect, useState, useCallback,
} from 'react';
import {
  StyleSheet, FlatList, View, TouchableOpacity, TextInput, StatusBar,
} from 'react-native';
// components
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import MainNavbar from '../components/MainNavbar';
import Typography from '../components/Typography';
import ProductItem from '../components/ProductItem';
import { AppContext } from '../contexts/AppContext';
import ContentContainer from '../components/ContentContainer';
import Avatar from '../components/Avatar';
import api from '../services/axios';
// theme
import theme from '../theme';
import Loader from '../components/Loader';

const Deals = ({ navigation }) => {
  const { state } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [productsFilter, setProductsFilter] = useState([]);
  const [refresh, setRefresh] = useState({
    loading: false,
    page: 1,
    limit: 10,
  });
  const [filter, setFilter] = useState('');
  const fetchProducts = useCallback(() => {
    async function fetchData() {
      try {
        console.log(`Produtos/CEPCategoriaPaginado?CEP=${state.address?.CEP.replace('-', '')}&offset=${40 * (refresh.page - 1)}&limite=${40 * refresh.page}&Categoria={}&searchQuery=${filter}`);
        const value = await api.get(`Produtos/CEPCategoriaPaginado?CEP=${state.address?.CEP.replace('-', '')}&offset=${40 * (refresh.page - 1)}&limite=${40 * refresh.page}&Categoria=&searchQuery=${filter}`);
        const productsOferta = value.data.filter((product) => product.Oferta === 'S');
        console.log(productsOferta);
        if (!state.market?.IdEmpresa) {
          setProductsFilter((props) => [...props, ...productsOferta]);

          setLoading(false);
          return;
        }
        const FilterValues = productsOferta.filter((value) => value.IdEmpresa === state.market.IdEmpresa);
        setProductsFilter((props) => {
          console.log([...props, ...FilterValues]);
          return [...props, ...FilterValues];
        });
      } catch (e) {
        console.log(e);
      }

      setLoading(false);
    }
    fetchData();
  }, []);
  useFocusEffect(useCallback(() => {
    setLoading(true);
    if (state.address?.CEP) {
      fetchProducts();
    }
  }, [state.address, state.market.IdEmpresa, filter]));
  useEffect(() => {
    if (refresh.loading) {
      fetchProducts();
    }
  }, [refresh, fetchProducts]);
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
      <Loader show={loading} />
      {!loading && (
      <View style={{ padding: 16, flex: 1 }}>
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
              keyExtractor={(item) => `${item.Id}`}
              numColumns={2}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => navigation.navigate('Produto', { product: item, empresaId: item.IdEmpresa })}>
                  <ProductItem product={{ ...item }} />
                </TouchableOpacity>
              )}
              columnWrapperStyle={{ flexWrap: 'wrap', flexDirection: 'row' }}
              showsVerticalScrollIndicator={false}
              onEndReached={() => setRefresh((props) => ({ ...props, page: props.page + 1, loading: true }))}
              onEndReachedThreshold={1}
            />
          </View>
        </View>
      </View>

      )}
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
