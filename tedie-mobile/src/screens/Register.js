import React, { useRef, useState } from 'react';
import {
  StyleSheet, View, Image, StatusBar, ActivityIndicator, TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
// theme
import Toast from 'react-native-easy-toast';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import theme from '../theme';
import Navbar from '../components/Navbar';
import Typography from '../components/Typography';
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
    if (usuario.length > 11 || usuario.length < 10) {
      return;
    }
    setLoading(true);
    try {
      const response = await api.get('Clientes');

      const existPhone = response.data.find((user) => user.Telefone === `55${usuario}`);

      if (existPhone) {
        toastRef.current?.show('Telefone já existe', 2000);
        setLoading(false);
        return;
      }
      const user = await api.post('Clientes', {
        nomecliente: '',
        apelido: '',
        datanasc: '',
        email: '',
        cpf: '',
        senha: '',
        Telefone: `55${usuario}`,
      });
      await api.post(`auth/Telefone?idcliente=${user.data.cliente.IdCliente}&telefone=55${usuario}`);
      setLoading(false);
      navigate.navigate('Authenticate', { id: user.data.IdCliente, telefone: usuario });
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
        <Box direction="column" justify="center" alignItems="center">
          <Typography size="small" color="#fff">
            Digite seu telefone com ddd
          </Typography>
        </Box>
        <TextField
          width="80%"
          keyboardType="decimal-pad"
          labelColor="#ffffff"
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
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Typography size="small" color="#fff">
              Já sou cadastrado
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
