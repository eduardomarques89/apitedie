import Axios from 'axios';
import { urlApi } from './axios';

export const buscaHorarios = async (id) => {
  const response = await Axios.get(
    `${urlApi}empresas/horarios?id=${id}`,
  );

  return response.data;
};

export const getMarketsListByIds = async (ids) => {
  const response = await Axios.get(
    `${urlApi}empresas/getMarketsListByIds?ids=${ids.join('&ids=')}`,
  );

  return response.data;
};

export const getMarkets = async () => {
  const response = await Axios.get(
    `${urlApi}empresas`,
  );

  return response.data;
};

export const getMarketsByLocation = async (local) => {
  const cep = local?.CEP || (local?.results[0]?.address_components.filter((ac) => ac.types.filter((ty) => ty == 'postal_code')?.length > 0)[0]?.short_name ?? undefined);
  if (!cep) {
    return [];
  }
  const response = await Axios.get(
    `${urlApi}empresas/GetListaEmpresaByCEP?CEP=${cep.replace('-', '')}`,
  );

  return response.data;
};

export const getMarket = async (token, marketId) => {
  const response = await Axios.get(
    `${urlApi}empresas/?token=${token}&Idempresa=${marketId}`,
  );

  return response.data;
};

export const getProducts = async (token, marketId) => {
  const response = await Axios.get(
    `${urlApi}produtos/?token=${token}&Idempresa=${marketId}`,
  );

  let products = response.data.map((p) => ({
    name: p.Nome,
    price: p.Preco_De,
    hasOffer: p.Ofertas != null,
    off: '10%',
    imagem: p.Imagem,
    ...p,
  }));

  products = products.filter((p, i, a) => a.findIndex((v) => v.Id == p.Id) == i);

  return products;
};

export const getProduct = async (token, marketId, productId) => {
  const response = Axios.get(
    `${urlApi}produtos/?token=${token}&Idempresa=${marketId}Idproduto=${productId}`,
  );

  return response;
};
