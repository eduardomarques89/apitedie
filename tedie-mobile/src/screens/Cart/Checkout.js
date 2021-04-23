import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  ActivityIndicator,
  StatusBar,
  Modal,
} from 'react-native';
import '@expo/browser-polyfill';

import * as Location from 'expo-location';
import JunoCardHash from 'react-native-juno-rn-card-hash';
import { Ionicons } from '@expo/vector-icons';
// theme
import Toast from 'react-native-easy-toast';
import { useNavigation, CommonActions } from '@react-navigation/native';
import axios from 'axios';
import theme from '../../theme';
import { getLocationByLatLong } from '../../services/locations';
// components
import Navbar from '../../components/Navbar';
import Typography from '../../components/Typography';
import ScreenContainer from '../../components/ScreenContainer';
import ContentContainer from '../../components/ContentContainer';
import Divider from '../../components/Divider';
import Button from '../../components/Button';
import RadioButton from '../../components/RadioButton';
import Box from '../../components/Box';
import { CartContext } from '../../contexts/CartContext';
import { CheckoutContext } from '../../contexts/CheckoutContext';
import { AppContext } from '../../contexts/AppContext';
import api from '../../services/axios';
import refactoreLocalization from '../../utils/refactoreLocalization';

const Juno = new JunoCardHash('7ACA5244C520E4641C6E636E11AE9F05073D1B779B64825BD0F9DDFE44D9C954', 'sandbox');

