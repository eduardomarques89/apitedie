import Axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { urlApi } from './axios';

export const getCoupons = async () => {
  const sessao = JSON.parse(await AsyncStorage.getItem('sessao'));
  const IdCliente = sessao?.IdCliente;
  if (!IdCliente) {
    return [];
  }
  const response = await Axios.get(
    `${urlApi}/cupons${IdCliente}`,
  );

  return response.data;
};
