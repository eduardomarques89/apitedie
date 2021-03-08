import Axios from 'axios'

export const getTokenData = async () => {
  const response = await Axios.get(
    'http://tedie.azurewebsites.net/api/token/?CredencialName=DEVTEDIE&Credencialkey=CAK23432KD0932DJ23D32IJD39'
  )

  return response.data[0]
}