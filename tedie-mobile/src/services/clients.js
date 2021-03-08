import { api, urlApi } from '../services/axios'

export const login = async (usuario, senha) => {
    const response = await api().post(
        `${urlApi}clientes/autenticaComToken?login=${usuario}&senha=${senha}`,
    ).catch(e => {
        console.log(e.message)
    });
    console.log(response)
    if (response)
        return {
            IdCliente: response.data.cliente.IdCliente,
            token: response.data.token
        }
    else
        return {}
}


export const postCliente = async (cliente) => {
    const response = await api().post(
        `${urlApi}clientes/`,
        cliente
    ).catch(e => {
        console.log(e.message)
    });

    if (response.status == 201)
        return true
    else
        return false
}