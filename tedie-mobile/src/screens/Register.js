import React, { useRef, useState } from 'react';
import {
  StyleSheet, View, Image, StatusBar, ActivityIndicator,
} from 'react-native';
// theme
import Toast from 'react-native-easy-toast';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import theme from '../theme';

import Box from '../components/Box';
import TextField from '../components/TextField';
import Button from '../components/Button';
import logo from '../assets/logo_amarelo_grande.png';
import api from '../services/axios';

const Login = ({ navigation }) => {
  const navigate = useNavigation();
  const [usuario, setUsuario] = useState('');
  const toastRef = useRef();
  const [loading, setLoading] = useState(false);

  async function cadastrarUsuario() {
    if (usuario.length !== 11) {
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get('http://tedie.azurewebsites.net/api/Clientes');
      const existPhone = response.data.find((user) => user.Telefone === usuario);

      if (existPhone) {
        toastRef.current?.show('Telefone já existe', 2000);
        return;
      }
      const user = await api.post('api/Clientes', {
        nomecliente: '',
        apelido: '',
        datanasc: '',
        email: '',
        cpf: '',
        senha: '',
        Telefone: usuario,
      });

      setLoading(false);
      navigate.navigate('Authenticate', { id: user.data.IdCliente });
    } catch (e) {
      setLoading(false);
      console.log(e);
      toastRef.current?.show('Erro', 2000);
    }
  }

  return (
    <>

      <StatusBar backgroundColor={theme.palette.primary} />
      <Toast
        ref={toastRef}
        style={{ backgroundColor: 'white' }}
        opacity={0.8}
        textStyle={{ color: 'black' }}
      />

      <View style={styles.container}>
        <Box direction="column" justify="center" alignItems="center">
          <Image source={logo} style={{ width: 140, height: 200, resizeMode: 'contain' }} />
        </Box>
        <TextField
          width="100%"
          label="Telefone"
          keyboardType="decimal-pad"
          labelColor="#fff"
          borderColor={theme.palette.secondary}
          value={usuario}
          setValue={setUsuario}
        />
        <Box direction="row" justify="center" alignItems="center">
          <Button
            background="#fff"
            color={theme.palette.primary}
            width="80%"
            text="Cadastrar"

            customComponent={loading && <ActivityIndicator size="large" color="#d70d0f" />}
            onPress={() => (loading ? '' : cadastrarUsuario())}
          />
        </Box>
        <Box direction="row" justify="center" alignItems="center">
          <Button
            background="#fff"
            color={theme.palette.primary}
            width="80%"
            text="Entrar"
            onPress={() => navigate.navigate('Login')}
          />
        </Box>
      </View>

    </>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.palette.primary,
  },
  logoPlaceholder: {
    fontSize: 48,
    fontWeight: 'bold',
    color: theme.palette.secondary,
  },
});

export default Login;
