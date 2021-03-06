import React, {
  useEffect, useCallback, useState, useRef, useContext,
} from 'react';
import {
  View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
// components
import Toast from 'react-native-easy-toast';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { CheckoutContext } from '../contexts/CheckoutContext';
import ContentContainer from '../components/ContentContainer';
import Navbar from '../components/Navbar';
import Typography from '../components/Typography';
import LocationItem from '../components/LocationItem';
// theme
import theme from '../theme';
// services
import { getLocationByLatLong } from '../services/locations';
import { AppContext } from '../contexts/AppContext';
import api from '../services/axios';
import refactoreLocalization from '../utils/refactoreLocalization';

const Locations = ({ route, navigation }) => {
  const navigate = useNavigation();
  const { state, dispatch } = useContext(AppContext);
  const [locationsLoader, setLocationsLoader] = useState(false);
  const [locations, setLocations] = useState([]);
  const [address, setaddress] = useState([]);
  const [locationText, setLocationText] = useState('');
  const { checkoutDispatch } = useContext(CheckoutContext);
  const toastRef = useRef();

  const setLocalizationByManual = async (local) => {
    const response = await api.post('Enderecos', {
      IdCliente: state?.sessao?.IdCliente,
      Endereco: local.Endereco,
      Bairro: local.Bairro,
      Cidade: local.Cidade,
      UF: local.UF.toUpperCase(),
      CEP: local.CEP.split('-').join(''),
      Num: local.Num,
      Complemento: '',
      Latitude: local.Latitude,
      Longitude: local.Longitude,
      Padrao: local.Padrao,
      Beautify: local.Endereco,
    });
    return response.data[0];
  };

  async function getLocalizationByGPS() {
    toastRef.current?.show('Carregando localização...', 2000);
    const { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      toastRef.current?.show('Permissão para acessar localização foi negada', 3000);
      return false;
    }
    const locationByLatLong = await Location.getCurrentPositionAsync({});
    const locations = await getLocationByLatLong(locationByLatLong.coords.latitude, locationByLatLong.coords.longitude);
    return locations.results.map(refactoreLocalization)[0];
  }

  async function setLocalization(local) {
    let newLocation = local;
    if (local === 'gps') {
      newLocation = await getLocalizationByGPS();
    }

    if (!newLocation) {
      return;
    }

    if (state?.sessao?.IdCliente && local !== 'gps') {
      newLocation = await setLocalizationByManual(newLocation);
    }

    if (route?.params?.checkoutEdit) {
      const action = { type: 'setEnderecoEntregaPorEstabelecimento', payload: { enderecoEntregaPorEstabelecimento: newLocation } };

      checkoutDispatch(action);
    } else {
      const action = { type: 'createAddress', payload: newLocation };
      dispatch(action);
    }

    navigation.pop();
  }

  const fetchLocations = useCallback(async () => {
    try {
      const { data } = await api.get(`Enderecos/Cliente/${state?.sessao?.IdCliente}`);
      setLocations(data);
      setaddress(data);
      setLocationsLoader(false);
    } catch (e) {
      setLocations([]);
      setaddress([]);
      setLocationsLoader(false);
    }
  }, []);

  useEffect(() => {
    setLocationsLoader(true);
    if (!state?.sessao?.IdCliente) {
      setLocationsLoader(false);
    } else {
      fetchLocations();
    }
  }, [fetchLocations]);

  useEffect(() => {
    setLocationsLoader(true);
    if (locationText === '') {
      fetchLocations();
      return;
    }

    async function fetchLocation() {
      const { data } = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${locationText}&key=AIzaSyCXoBOm61XlnQJkAFRiMF80ZGj0HLla36I`);
      const locations = data.results.map(refactoreLocalization);
      const locationsFilter = locations.filter((location) => !address.find((address) => address.CEP === location.CEP.split('-').join('')));
      setLocations([...locationsFilter, ...address]);
      setLocationsLoader(false);
    }
    fetchLocation();
  }, [locationText, fetchLocations]);

  return (
    <SafeAreaView style={{ flex: 1, paddingBottom: 10 }}>

      <Toast
        ref={toastRef}
        style={{ backgroundColor: 'black' }}
        opacity={0.8}
        textStyle={{ color: 'white' }}
      />

      <StatusBar backgroundColor={theme.palette.primary} style="light" />
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

      <View style={styles.container}>

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

        <ContentContainer background="#fff">
          <TouchableOpacity
            onPress={() => setLocalization('gps')}
            style={{
              flexDirection: 'row', width: '100%', height: 30, paddingHorizontal: 8, justifyContent: 'space-between', alignContent: 'center',
            }}
          >
            <Ionicons name="md-locate" size={30} color={theme.palette.primary} />
            <Text>
              Usar Localização Atual
            </Text>
            <View>
              <Ionicons name="ios-arrow-forward" size={30} color={theme.palette.primary} />
            </View>
          </TouchableOpacity>
        </ContentContainer>

        {locationsLoader && (
        <>
          <LocationItem skeleton />
          <LocationItem skeleton />
          <LocationItem skeleton />
        </>
        )}

        {!locationsLoader
          && (
          <FlatList
            data={locations}
            keyExtractor={(item) => `${item.IdEndereco}`}
            renderItem={({ item }) => (
              <LocationItem
                location={item}
                onPressEdit={() => navigation.navigate('Localização', { location: item })}
                setLocalization={setLocalization}
              />

            )}
          />
          )}

      </View>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  getLocationButton: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 0,
    flex: 1,
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

export default Locations;
