import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import {
  StyleSheet, FlatList, View, TouchableOpacity, TextInput,
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
  const [filter, setFilter] = useState('');
  const fetchProducts = async (cep) => {
    const value = await api.get(`produtos/Ofertas?CEP=${cep}&offset=${0}&limite=${999}&searchQuery=${filter}`);
    if (!state.market?.IdEmpresa) {
      setProducts(value.data);
      setProductsFilter(value.data);
      return;
    }

    const FilterValues = value.data.filter((value) => value.IdEmpresa === state.market.IdEmpresa);
    setProducts(FilterValues);
    setProductsFilter(FilterValues);
  };

  const loadProducts = async () => {
    console.log(state);
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

  useEffect(() => {
    loadProducts();
  }, [state.address, state.market.IdEmpresa, filter]);

  return (
    <>
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
              contentContainerStyle={{ paddingBottom: 120 }}
              data={productsFilter}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => navigation.navigate('Produto', { product: item, empresaId: item.IdEmpresa })}>
                  <ProductItem product={{ ...item, imagem: item.Imagem }} />
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => `${item.Id + index}`}
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