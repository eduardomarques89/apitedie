import React, {
  useCallback, useContext, useEffect, useState,
} from 'react';
import {
  StyleSheet, FlatList, View, TouchableOpacity, TextInput, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// components
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Navbar from '../components/Navbar';
import Typography from '../components/Typography';
import ProductItem from '../components/ProductItem';
import Avatar from '../components/Avatar';
// theme
import theme from '../theme';
import { AppContext } from '../contexts/AppContext';
import ContentContainer from '../components/ContentContainer';
import api from '../services/axios';
import Loader from '../components/Loader';

const Products = ({ navigation, route }) => {
  const navigate = useNavigation();
  const { state, dispatch } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [loading,
    setLoading] = useState(false);
  const [productsFilter, setProductsFilter] = useState([]);
  const [empresa, setEmpresa] = useState({});
  const [refresh, setRefresh] = useState({
    loading: false,
    page: 1,
    limit: 10,
  });
  const [filter, setFilter] = useState('');
  const { nameCategory } = route.params ?? {};

  const fechData = useCallback(() => {
    async function fetchMore() {
      let moreProducts = [];
      try {
        if (nameCategory) {
          const { data } = await api.get(`Produtos/CEPCategoriaPaginado?CEP=${state.address.CEP.replace('-', '')}&Categoria=${nameCategory}&offset=${10 * (refresh.page - 1)}&limite=${refresh.limit}&searchQuery=${filter}`);
          moreProducts = data;
        } else {
          const { data } = await api.get('Produtos');
          moreProducts = data;
        }
        if (state?.market?.Logo) {
          moreProducts = moreProducts.filter((product) => product.IdEmpresa === state.market.IdEmpresa);
        }
        setProducts((props) => [...props, ...moreProducts]);
        setProductsFilter((props) => [...props, ...moreProducts]);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
      setRefresh((props) => ({ ...props, loading: false }));
    }
    fetchMore();
  });

  useFocusEffect(useCallback(() => {
    setLoading(true);
    fechData();
  }, []));
  useEffect(() => {
    if (refresh.loading) {
      fechData();
    }
  }, [refresh, fechData]);

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

      <StatusBar backgroundColor={theme.palette.primary} />
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
          </>
        )}
      />
      <Loader show={loading} />

      {!loading && (
      <>

        <View style={styles.searchContainerContainer}>
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
        </View>

        <View style={styles.container}>
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

            onEndReached={() => setRefresh((props) => ({ ...props, page: props.page + 1, loading: true }))}
            onEndReachedThreshold={0.5}
          />
        </View>
      </>
      )}

    </>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,

    marginBottom: 170,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: 16,
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
  searchContainerContainer: {
    marginHorizontal: 8,
  },

});

export default Products;
