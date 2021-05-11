import React, { useEffect, useState, useContext } from 'react';
import {
  StyleSheet, TouchableOpacity, TextInput, View, StatusBar,
} from 'react-native';
// import {Picker } from 'react-native-community/picker'
import { Ionicons } from '@expo/vector-icons';
// component

import JunoCardHash from 'react-native-juno-rn-card-hash';
import { useNavigation } from '@react-navigation/native';
import { useFormik } from 'formik';
import { AppContext } from '../contexts/AppContext';
import Navbar from '../components/Navbar';
import ScreenContainer from '../components/ScreenContainer';
import Typography from '../components/Typography';
import Loader from '../components/Loader';
import Button from '../components/Button';
import formatCPFOrCNPJ from '../utils/formatCPFOrCNPJ';
// theme
import theme from '../theme';
import api from '../services/axios';
import addCardSchema from '../validations/addCardSchema';

const Juno = new JunoCardHash('7ACA5244C520E4641C6E636E11AE9F05073D1B779B64825BD0F9DDFE44D9C954', 'sandbox');

const initialValues = {
  Numero: '',
  Titular: '',
  CPF: '',
  Validade: '',
  CVV: '',
  NOMECARTAO: '',
  IdCartao: '',
};
const Card = ({ navigation, route }) => {
  const { state, dispatch } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigation();
  const formik = useFormik({
    initialValues,
    onSubmit(values, { resetForm }) {
      async function fech() {
        const cartao = {
          IdCliente: state.sessao.IdCliente,
          Numero: values.Numero,
          Validade: values.Validade,
          CPF: values.CPF,
          Titular: values.Titular,
          CVV: values.CVV,
        };
        try {
          await api.post('clientes/PostCartao', cartao);
          resetForm();
          navigation.pop();
        } catch (e) {
          alert('cartao indisponivel');
        }
      }
      fech();
    },
    validationSchema: addCardSchema,
  });

  async function salvarCartao() {
    setLoading(true);
    const cartao = {
      IdCliente: state.sessao.IdCliente,
      Numero: formik.values.Numero,
      Validade: formik.values.Validade,
      CPF: formik.values.CPF,
      Titular: formik.values.Titular,
      CVV: formik.values.CVV.trim(),
      IdBandeira: '',
    };
    if (route?.params?.editCard) {
      cartao.IdCartao = formik.values.IdCartao;
    }

    if (!(await addCardSchema.isValid(cartao))) {
      alert('Cartão invalido');
      setLoading(false);
      return;
    }
    try {
      const cardData = {
        cardNumber: cartao?.Numero?.split(' ').join('') || '',
        holderName: cartao.Titular,
        securityCode: cartao.CVV.trim(),
        expirationMonth: cartao.Validade.split('/')[0],
        expirationYear: cartao.Validade.split('/')[1],
      };
      await Juno.getCardHash(cardData);
      if (route?.params?.editCard) {
        await api.put('clientes/PutCartao', cartao);
      } else {
        await api.post('clientes/PostCartao', cartao);
      }

      alert('cartao salvo');
      setLoading(false);
      formik.resetForm();
    } catch (e) {
      console.log(e);
      alert('cartao indisponivel');
      setLoading(false);
    }
  }

  function formatDate(value) {
    let newValue = value.match(/\d+/g)?.join('') || '';
    if (newValue.length > 6) {
      return;
    }
    newValue = newValue.replace(/\D/g, '');
    newValue = newValue.replace(/^(\d{2})(\d+)/g, '$1/$2');
    formik.setFieldValue('Validade', newValue);
  }

  function formatCardNumber(value) {
    let newValue = value.match(/\d+/g)?.join('') || '';
    if (newValue.length > 16) {
      return;
    }
    newValue = newValue.replace(/\D/g, '');
    newValue = newValue.replace(/^(\d{4})(\d)/g, '$1 $2');
    newValue = newValue.replace(/^(\d{4})\s(\d{4})(\d)/g, '$1 $2 $3');
    newValue = newValue.replace(
      /^(\d{4})\s(\d{4})\s(\d{4})(\d)/g,
      '$1 $2 $3 $4',
    );

    formik.setFieldValue('Numero', newValue);
  }

  useEffect(() => {
    if (route.params?.editCard) {
      formik.setValues({ ...route.params.card, CVV: route.params.card.CVV.trim() });
    }
  }, [route.params?.editCard]);

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
            Novo Cartão
          </Typography>
        )}
      />
      <Loader show={loading} />
      {!loading && (
      <ScreenContainer>
        <View style={styles.paymentMethodContainer}>
          <View style={styles.paymentContainer}>
            <Typography size="small" color="#b5b5b5">
              Informe os dados
            </Typography>
            <TextInput
              style={styles.textInput}
              keyboardType="decimal-pad"
              value={formik.values.Numero}
              onChangeText={(value) => formatCardNumber(value)}
              placeholder="Número do Cartão"
            />

            <TextInput
              style={styles.textInput}
              keyboardType="decimal-pad"
              placeholder="Validade"
              value={formik.values.Validade}
              onChangeText={formatDate}
            />

            <TextInput
              style={styles.textInput}
              value={formik.values.CVV}
              placeholder="CVV"
              keyboardType="decimal-pad"
              onChangeText={(e) => {
                if (e.length > 3) {
                  return;
                }
                formik.setFieldValue('CVV', e);
              }}
            />

            <TextInput
              style={styles.textInput}
              onChangeText={(e) => formik.setFieldValue('Titular', e)}
              value={formik.values.Titular}
              placeholder="Nome do Titular"

            />

            <TextInput
              style={styles.textInput}
              value={formik.values.CPF}
              keyboardType="decimal-pad"
              placeholder="CPF / CNPJ"
              onChangeText={(e) => {
                formik.setFieldValue(
                  'CPF',
                  formatCPFOrCNPJ(e, formik.values.CPF),
                );
              }}
            />
          </View>

        </View>

        <View style={styles.confirmButton}>
          <Button
            background={theme.palette.secondary}
            color={theme.palette.primary}
            width="50%"
            text="Salvar"
            onPress={salvarCartao}
          />

        </View>
      </ScreenContainer>

      )}
    </>
  );
};

export default Card;

const styles = StyleSheet.create({
  textInput: {
    width: '90%',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fafafa',
    borderRadius: 1,
    borderWidth: 1,
    borderColor: '#b5b5b5',
    marginVertical: 8,
  },

  confirmButton: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  paymentContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  paymentMethodContainer: {
    width: '100%',
    marginVertical: 16,
  },
});
