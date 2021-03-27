import Axios from 'axios';
import { api, urlApi } from './axios';

export const getCategories = async () => {
  const response = await Axios.get(
    `${urlApi}categorias`,
  );

  const categorias = response.data;
  // categorias = categorias.filter((c, i, a) => a.findIndex(v => v.IdCategoria == c.IdCategoria) == i)

  return categorias;
};
