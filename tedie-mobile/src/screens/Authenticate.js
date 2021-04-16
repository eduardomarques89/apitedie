import React, {
  useContext, useRef, useState,
} from 'react';
import {
  StyleSheet, View, TextInput, Text, Image, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Box from '../components/Box';
import theme from '../theme';
import { AppContext } from '../contexts/AppContext';
import logo from '../assets/logo_amarelo_grande.png';
import Typography from '../components/Typography';

import api from '../services/axios';

const initialCode = {
  code1: '',
  code2: '',
  code3: '',
  code4: '',
  code5: '',
};

const Login = ({ route }) => {
  const navigate = useNavigation();
  const [code, setCode] = useState(initialCode);

  const [loading, setLoading] = useState(false);
  const refArray = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const { state, dispatch } = useContext(AppContext);
  const { id, telefone } = route.params;

  async function changeText(index, value, codes) {
    if (value !== '0' && !Number(value) && value !== '') {
      setLoading(false);
      return;
    }
    setCode((props) => ({ ...props, [codes]: value[value.length - 1] }));

    if (!refArray[index + 1] && value !== '') {
      setLoading(true);
      try {
        const response = await api.post(`http://tedie.azurewebsites.net/api/auth/Codigo/${id}?codigo=${code.code0}${code.code1}${code.code2}${code.code3}${code.code4}${value[value.length - 1]}&telefone=55${telefone}`);
        if (response.data.Status !== 'OK') {
          alert('erro,tente novamente');
          setCode(initialCode);
          setLoading(false);
          return;
        }
        dispatch({
          type: 'createSessao',
          payload: {
            sessao: {
              IdCliente: response.data.Id,
            },
          },
        });
        setLoading(false);
        const resetAction = CommonActions.reset({
          index: 0,
          routes: [
            { name: 'tabs' },
          ],
        });
        navigate.dispatch(resetAction);
      } catch {
        setLoading(false);
        setCode(initialCode);
        alert('erro,tente novamente');
      }
    } else if (value !== '' || value === '0' && !refArray[index + 1]) {
      refArray[index + 1].current.focus();
    }
  }

  return (
    <>

      {loading && (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#d70d0f" />
      </View>
      )}
      <View style={styles.container}>
        <View style={{ marginTop: 16, alignSelf: 'flex-start' }}>
          <TouchableOpacity
            hitSlop={theme.hitSlop}
            onPress={() => {
              if (navigate.canGoBack()) {
                navigate.goBack();
              }
            }}
          >
            <Ionicons name="md-arrow-back" size={25} color="#fff" />
          </TouchableOpacity>
        </View>
        <Box direction="column" justify="center" alignItems="center">
          <Image source={logo} style={{ width: 140, height: 180, resizeMode: 'contain' }} />
        </Box>

        <Text style={styles.text}>Insira o Código de autenticação</Text>
        <View style={styles.containerNumber}>
          <TextInput
            style={styles.number}
            keyboardType="decimal-pad"
            ref={refArray[0]}
            value={code.code0}
            onChangeText={(e) => changeText(0, e, 'code0')}
          />
          <TextInput
            style={styles.number}
            keyboardType="decimal-pad"
            ref={refArray[1]}
            value={code.code1}
            onChangeText={(e) => changeText(1, e, 'code1')}
          />
          <TextInput
            style={styles.number}
            keyboardType="decimal-pad"
            ref={refArray[2]}
            value={code.code2}
            onChangeText={(e) => changeText(2, e, 'code2')}
          />
          <TextInput
            style={styles.number}
            keyboardType="decimal-pad"
            ref={refArray[3]}
            value={code.code3}
            onChangeText={(e) => changeText(3, e, 'code3')}
          />
          <TextInput
            style={styles.number}
            keyboardType="decimal-pad"
            ref={refArray[4]}
            value={code.code4}
            onChangeText={(e) => changeText(4, e, 'code4')}
          />
          <TextInput
            style={styles.number}
            keyboardType="decimal-pad"
            ref={refArray[5]}
            value={code.code5}
            onChangeText={(e) => changeText(5, e, 'code5')}
          />
        </View>
        <View style={{ marginTop: 16, alignSelf: 'flex-end' }}>
          <Box direction="row" alignSelf="flex-end" alignItems="flex-end">
            <TouchableOpacity onPress={async () => {
              setLoading(true);
              try {
                await api.post(`auth/Telefone?idcliente=${id}&telefone=55${telefone}`);
              } catch {
                alert('Error, tente novamente');
              } finally {
                setLoading(false);
              }
            }}
            >
              <Typography size="small" color="#fff">
                Reenviar código
              </Typography>
            </TouchableOpacity>
          </Box>

        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  loadingScreen: {
    position: 'absolute',
    zIndex: 10,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  container: {
    flex: 1,
    backgroundColor: theme.palette.primary,
    alignItems: 'center',
    // justifyContent:'center',
    paddingHorizontal: 16,
  },
  containerNumber: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  number: {
    width: 50,
    height: 70,
    fontSize: 20,
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 64,
  },
  logoPlaceholder: {
    fontSize: 48,
    fontWeight: 'bold',
    color: theme.palette.secondary,
  },
});

export default Login;
