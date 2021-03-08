import React, { useContext, useRef, useState } from 'react'
import { StyleSheet, View, Image, StatusBar } from 'react-native'
// theme
import TextField from '../components/TextField'
import Box from '../components/Box'
import Button from '../components/Button'
import theme from '../theme'
import Typography from '../components/Typography'
import { login, postCliente } from '../services/clients'
import { AppContext } from '../contexts/AppContext'
import Toast from 'react-native-easy-toast'
import {useNavigation} from '@react-navigation/native'
import logo from '../assets/logo_amarelo_grande.png'

const Login = ({ navigation }) => {
  const navigate = useNavigation()
  const [activePage, setActivePage] = useState('login')
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('123123')
  const [sobrenome, setSobrenome] = useState('')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [cpf, setCpf] = useState('')
  const [nascimento, setNascimento] = useState('')
  const toastRef = useRef();
  const { state, dispatch } = useContext(AppContext);

  async function handleLogin() {
    navigate.navigate('Authenticate')
  }


  async function cadastrarUsuario() {
  }

  return (
    <React.Fragment>

      <StatusBar backgroundColor={theme.palette.primary} />
      <Toast ref={toastRef}
        style={{ backgroundColor: 'white' }}
        opacity={0.8}
        textStyle={{ color: 'black' }} />

      <View style={styles.container}>
          <Box direction="column" justify="center" alignItems="center">
           <Image source={logo} style={{width:140,height:200,resizeMode:'contain'}}/>
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
            text="Entrar ou Cadastrar"
            onPress={() => handleLogin()}
          />
        </Box> 
      </View>

    </React.Fragment>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.palette.primary
  },
  logoPlaceholder: {
    fontSize: 48,
    fontWeight: 'bold',
    color: theme.palette.secondary
  }
})

export default Login


