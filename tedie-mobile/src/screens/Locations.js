import React, {
  useEffect, useCallback, useState, useRef, useContext,
} from 'react';
import {
  View, Text, StatusBar, FlatList, TouchableOpacity, TextInput, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// components
import Toast, { DURATION } from 'react-native-easy-toast';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
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
import api from '../services/axios';

const Locations = ({ route, navigation }) => {
  const navigate = useNavigation();
  const { state, dispatch } = useContext(AppContext);
  const [locationsLoader, setLocationsLoader] = useState(false);
  const [locations, setLocations] = useState([]);
  const [address, setaddress] = useState([]);
  const [locationsInput, setLocationsInput] = useState([]);
  const [locationText, setLocationText] = useState('');
  const toastRef = useRef();

  async function setLocalization(local) {
    if (local == 'gps') {
      (async () => {
        toastRef.current?.show('Carregando localização...', 2000);
        const { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
          toastRef.current?.show('Permissão para acessar localização foi negada', 3000);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const address = await getLocationByLatLong(location.coords.latitude, location.coords.longitude);
        await AsyncStorage.setItem('Localization', JSON.stringify(address));

        const action = { type: 'createAddress', payload: address };
        dispatch(action);

        navigation.pop();
      })();
    } else {
      const address = await getLocationByLatLong(local.Latitude, local.Longitude);
      await AsyncStorage.setItem('Localization', JSON.stringify(address));

      const action = { type: 'createAddress', payload: address };
      dispatch(action);

      navigation.pop();
    }
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
      const locations = data.results.map((result) => {
        const UF = result.address_components.find((object) => object.types.includes('administrative_area_level_1'))?.short_name || '';
        const Cidade = result.address_components.find((object) => object.types.includes('administrative_area_level_2'))?.long_name || '';
        const Bairro = result.address_components.find((object) => object.types.includes('sublocality_level_1'))?.long_name || '';
        const Num = result.address_components.find((object) => object.types.includes('street_number'))?.short_name || 0;
        const Endereco = result.formatted_address || '';

        return {
          Cidade,
          UF,
          Num,
          Bairro,
          Endereco,
          Latitude: result.geometry.location.lat,
          Longitude: result.geometry.location.lng,
          IdEndereco: result.place_id,
        };
      });
      setLocations([...locations, ...address]);
      setLocationsLoader(false);
    }
    fetchLocation();
  }, [locationText, fetchLocations]);

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

      <ScreenContainer>

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
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <TouchableOpacity
              onPress={() => setLocalization('gps')}
              style={{
                flex: 1,
                width: '100%',
                minWidth: '50%',
                paddingLeft: '25%',
                flexDirection: 'row',
              }}
            >
              <View style={{ position: 'absolute', left: 0 }}>
                <Ionicons name="md-locate" size={30} color={theme.palette.primary} />
              </View>
              <Text style={{ paddingLeft: 8 }}>
                Usar Localização Atual
              </Text>
            </TouchableOpacity>
            <View style={{ position: 'absolute', right: 0 }}>
              <Ionicons name="ios-arrow-forward" size={30} color={theme.palette.primary} />
            </View>
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
                  setLocalization={setLocalization}
                />

              )}
            />
          )}

      </ScreenContainer>
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

export default Locations;
