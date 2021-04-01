import React, {
  useCallback, useState, useEffect, useContext,
} from 'react';
import {
  StyleSheet, FlatList, View, TouchableOpacity, StatusBar,
} from 'react-native';
// components
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Typography from '../components/Typography';
import CategoryItem from '../components/CategoryItem';
import Loader from '../components/Loader';
// services
import Navbar from '../components/Navbar';
import Avatar from '../components/Avatar';
// theme
import theme from '../theme';
import { AppContext } from '../contexts/AppContext';
import api from '../services/axios';

const Categories = ({ navigation }) => {
  const { state, dispatch } = useContext(AppContext);
  const [categoriesLoader, setCategoriesLoader] = useState(false);
  const [categories, setCategories] = useState([]);

  useFocusEffect(useCallback(() => {
    async function fechData() {
      setCategoriesLoader(true);
      console.log(state.market);
      try {
        if (state?.market?.Logo) {
          const { data } = await api.get(`empresas/categorias?id=${state?.market?.IdEmpresa}`);
          setCategories(data);
        } else {
          const { data } = await api.get('categorias');
          setCategories(data);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setCategoriesLoader(false);
      }
    }
    fechData();
  }, [state.market]));

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

      <StatusBar backgroundColor={theme.palette.primary} />
      <Loader show={categoriesLoader} />
      {
        !categoriesLoader && (

        <View style={styles.containerAll}>
          {/* <MainNavbar navigation={navigation} /> */}

          <View style={styles.container}>
            <Typography size="medium" color="#000">
              Categorias
            </Typography>

            <FlatList
              data={categories}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => navigation.navigate('Produtos', { nameCategory: item.NomeCategoria })}>
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
        )
      }
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
