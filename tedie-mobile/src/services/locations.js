import Axios from 'axios'
import { api, urlApi } from './axios';

export const getLocationByLatLong = async (lat, long) => {
  const response = await api().get(
    `${urlApi}Enderecos/LatLong?latitude=${lat}&longitude=${long}`,
  );
  return response.data
}