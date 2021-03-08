import { api, urlApi } from '../services/axios'

export const postCard = async (cartao) => {
        await api().post(
        `${urlApi}clientes/PostCartao`,
        cartao
        );
}

export const getCard = async (idCliente) => {
    const response = await api().get(
        `${urlApi}clientes/GetCartao?idCliente=${idCliente}`,
    );

    return response.data;
}