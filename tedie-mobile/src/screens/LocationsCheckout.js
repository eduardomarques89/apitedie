import React, {
  useEffect, useCallback, useState, useRef, useContext,
} from 'react';
import {
  View, Text, StatusBar, TouchableWithoutFeedback, FlatList, TouchableOpacity, TextInput, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// components
import { useNavigation } from '@react-navigation/native';
import Toast, { DURATION } from 'react-native-easy-toast';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenContainer from '../components/ScreenContainer';
import ContentContainer from '../components/ContentContainer';
import Navbar from '../components/Navbar';
import Typography from '../components/Typography';
import LocationItem from '../components/LocationItem';
// theme
import theme from '../theme';
// services
import { getLocationByLatLong } from '../services/locations';
import { AppContext } from '../contexts/AppContext';
import { CheckoutContext } from '../contexts/CheckoutContext';
import { CartContext } from '../contexts/CartContext';
import api from '../services/axios';

const LocationsCheckout = ({ route, navigation }) => {
  const navigate = useNavigation();
  const { state, dispatch } = useContext(AppContext);
  const { checkoutState, checkoutDispatch } = useContext(CheckoutContext);
  const { cartState, cartDispatch } = useContext(CartContext);
  const [address, setAddress] = useState([]);
  const [locationsLoader, setLocationsLoader] = useState(false);
  const [locations, setLocations] = useState([]);
  const [locationText, setLocationText] = useState('');
  const toastRef = useRef();

  const loadLocations = useCallback(async () => {
    setLocationsLoader(true);
    try {
      const { data } = await api.get(`Enderecos/Cliente/${state?.sessao?.IdCliente}`);
      setLocations(data);
      setAddress(data);
    } catch {
      setLocations([]);
    } finally {
      setLocationsLoader(false);
    }
  }, []);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  useEffect(() => {
    setLocationsLoader(true);
    if (locationText === '') {
      loadLocations();
      return;
    }
    async function fetchLocation() {
      const { data } = await api.get(`https://maps.googleapis.com/maps/api/geocode/json?address=Brasil ${locationText}&key=AIzaSyCXoBOm61XlnQJkAFRiMF80ZGj0HLla36I`);

      const locations = data.results.map((result) => {
        const UF = result.address_components.find((object) => object.types.includes('administrative_area_level_1'))?.short_name || '';
        const Cidade = result.address_components.find((object) => object.types.includes('administrative_area_level_2'))?.long_name || '';
        const Bairro = result.address_components.find((object) => object.types.includes('sublocality_level_1'))?.long_name || '';
        const Num = result.address_components.find((object) => object.types.includes('street_number'))?.short_name || 0;
        const Endereco = result.formatted_address || '';
        const cep = result.address_components.find((object) => object.types.includes('postal_code'))?.short_name || '';
        // const [, , cep] = result.formatted_address.split(',');
        return {
          Cidade,
          UF,
          Num,
          Bairro,
          Endereco,
          CEP: cep,
          Latitude: result.geometry.location.lat,
          Longitude: result.geometry.location.lng,
          IdEndereco: result.place_id,
          Padrao: 'N',
          notExist: true,
        };
      });
      const locationsFilter = locations.filter((local) => !address.find((localAdress) => local?.CEP.split('-').join('') === localAdress.CEP));
      setLocations((props) => [...locationsFilter, ...address]);
      setLocationsLoader(false);
    }
    fetchLocation();
  }, [locationText]);

  async function setLocalization(local) {
    if (local?.notExist) {
      try {
        const response = await api.post('Enderecos', {
          IdCliente: state?.sessao?.IdCliente,
          Endereco: local.Endereco,
          Bairro: local.Bairro,
          Cidade: local.Cidade,
          UF: local.UF.toUpperCase(),
          CEP: local.CEP.split('-').join(''),
          Num: local.Num,
          Complemento: '',
          Latitude: local.latitude,
          Longitude: local.longitude,
          Padrao: local.Padrao,
          Beautify: local.Endereco,
        });
        const action = { type: 'setEnderecoEntregaPorEstabelecimento', payload: { enderecoEntregaPorEstabelecimento: response[0] } };
        checkoutDispatch(action);

        await AsyncStorage.setItem('Localization', JSON.stringify(local));
        navigation.pop();
        return;
      } catch (e) {
        console.log(e);
      }
    } else {
      const action = { type: 'setEnderecoEntregaPorEstabelecimento', payload: { enderecoEntregaPorEstabelecimento: local } };

      checkoutDispatch(action);
      await AsyncStorage.setItem('Localization', JSON.stringify(local));
    }

    navigation.pop();
  }

  // async function setLocalization(local) {
  //   let ee = { ...checkoutState.enderecoEntregaPorEstabelecimento };
  //   ee = local;
  //   const action = { type: 'setEnderecoEntregaPorEstabelecimento', payload: { enderecoEntregaPorEstabelecimento: ee } };
  //   checkoutDispatch(action);

  //   navigation.pop();
  // }

  return (
    <>

      <Toast
        ref={toastRef}
        style={{ backgroundColor: 'black' }}
        opacity={0.8}
        textStyle={{ color: 'white' }}
      />

      <StatusBar backgroundColor={theme.palette.primary} />
      <Navbar
        left={(
          <TouchableOpacity
            hitSlop={theme.hitSlop}
            onPress={() => {
              if (navigate.canGoBack()) {
                navigate.goBack();
              }
            }}
          >
            <Ionicons name="md-arrow-back" size={25} color="#fff" />
          </TouchableOpacity>
        )}
        title={(
          <Typography size="small" color="#fff">
            Localização
          </Typography>
        )}
      />

      <View style={{ padding: 16 }}>

        <ContentContainer>
          <View style={styles.searchContainer}>
            <Ionicons name="md-search" size={30} color={theme.palette.primary} />
            <TextInput
              style={styles.textInput}
              placeholder="Digite o endereço"
              value={locationText}
              onChangeText={setLocationText}
            />
          </View>
        </ContentContainer>

        {locationsLoader && (
          <>
            <LocationItem skeleton />
            <LocationItem skeleton />
            <LocationItem skeleton />
          </>
        )}

        {locations.length > 0 && !locationsLoader
          && (
            <FlatList
              data={locations}
              keyExtractor={(item) => `${item.IdEndereco}`}
              renderItem={({ item }) => (
                <LocationItem
                  location={item}
                  onPressEdit={() => navigation.navigate('Localização', { location: item })}
                  setLocalization={() => setLocalization(item)}
                />
              )}

            />
          )}

      </View>
    </>

  );
};

const styles = StyleSheet.create({
  getLocationButton: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  touchable: {
    marginVertical: 16,
  },

  textInput: {
    width: '85%',
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginLeft: 16,
    backgroundColor: '#fafafa',
    borderRadius: 16,
  },

  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

export default LocationsCheckout;
