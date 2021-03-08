import axios from 'axios'

// export const urlApi = 'http://192.168.0.104:59618/api/'
export const urlApi ='http://tedie.azurewebsites.net/api/'

const instance = axios.create({
  baseURL: urlApi
})

export const api = () => {
  instance.interceptors.response.use(
    response =>
      response,
    error => {
      throw error
    }
  );
  return instance;
}

export default instance;