import { api, urlApi } from './axios';

export const postPedido = async (pedido) => {
  const response = await api().post(
    `${urlApi}Pedidos`,
    pedido,
  );
};

// Atualiza status para F
export const postCheckout = async (pedido) => {
  await api().post(
    `${urlApi}Pedidos/Checkout`,
    pedido,
  );
};

export const getProductsByCEP = async (CEP, categoria = '', offset = 0, limite = 999, searchQuery = '') => {
  const response = await api().get(
    `${urlApi}produtos/CEPCategoriaPaginado?CEP=${CEP}&Categoria=${categoria}&offset=${offset}&limite=${limite}&searchQuery=${searchQuery}`,
  );

  const products = response.data.map((p) => ({
    name: p.Nome,
    price: p.Preco_De,
    hasOffer: p.Ofertas != null,
    off: '10%',
    imagem: p.Imagem,
    ...p,
  }));

  // products = products.filter((p, i, a) => a.findIndex(v => v.Id == p.Id) == i)

  return response.data;
};

export const getOfertasByCEP = async (CEP, categoria = '', offset = 0, limite = 999, searchQuery = '') => {
  const response = await api().get(
    `${urlApi}produtos/Ofertas?CEP=${CEP}&Categoria=${categoria}&offset=${offset}&limite=${limite}&searchQuery=${searchQuery}`,
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

export const getProductsAtacadoByCEP = async (CEP, categoria = '', offset = 0, limite = 999, searchQuery = '') => {
  const response = await api().get(
    `${urlApi}produtos/CEPCategoriaPaginado?CEP=${CEP}&Categoria=${categoria}&offset=${offset}&limite=${limite}&searchQuery=${searchQuery}`,
  );

  const products = response.data.map((p) => ({
    name: p.Nome,
    price: p.Preco_De,
    hasOffer: p.Ofertas != null,
    off: '10%',
    imagem: p.Imagem,
    ...p,
  }));

  return products;
};
