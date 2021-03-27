import React, { useRef, useState, useContext } from 'react';
import {
  StyleSheet, View, Image, StatusBar,
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
import { AppContext } from '../contexts/AppContext';

const Login = ({ navigation }) => {
  const navigate = useNavigation();
  const [usuario, setUsuario] = useState('');
  const toastRef = useRef();
  const { state, dispatch } = useContext(AppContext);

  async function handleLogin() {
    try {
      const user = await api.get('Clientes');
      console.log('Oioio');
      const existPhone = user.data.find((usera) => usera.Telefone === usuario);
      if (!existPhone) {
        toastRef.current?.show('Telefone não existe', 2000);
        return;
      }
      const token = await api.get('Token/1');
      dispatch({ type: 'getToken', payload: token.CodigoToken });

      const response = await api.post(`auth/Telefone/?idcliente=${existPhone.IdCliente}&telefone=${usuario}`);
      navigate.navigate('Authenticate', { id: response.data.Id, telefone: usuario });
      return;
    } catch (e) {
      toastRef.current?.show('Erro', 2000);
    }
  }

  async function cadastrarUsuario() {
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
          keyboardType="name-phone-pad"
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
            text="Entrar"
            onPress={() => handleLogin()}
          />
        </Box>
        <Box direction="row" justify="center" alignItems="center">
          <Button
            background="#fff"
            color={theme.palette.primary}
            width="80%"
            text="Cadastrar"
            onPress={() => navigate.navigate('Register')}
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
