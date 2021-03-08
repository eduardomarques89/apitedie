import AsyncStorage from '@react-native-community/async-storage'
import Axios from 'axios'
import { urlApi } from './axios'

export const getOrders = async () => {
  const sessao = JSON.parse(await AsyncStorage.getItem("sessao"))
  const IdCliente = sessao?.IdCliente || 54
  if(!IdCliente){
    return
  }
  
  const response = await Axios.get(
    `${urlApi}Pedidos/Usuario/${IdCliente}`
  )

  return response.data
}

export const postOrder = async (pedido) => {
  const response = await Axios.post(
    `${urlApi}Enderecos/LatLong?latitude=${lat}&longitude=${long}`,
    pedido
  ).catch(e => console.log(e.message))

  return response.data
}