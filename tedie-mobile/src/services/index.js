import Axios from 'axios';

export const getTokenData = async () => {
  const response = await Axios.get(
    'http://tedie.azurewebsites.net/api/token/1',
  );

  return response.data[0];
};
