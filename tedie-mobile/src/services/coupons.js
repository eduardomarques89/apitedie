import Axios from 'axios'
import { urlApi } from './axios'
import AsyncStorage from '@react-native-community/async-storage'

export const getCoupons = async () => {
  const sessao = JSON.parse(await AsyncStorage.getItem("sessao"))
  const IdCliente = sessao?.IdCliente || 54
  if(!IdCliente){
    return
  }
  const response = await Axios.get(
    `${urlApi}/cupons${IdCliente}`
  )

  return response.data
}