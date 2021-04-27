import Axios from 'axios';
import { api, urlApi } from './axios';

export const getBeneficios = async () => {
  const sessao = JSON.parse(await AsyncStorage.getItem('sessao'));
  const IdCliente = sessao?.IdCliente;
  if (!IdCliente) {
    return [];
  }
  const response = await Axios.get(
    `${urlApi}/BeneficiosCliente/${IdCliente}`,
  );
  return beneficios;
};
