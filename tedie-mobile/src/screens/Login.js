import React, { useRef, useState, useContext } from 'react';
import {
  StyleSheet, View, Image, StatusBar,
  ActivityIndicator, TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
// theme
import Toast from 'react-native-easy-toast';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import theme from '../theme';
import Typography from '../components/Typography';
import Box from '../components/Box';
import TextField from '../components/TextField';
import Button from '../components/Button';
import logo from '../assets/logo_amarelo_grande.png';
import api from '../services/axios';
import { AppContext } from '../contexts/AppContext';

const Login = ({ navigation }) => {
  const navigate = useNavigation();
  const [usuario, setUsuario] = useState('');
  const [loading, setLoading] = useState(false);
  const toastRef = useRef();
  const { state, dispatch } = useContext(AppContext);

  async function handleLogin() {
    if (usuario.length > 11 || usuario.length < 10) {
      return;
    }
    setLoading(true);
    try {
      const user = await api.get('Clientes');
      const existPhone = user.data.find((usera) => usera.Telefone === usuario);
      if (!existPhone) {
        toastRef.current?.show('Telefone não existe', 2000);
        alert('Telefone não existe');
        setLoading(false);
        return;
      }
      const token = await api.get('Token/1');
      dispatch({ type: 'getToken', payload: token.CodigoToken });

      const response = await api.post(`auth/Telefone?idcliente=${existPhone.IdCliente}&telefone=55${usuario}`);
      setLoading(false);
      navigate.navigate('Authenticate', { id: response.data.Id, telefone: usuario });
      return;
    } catch (e) {
      setLoading(false);
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
        <Box direction="column" justify="center" alignItems="center">
          <Typography size="small" color="#fff">
            Digite seu telefone com ddd
          </Typography>
        </Box>
        <TextField
          width="80%"
          keyboardType="decimal-pad"
          color="#ffffff"
          value={usuario}
          setValue={setUsuario}
        />

        <Box direction="row" justify="center" alignItems="center">
          <Button
            background="#fff"
            color={theme.palette.primary}
            width="80%"
            text="Entrar"
            customComponent={loading && <ActivityIndicator size="small" color="#d70d0f" />}
            onPress={() => (loading ? '' : handleLogin())}
          />
        </Box>
        <Box direction="row" justify="center" alignItems="center">
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Typography size="small" color="#fff">
              Quero me cadastrar
            </Typography>
          </TouchableOpacity>
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
