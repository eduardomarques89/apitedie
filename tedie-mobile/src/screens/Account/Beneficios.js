import React, {
  useCallback, useState, useEffect, useContext,
} from 'react';
import {
  StyleSheet, FlatList, View, TouchableOpacity, StatusBar,
} from 'react-native';
// components
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Typography from '../../components/Typography';
import BeneficioItem from '../../components/Beneficio';
import Loader from '../../components/Loader';
// services
import Navbar from '../../components/Navbar';
import Avatar from '../../components/Avatar';
// theme
import theme from '../../theme';
import { AppContext } from '../../contexts/AppContext';

const Beneficios = ({ navigation }) => {
  const { state, dispatch } = useContext(AppContext);
  const [BeneficiosLoader, setBeneficiosLoader] = useState(false);
  const [Beneficios, setBeneficios] = useState([]);

  useFocusEffect(useCallback(() => {
    async function fechData() {
      setBeneficiosLoader(true);
      try {
        const data = await api.get(`BeneficiosCliente/${state?.sessao?.IdCliente}`);
        setBeneficios(data);
      } catch (e) {
      } finally {
        setBeneficiosLoader(false);
      }
    }
    fechData();
  }, [state.market]));

  return (
    <>
      <Navbar
        left={(
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} hitSlop={theme.hitSlop} onPress={() => navigation.pop()}>
            <Ionicons name="md-arrow-back" size={30} color="#fff" />
          </TouchableOpacity>
        )}
        title={(
          <Typography size="small" color="#fff">
            Resgate de Prêmios
          </Typography>
        )}
      />

      <StatusBar backgroundColor={theme.palette.primary} />
      <Loader show={BeneficiosLoader} />
      {
        !BeneficiosLoader && (

        <View style={styles.containerAll}>
          {/* <MainNavbar navigation={navigation} /> */}

          <View style={styles.container}>
            <Typography size="medium" color="#000">
              Saldo atual:
              {' '}
              {}
            </Typography>

            <FlatList
              data={Beneficios}
              renderItem={({ item }) => (
                <TouchableOpacity>
                  <BeneficioItem
                    beneficio={item}
                  />
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => `${item.IdBeneficio}`}
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

export default Beneficios;
