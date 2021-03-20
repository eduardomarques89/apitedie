import React, {
  useCallback, useState, useEffect, useContext,
} from 'react';
import {
  StyleSheet, FlatList, View, TouchableOpacity,
} from 'react-native';
// components
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import MainNavbar from '../components/MainNavbar';
import Typography from '../components/Typography';
import CategoryItem from '../components/CategoryItem';
// services
import { getCategories } from '../services/categories';
import Navbar from '../components/Navbar';
import Avatar from '../components/Avatar';
// theme
import theme from '../theme';
import { AppContext } from '../contexts/AppContext';

const Categories = ({ navigation }) => {
  const { state, dispatch } = useContext(AppContext);
  const [categoriesLoader, setCategoriesLoader] = useState(false);
  const [categories, setCategories] = useState([]);

  const loadCategories = useCallback(async () => {
    console.log(state.market.Logo);
    setCategoriesLoader(true);

    const categoriesResponse = await getCategories();
    if (state?.market?.Logo) {
      console.log(state.market);
      const categoriesByCompany = categoriesResponse.filter((categories) => categories.IdEmpresa === state.market.IdEmpresa);
      setCategories(categoriesByCompany);
      return;
    }
    console.log(categoriesResponse);
    setCategories(categoriesResponse);

    setCategoriesLoader(false);
  }, [setCategoriesLoader, setCategories, getCategories, state.market]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return (
    <>
      <Navbar
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
              onPress={() => navigation.navigate('Produtos')}
            >
              <Ionicons name="md-search" size={30} color="#fff" />
            </TouchableOpacity>
          </>
        )}
      />
      <View style={styles.containerAll}>
        {/* <MainNavbar navigation={navigation} /> */}

        <View style={styles.container}>
          <Typography size="medium" color="#000">
            Categorias
          </Typography>

          <FlatList
            data={categories}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigation.navigate('Produtos', { categoriaId: item.IdCategoria, empresaId: item.IdEmpresa })}>
                <CategoryItem
                  category={item}
                />
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index}
            numColumns={2}
            showsVerticalScrollIndicator={false}
          />
        </View>

      </View>
    </>
  );
};

const styles = StyleSheet.create({
  containerAll: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  navbarButton: {
    marginHorizontal: 8,
  },
});

export default Categories;
