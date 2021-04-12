import React, { useContext, useEffect } from 'react';
import {
  StyleSheet, TouchableOpacity, View, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// components
import { useNavigation } from '@react-navigation/native';
import { useFormik } from 'formik';
import Navbar from '../../components/Navbar';
import Typography from '../../components/Typography';
import ScreenContainer from '../../components/ScreenContainer';
import Box from '../../components/Box';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
// theme
import theme from '../../theme';
import api from '../../services/axios';
import { AppContext } from '../../contexts/AppContext';

const initialValues = {
  Nome: '',
  SobreNome: '',
  Apelido: '',
  dataNasc: '',
  Telefone: '',
  Email: '',
  CPF: '',
};

const Profile = ({ navigation }) => {
  const { state } = useContext(AppContext);
  const navigate = useNavigation();
  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
    },
  });

  async function handleSubmit() {
    const variables = {
      IdCliente: state?.sessao?.IdCliente,
      Apelido: formik.values.Apelido,
      dataNasc: '',
      Telefone: `55${formik.values.Telefone}`,
      Email: formik.values.Email,
      CPF: formik.values.CPF,
      NomeCliente: `${formik.values.Nome} ${formik.values.SobreNome}`,
      sexo: '',
      codigo_indicacao: '',
    };
    try {
      await api.put('clientes/PutCliente', variables);
      alert('Dados salvos');
    } catch (e) {
      alert('erro');
    }
  }

  return (
    <>

      <StatusBar backgroundColor={theme.palette.primary} />
      <Navbar
        left={(
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
        )}
        title={(
          <Typography size="small" color="#fff">
            Seus Dados
          </Typography>
        )}
      />

      <ScreenContainer>
        <View style={styles.formContainer}>
          <Box direction="row" justify="center" alignItems="center">
            <TextField
              width="50%"
              label="Nome"
              setValue={(value) => formik.setFieldValue('Nome', value)}
              value={formik.values.Nome}
            />
            <TextField
              width="50%"
              label="Sobrenome"
              setValue={(value) => formik.setFieldValue('Sobrenome', value)}
              value={formik.values.SobreNome}
            />
          </Box>

          <Box direction="row" justify="center" alignItems="center">
            <TextField
              label="E-mail"
              setValue={(value) => formik.setFieldValue('Email', value)}
              value={formik.values.Email}
            />
          </Box>

          <Box direction="row" justify="center" alignItems="center">
            <TextField
              label="Telefone"
              setValue={(value) => formik.setFieldValue('Telefone', value)}
              value={formik.values.Telefone}
            />
          </Box>

          <Box direction="row" justify="center" alignItems="center">
            <TextField
              label="CPF"
              setValue={(value) => formik.setFieldValue('CPF', value)}
              value={formik.values.CPF}
            />
          </Box>
        </View>

        <Button
          background={theme.palette.secondary}
          color={theme.palette.primary}
          width="100%"
          text="Salvar"
          onPress={handleSubmit}
        />
      </ScreenContainer>
    </>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
});

export default Profile;