const Checkout = ({ navigation, route }) => {
  const navigate = useNavigation();
  const toastRef = useRef();
  const [selectedPayment, setSelectedPayment] = useState({ value: 'Na retirada ou entrega', id: 2 });
  const { cartState, cartDispatch } = useContext(CartContext);
  const { checkoutState, checkoutDispatch } = useContext(CheckoutContext);
  const { state, dispatch } = useContext(AppContext);
  const [showCartao, setShowCartao] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  async function changeCartao() {
    if (!checkoutState.cartaoPorEstabelecimento.IdCartao) return;
    const selected = checkoutState.cartaoPorEstabelecimento;
    if (!selected) {
      return;
    }
    setShowCartao(selected.split('').filter((index, i) => i < 4).join(' '));
    setSelectedPayment({ value: 'Cartão de crédito', id: 1 });
  }

  useEffect(() => {
    changeCartao();
  }, [checkoutState.cartaoPorEstabelecimento]);

  useEffect(() => {
    async function fetchData() {
      const { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        toastRef.current?.show('Permissão para acessar localização foi negada', 3000);
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const local = await getLocationByLatLong(location.coords.latitude, location.coords.longitude);
      const locations = local.results.map(refactoreLocalization);
      try {
        const response = await api.post('Enderecos', {
          IdCliente: state?.sessao?.IdCliente,
          Endereco: locations[0].Endereco,
          Bairro: locations[0].Bairro,
          Cidade: locations[0].Cidade,
          UF: locations[0].UF.toUpperCase(),
          CEP: locations[0].CEP.split('-').join(''),
          Num: locations[0].Num,
          Complemento: '',
          Latitude: locations[0].latitude,
          Longitude: locations[0].longitude,
          Padrao: locations[0].Padrao,
          Beautify: locations[0].Endereco,
        });
        const action = { type: 'setEnderecoEntregaPorEstabelecimento', payload: { enderecoEntregaPorEstabelecimento: response.data[0] } };
        checkoutDispatch(action);
      } catch {

      }
    }
    fetchData();
  }, []);

  async function pedidoConfirmado() {
    const actionCart = { type: 'CLEAR_CART' };
    cartDispatch(actionCart);
    checkoutDispatch(actionCart);
    setModalVisible(true);
  }

  async function postPagamento(codigoTransacao, valor, endereco) {
    const cartao = checkoutState.cartaoPorEstabelecimento;
    const cardData = {
      cardNumber: cartao?.Numero?.split(' ').join('') || '',
      holderName: cartao.Titular,
      securityCode: cartao.CVV.trim(),
      expirationMonth: cartao.Validade.split('/')[0],
      expirationYear: cartao.Validade.split('/')[1],
    };
    const cardHash = await Juno.getCardHash(cardData);

    const cardId = await axios.post('https://sandbox.boletobancario.com/boletofacil/integration/api/v1/card-tokenization', {}, {
      params: {
        token: '5D2446161015CC472AB6440E8D99516AA1E041BD6AA1CDBA9794C1D61DEB9852',
        creditCardHash: cardHash,
      },
    });
    const { data } = await axios.post('https://sandbox.boletobancario.com/boletofacil/integration/api/v1/issue-charge', {}, {
      params: {
        token: '5D2446161015CC472AB6440E8D99516AA1E041BD6AA1CDBA9794C1D61DEB9852',
        description: codigoTransacao,
        amount: valor,
        billingAddressStreet: 'null',
        payerName: cartao.Titular,
        payerCpfCnpj: state.cpf.match(/\d+/g)?.join(''),
        creditCardStore: false,
        creditCardId: cardId.data.data.creditCardId,
        paymentTypes: 'CREDIT_CARD',
        billingAddressNumber: endereco.Num,
        billingAddressNeighborhood: endereco.Bairro,
        billingAddressCity: endereco.Cidade,
        billingAddressState: endereco.UF,
        billingAddressPostcode: endereco.CEP,
        payerEmail: 'wi3147383@wi7h.com.br',
      },
    });
    return { code: data.data.charges[0].code, status: data.data.charges[0].payments[0].status };
  }

  function createOrderItem(product, NumeroPedido, IdEmpresa) {
    const {
      Data,
    } = checkoutState.horarioEntregaPorEstabelecimento[IdEmpresa];
    const item = {
      IdProduto: product.product.Id,
      NumeroPedido,
      Data,
      Valor: product.quantity * product.product.Preco_Por,
      Quantidade: product.quantity,
      Desconto: '',
      Status: product.product.Status,
      Observacao: '',
    };
    return api.post('PedidosItem', item);
  }

  function createOrder(market, codigoTransacao, junoValues, NumeroPedido) {
    const IdCupom = market.market.IdEmpresa === checkoutState.cupom?.IdEmpresa ? checkoutState.cupom.IdCupom : 0;
    const Desconto = market.market.IdEmpresa === checkoutState.cupom?.Valor ? checkoutState.cupom.IdCupom : 0;

    const {
      Bairro, CEP, IdEndereco, Cidade, Complemento, Num, UF, Endereco,
    } = checkoutState?.enderecoEntregaPorEstabelecimento;
    const {
      TIPOENTREGA, IdHorario, DiaSemana, horario, IdDiaSemana, Data, IdTipoEntrega,
    } = checkoutState.horarioEntregaPorEstabelecimento[market.market.IdEmpresa];

    const pedido = {
      nomecliente: '',
      apelido: '',
      email: '',
      cpf: state?.cpf || '',
      senha: '',
      codigo_transacao: codigoTransacao,
      IdCliente: state.sessao.IdCliente,
      IdTipoEntrega,
      IdHorario,
      IdCupom,
      IdEmpresa: market.market.IdEmpresa,
      IdFormaPagamento: selectedPayment.id,
      IdDiaSemana,
      IdEndereco,
      NumeroPedido,
      Data: new Date(),
      Valor: Number(market.total) + Number(market.tax),
      Desconto,
      Taxa: market.tax,
      TipoEntrega: TIPOENTREGA,
      DiaSemana,
      Horario: horario,
      Endereco,
      Bairro,
      Cidade,
      UF,
      CEP: CEP.replace('-', ''),
      Num,
      Complemento,
      FormaPagamento: selectedPayment.value,
      QtdeParcela: 1,
      Observacao: '',
      status: 'aguardando pagamento',
      DataFinal: Data,
      codigoJuno: '',
    };

    if (selectedPayment.value === 'Cartão de crédito') {
      pedido.IdCartao = checkoutState.cartaoPorEstabelecimento.IdCartao;
      pedido.status = junoValues.status;
      pedido.codigoJuno = junoValues.codeJuno;
    }

    return api.post('Pedidos', pedido);
  }

  function verifyDatas() {
    if (!checkoutState?.enderecoEntregaPorEstabelecimento?.Endereco) {
      return { status: false, error: 'Selecione o endereço' };
    }

    let horarioOk = true;
    cartState.markets.forEach((market) => {
      if (!checkoutState.horarioEntregaPorEstabelecimento[market.market.IdEmpresa]) {
        horarioOk = false;
      }
    });
    if (!horarioOk) {
      return { status: false, error: 'Selecione o horário de entrega' };
    }

    const IdCartao = checkoutState.cartaoPorEstabelecimento?.IdCartao;
    if (!IdCartao && selectedPayment.value === 'Cartão de crédito') {
      return { status: false, error: 'Selecione um cartão' };
    }

    if (selectedPayment.value === 'Cartão de crédito' && !state?.cpf) {
      return { status: false, error: 'Digite um cpf' };
    }

    return { status: true, error: '' };
  }

  async function fazerPedido() {
    const codigoTransacao = (Math.random() * 1000000).toFixed(0);

    const verify = verifyDatas();

    if (!verify.status) {
      toastRef.current?.show(verify.error, 2000);
      return;
    }

    setLoading(true);
    const totalWithTax = cartState.markets.reduce((prev, market) => prev + Number(market.total) + Number(market.tax), 0);
    try {
      const junoValues = {};
      if (selectedPayment.value === 'Cartão de crédito') {
        const juno = await postPagamento(codigoTransacao, totalWithTax, checkoutState?.enderecoEntregaPorEstabelecimento);
        junoValues.status = juno.status;
        junoValues.codeJuno = juno.code;
      }
      let productsPush = [];
      const promises = cartState.markets.map((market) => {
        const NumeroPedido = (Math.random() * 1000000).toFixed(0);
        productsPush = [...productsPush, ...cartState.products.filter((product) => product.product.IdEmpresa === market.market.IdEmpresa).map((product) => createOrderItem(product, NumeroPedido, market.market.IdEmpresa))];

        return createOrder(market, codigoTransacao, junoValues, NumeroPedido);
      });

      console.log('oioi');
      await Promise.all(promises);
      await Promise.all(productsPush);
      pedidoConfirmado();
    } catch (e) {
      console.log(e);
      alert('ocorreu algum error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}

      >
        <View style={styles.centeredViewModal}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Pedido foi realizado com sucesso</Text>
            <Text style={styles.modalText}>{selectedPayment.id === 2 ? 'Aguardando pagamento' : 'Pagamento realizado'}</Text>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setModalVisible(!modalVisible);
                const resetAction = CommonActions.reset({
                  index: 0,
                  routes: [
                    { name: 'tabs' },
                  ],
                });
                navigate.dispatch(resetAction);
              }}
            >
              <Text style={styles.textStyle}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      { loading
    && (
    <View style={styles.loadingScreen}>
      <ActivityIndicator size="large" color="#d70d0f" />
    </View>
    )}
      <Toast
        ref={toastRef}
        style={{ backgroundColor: 'black' }}
        opacity={0.8}
        textStyle={{ color: 'white' }}
      />

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
            Checkout
          </Typography>
        )}
      />

      <ScreenContainer>

        {/* Delivery Location */}
        <ContentContainer>
          <TouchableWithoutFeedback onPress={() => navigation.navigate('LocalizaçõesCheckout', { checkoutEdit: true })}>
            <View style={styles.locationOuterContainer}>
              <Typography size="caption" color={theme.palette.light}>
                Entregar em
              </Typography>

              <View style={styles.locationContainer}>
                <Ionicons name="md-locate" size={25} color={theme.palette.primary} />

                <View style={styles.locationInfo}>
                  <Typography size="small" color={theme.palette.dark}>
                    {checkoutState?.enderecoEntregaPorEstabelecimento?.Endereco || 'Selecione'}
                  </Typography>
                </View>

                <Ionicons name="ios-arrow-forward" size={25} color={theme.palette.primary} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ContentContainer>
        {/* End Delivery Location */}

        {cartState.markets.length > 0 && cartState.markets.map((market, index) => (
          <View key={market.market.IdEmpresa}>
            <ContentContainer>
              <View style={styles.pricesOuterContiner}>
                <Typography size="large" color={theme.palette.dark}>
                  {market.market.Nome}
                </Typography>

                <Divider />

                <View style={styles.priceContainer}>
                  <Typography size="small" color={theme.palette.light}>
                    Total em produtos
                  </Typography>
                  <Typography size="small" color={theme.palette.light}>
                    R$
                    {' '}
                    {(market.total || 0)?.toFixed(2).replace('.', ',') ?? '0,00'}
                  </Typography>
                </View>

                <View style={styles.priceContainer}>
                  <Typography size="small" color={theme.palette.light}>
                    Entrega
                  </Typography>
                  <Typography size="small" color={theme.palette.light}>

                    {`R$ ${(market.tax || 0).toFixed(2).replace('.', ',')}`}
                  </Typography>
                </View>

                <Divider />

                <View style={styles.priceContainer}>
                  <Typography size="medium" color={theme.palette.dark}>
                    TOTAL
                  </Typography>
                  <Typography size="medium" color={theme.palette.dark}>
                    {`R$ ${((Number(market.total) + Number(market.tax)) || 0).toFixed(2).replace('.', ',')} `}
                  </Typography>
                </View>
              </View>
              <Divider />
              <Typography size="small" color={theme.palette.dark}>
                Dados da Entrega/Retirada
              </Typography>
              <TouchableOpacity onPress={() => navigation.navigate('Entrega', { IdEmpresa: market.market.IdEmpresa })}>
                <Box direction="row" justify="space-between" alignItems="center">
                  <Box direction="column" justify="center" alignItems="flex-start">
                    <Typography size="small" color={theme.palette.light}>
                      {checkoutState.horarioEntregaPorEstabelecimento[`${market.market.IdEmpresa}`]?.TIPOENTREGA || 'Tipo'}
                    </Typography>
                    <Typography size="small" color={theme.palette.light}>
                      {checkoutState.horarioEntregaPorEstabelecimento[`${market.market.IdEmpresa}`]?.Data ? checkoutState.horarioEntregaPorEstabelecimento[`${market.market.IdEmpresa}`]?.DataFormat : 'Data'}
                    </Typography>
                    <Typography size="small" color={theme.palette.light}>
                      {checkoutState.horarioEntregaPorEstabelecimento[`${market.market.IdEmpresa}`]?.horario || 'Horário'}
                    </Typography>
                  </Box>

                  <Typography size="small" color={theme.palette.primary}>
                    Trocar
                  </Typography>
                </Box>
              </TouchableOpacity>
            </ContentContainer>
          </View>
        ))}

        {/* Coupons */}
        <TouchableOpacity onPress={() => navigation.navigate('Cupons')}>
          <ContentContainer>
            <View style={styles.couponContainer}>
              <Ionicons name="md-pricetag" size={25} color={checkoutState.cupom ? theme.palette.primary : theme.palette.light} />

              <View style={styles.couponTextContainer}>
                <Typography size="small" color={theme.palette.light}>
                  {checkoutState.cupom
                    ? `${checkoutState.cupom?.NomeCupom} - R$ ${checkoutState.cupom?.Valor.toFixed(2).replace('.', ',')}`
                    : 'Selecionar Cupom'}
                </Typography>
              </View>

              <Ionicons name="ios-arrow-forward" size={25} color={theme.palette.primary} />
            </View>
          </ContentContainer>
        </TouchableOpacity>
        {/* End Coupons */}

        {/* Payment methods */}
        <ContentContainer>
          <View style={styles.paymentContainer}>
            <Typography size="large" color={theme.palette.dark}>
              Pagamento
            </Typography>

            <Divider />

            <View style={styles.paymentMethodContainer}>
              <View style={styles.paymentContainer}>
                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => setSelectedPayment({ value: 'Cartão de crédito', id: 1 })}>
                  <RadioButton selected={selectedPayment.value === 'Cartão de crédito'} />
                  <View>
                    <Typography size="small" color={theme.palette.dark}>
                      Pagar Agora
                    </Typography>
                    <Typography size="small" color={theme.palette.light}>
                      {showCartao
                        && (
                        <>
                          {showCartao}
                        </>
                        )}
                    </Typography>
                  </View>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('Pagamentos')}>
                <Typography size="small" color={theme.palette.primary}>
                  Trocar
                </Typography>
              </TouchableOpacity>
            </View>
            <View style={styles.paymentMethodContainer}>
              <View style={styles.paymentContainer}>
                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => setSelectedPayment({ value: 'Na retirada ou entrega', id: 2 })}>

                  <RadioButton selected={selectedPayment.value === 'Na retirada ou entrega'} />
                  <Typography size="small" color={theme.palette.dark}>
                    Pagar na entrega ou retirada
                  </Typography>

                </TouchableOpacity>
              </View>
            </View>

            <Divider />
            {
                        state?.sessao?.IdCliente

            && (
            <TouchableOpacity onPress={() => navigation.navigate('Documento')}>
              <View style={styles.paymentMethodContainer}>
                <View style={styles.paymentContainer}>
                  <Typography size="small" color={theme.palette.dark}>
                    CPF/CNPJ na Nota
                  </Typography>
                  <Typography size="small" color={theme.palette.light}>
                    {state?.cpf?.replace(/(\d{3})?(\d{3})?(\d{3})?(\d{2})/g, '$1.$2.$3-$4') || '123.456.789-00'}
                  </Typography>
                </View>

                <Typography size="small" color={theme.palette.primary}>
                  Trocar
                </Typography>
              </View>
            </TouchableOpacity>
            )
                      }
          </View>
        </ContentContainer>
        {/* End Payment Methods */}
        { !state?.sessao?.IdCliente

          && (
          <ContentContainer>
            <TouchableWithoutFeedback onPress={() => navigation.navigate('Login')}>
              <View style={styles.login}>
                <View>
                  <Typography size="medium" color={theme.palette.dark}>
                    Acessar
                  </Typography>
                  <Typography size="caption" color={theme.palette.light}>
                    <Text style={{ color: theme.palette.primary }}>

                      Entre
                    </Text>
                    <Text>

                      {' ou '}
                    </Text>
                    <Text style={{ color: theme.palette.primary }}>

                      cadastre-se
                    </Text>
                  </Typography>

                </View>

                <Ionicons name="ios-arrow-forward" size={25} color={theme.palette.light} />
              </View>
            </TouchableWithoutFeedback>
          </ContentContainer>
          )}
        {
          state?.sessao?.IdCliente && (
            <Button
              background={theme.palette.primary}
              color="#fff"
              width="100%"
              text="Fazer pedido"
              onPress={fazerPedido}
            />

          )
        }
      </ScreenContainer>
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    minWidth: 80,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: theme.palette.primary,
  },
  locationOuterContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  login: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginTop: 8,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  email: {
    paddingLeft: 8,
    marginTop: 8,
    fontSize: 18,
  },
  locationInfo: {
    maxWidth: 200,
    marginHorizontal: 16,
  },

  pricesOuterContiner: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    textShadowColor: 'black',
    elevation: 2,
  },
  priceContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  couponContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
  },

  paymentContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  paymentMethodContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  centeredViewModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,.4)',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default Checkout;
