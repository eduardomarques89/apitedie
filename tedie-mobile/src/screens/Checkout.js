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
} from 'react-native';
import '@expo/browser-polyfill';

import * as Location from 'expo-location';
import JunoCardHash from 'react-native-juno-rn-card-hash';
import { Ionicons } from '@expo/vector-icons';
// theme
import Toast from 'react-native-easy-toast';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import theme from '../theme';
import { getLocationByLatLong } from '../services/locations';
// components
import Navbar from '../components/Navbar';
import Typography from '../components/Typography';
import ScreenContainer from '../components/ScreenContainer';
import ContentContainer from '../components/ContentContainer';
import Divider from '../components/Divider';
import Button from '../components/Button';
import RadioButton from '../components/RadioButton';
import Box from '../components/Box';
import { CartContext } from '../contexts/CartContext';
import { CheckoutContext } from '../contexts/CheckoutContext';
import { AppContext } from '../contexts/AppContext';
import { getMarketsListByIds } from '../services/market';
import api from '../services/axios';

const Juno = new JunoCardHash('7ACA5244C520E4641C6E636E11AE9F05073D1B779B64825BD0F9DDFE44D9C954', 'sandbox');

const Checkout = ({ navigation, route }) => {
  const navigate = useNavigation();
  const toastRef = useRef();
  const [selectedPayment, setSelectedPayment] = useState({ value: 'Na retirada ou entrega', id: 2 });
  const { cartState, cartDispatch } = useContext(CartContext);
  const { checkoutState, checkoutDispatch } = useContext(CheckoutContext);
  const { state, dispatch } = useContext(AppContext);
  // const [showHorario, setShowHorario] = useState("Tipo de entrega-Horário-0-0")
  const [showEndereco, setShowEndereco] = useState('selecione');
  const [showCartao, setShowCartao] = useState('');
  const [cupom, setCupom] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    changeAddress();
    changeCartao();
  }, [checkoutState.selectedMarketIndex]);

  useEffect(() => {
    changeAddress();
  }, [checkoutState?.enderecoEntregaPorEstabelecimento]);

  useEffect(() => {
    setCupom(checkoutState.cupom);
  }, [checkoutState.cupom]);

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
      const locations = local.results.map((result) => {
        const UF = result.address_components.find((object) => object.types.includes('administrative_area_level_1'))?.short_name || '';
        const Cidade = result.address_components.find((object) => object.types.includes('administrative_area_level_2'))?.long_name || '';
        const Bairro = result.address_components.find((object) => object.types.includes('sublocality_level_1'))?.long_name || '';
        const Num = result.address_components.find((object) => object.types.includes('street_number'))?.short_name || 0;
        const Endereco = result.formatted_address || '';
        const cep = result.address_components.find((object) => object.types.includes('postal_code'))?.short_name || '';
        // const [, , cep] = result.formatted_address.split(',');
        return {
          Cidade,
          UF,
          Num,
          Bairro,
          Endereco,
          CEP: cep,
          Latitude: result.geometry.location.lat,
          Longitude: result.geometry.location.lng,
          IdEndereco: result.place_id,
          Padrao: 'N',
          notExist: true,
        };
      });
      const action = { type: 'setEnderecoEntregaPorEstabelecimento', payload: { enderecoEntregaPorEstabelecimento: locations[0] } };
      checkoutDispatch(action);
    }
    fetchData();
  }, []);

  async function changeAddress() {
    if (!checkoutState?.enderecoEntregaPorEstabelecimento) return;
    const selected = checkoutState.enderecoEntregaPorEstabelecimento?.Endereco;
    setShowEndereco(selected || (selected?.Endereco ?? 'Selecione'));
  }

  function changeHorario(IdEmpresa) {
    if (checkoutState.horarioEntregaPorEstabelecimento.length == 0) return;
    const selected = checkoutState.horarioEntregaPorEstabelecimento[IdEmpresa].title;
    const ret = selected?.split('-').length > 0 ? selected : 'Tipo de entrega-Horário-0-0-0';
    return ret;
  }

  async function changeCartao() {
    if (checkoutState.cartaoPorEstabelecimento.length == 0) return;
    const selected = checkoutState.cartaoPorEstabelecimento[0];
    setShowCartao(selected);
    if (selected) { setSelectedPayment(selected.opcao); }
  }

  function selecionaOpcaoPagamento(opcao) {
    if (opcao.value === 'Cartão de Crédito') {
      const he = { ...checkoutState.cartaoPorEstabelecimento };
      const cartao = he[`${0}`];
      if (cartao == undefined) {
        return;
      }
      cartao.opcao = opcao.value;
      he[`${0}`] = cartao;
      const action = { type: 'setCartaoPorEstabelecimento', payload: { cartaoPorEstabelecimento: he } };
      checkoutDispatch(action);
      setSelectedPayment(opcao);
    } else {
      setSelectedPayment(opcao);
    }
  }

  async function carregaCarrinho() {
    const selectedMarkets = getSelectedMarkets();
    getMarketsListByIds(selectedMarkets)
      .then((markets) => {
        const action = { type: 'setMarkets', payload: { markets } };
        cartDispatch(action);
      });
  }

  async function pedidoConfirmado() {
    const limpaCarrinho = () => {
      const action = { type: 'createCarrinho', payload: new Array() };
      const actionCart = { type: 'CLEAR_CART' };
      dispatch(action);
      cartDispatch(actionCart);
    };
    limpaCarrinho();
    carregaCarrinho();
    navigate.goBack();
  }

  async function postPagamento(codigo_transacao, valor, endereco) {
    const cartao = checkoutState.cartaoPorEstabelecimento[0];
    const cardData = {
      cardNumber: cartao?.Numero?.split(' ').join('') || '',
      holderName: cartao.Titular,
      securityCode: cartao.CVV.trim(),
      expirationMonth: cartao.Validade.split('/')[0],
      expirationYear: cartao.Validade.split('/')[1],
    };
    try {
      const cardHash = await Juno.getCardHash(cardData);
      const cardId = await axios.post(`https://sandbox.boletobancario.com/boletofacil/integration/api/v1/card-tokenization?token=5D2446161015CC472AB6440E8D99516AA1E041BD6AA1CDBA9794C1D61DEB9852&creditCardHash=${cardHash}`);

      const { data } = await axios.post(`https://sandbox.boletobancario.com/boletofacil/integration/api/v1/issue-charge?token=5D2446161015CC472AB6440E8D99516AA1E041BD6AA1CDBA9794C1D61DEB9852&description=${codigo_transacao}&amount=${valor}&payerName=${cartao.Titular}&payerCpfCnpj=${cartao.CPF}&creditCardStore=${false}&creditCardId=${cardId.data.data.creditCardId}&paymentTypes=CREDIT_CARD&billingAddressStreet=null&billingAddressNumber=${endereco.Num}&billingAddressNeighborhood=${endereco.Bairro}&billingAddressCity=${endereco.Cidade}&billingAddressState=${endereco.UF}&billingAddressPostcode=${endereco.CEP}&payerEmail=wi3147383@wi7h.com.br`);
      return { code: data.data.charges[0].code, status: data.data.charges[0].payments[0].status };
    } catch (e) {
      throw e;
    }
  }

  async function fazerPedido() {
    const codigo_transacao = (Math.random() * 1000000).toFixed(0);
    const idCliente = state?.sessao?.IdCliente;
    if (!checkoutState?.enderecoEntregaPorEstabelecimento || !checkoutState?.enderecoEntregaPorEstabelecimento?.Endereco) {
      toastRef.current?.show('Selecione o endereço', 2000);
      return;
    }

    const {
      Bairro, CEP, IdEndereco, Cidade, Complemento, Num, UF, Endereco,
    } = checkoutState?.enderecoEntregaPorEstabelecimento;
    let horarioOk = true;
    cartState.markets.forEach((market) => {
      if (!checkoutState.horarioEntregaPorEstabelecimento[market.IdEmpresa]) {
        horarioOk = false;
      }
    });
    if (!horarioOk) {
      toastRef.current?.show('Selecione o horário de entrega', 2000);
      return;
    }
    const IdCartao = checkoutState.cartaoPorEstabelecimento[0]?.IdCartao;
    if (!IdCartao && selectedPayment.value === 'Cartão de crédito') {
      toastRef.current?.show('Selecione um cartão', 2000);
      return;
    }
    if (selectedPayment.value === 'Cartão de crédito' && !state?.cpf) {
      toastRef.current?.show('Digite um cpf', 2000);
      return;
    }

    setLoading(true);

    const valorTotal = cartState.markets.reduce((prev, market) => cartState.totalComprasPorEstabelecimento[`"${market.IdEmpresa}"`]
      + (checkoutState.horarioEntregaPorEstabelecimento[market.IdEmpresa]?.title.split('-').length > 0 ? (+checkoutState.horarioEntregaPorEstabelecimento[market.IdEmpresa].title.split('-')[2]) : 0), 0);

    try {
      const junoValues = {};
      if (selectedPayment.value === 'Cartão de crédito') {
        const juno = await postPagamento(codigo_transacao, valorTotal, checkoutState?.enderecoEntregaPorEstabelecimento);
        junoValues.status = juno.status;
        junoValues.codeJuno = juno.code;
      }
      const promises = cartState.markets.map((market) => {
        const Valor = cartState.totalComprasPorEstabelecimento[`"${market.IdEmpresa}"`]
          + (checkoutState.horarioEntregaPorEstabelecimento[market.IdEmpresa]?.title.split('-').length > 0 ? (+checkoutState.horarioEntregaPorEstabelecimento[market.IdEmpresa].title.split('-')[2]) : 0);
        const IdCupom = market.IdEmpresa == cupom?.IdEmpresa ? cupom.IdCupom : 0;
        const Desconto = market.IdEmpresa == cupom?.Valor ? cupom.IdCupom : 0;
        const IdTipoEntrega = checkoutState.horarioEntregaPorEstabelecimento[market.IdEmpresa].title.split('-')[3];
        const Taxa = checkoutState.horarioEntregaPorEstabelecimento[market.IdEmpresa].title.split('-')[2];
        const {
          TipoEntrega, IdHorario, DiaSemana, Horario, IdDiaSemana, DataFinal,
        } = checkoutState.horarioEntregaPorEstabelecimento[market.IdEmpresa];

        const pedido = {
          nomecliente: '',
          apelido: '',
          email: '',
          cpf: state?.cpf || '',
          senha: '',
          codigo_transacao,
          IdCliente: idCliente,
          IdTipoEntrega,
          IdHorario,
          IdCupom,
          idempresa: market.IdEmpresa,
          IdFormaPagamento: selectedPayment.id,
          IdDiaSemana,
          idendereco: IdEndereco,
          NumeroPedido: (Math.random() * 1000000).toFixed(0),
          Data: new Date(),
          Valor,
          Desconto,
          Taxa,
          TipoEntrega,
          DiaSemana,
          Horario,
          Endereco,
          Bairro,
          Cidade,
          UF,
          CEP,
          Num,
          Complemento,
          FormaPagamento: selectedPayment.value,
          QtdeParcela: 1,
          Observacao: '',
          status: 'aguardando pagamento',
          DataFinal,
          codigoJuno: '',
        };

        if (selectedPayment.value === 'Cartão de crédito') {
          pedido.IdCartao = checkoutState.cartaoPorEstabelecimento[0].IdCartao;
          pedido.status = junoValues.status;
          pedido.codigoJuno = junoValues.codeJuno;
        }

        return api.post('Pedidos', pedido);
      });

      await Promise.all(promises);
      pedidoConfirmado();
    } catch (e) {
      console.log(e);
      alert('ocorreu algum error');
    } finally {
      setLoading(false);
    }
  }

  function getSelectedMarkets() {
    return state.carrinho
      .filter((c, i, v) => v.findIndex((f) => f.product.IdEmpresa == c.product.IdEmpresa) == i)
      .map((c) => c.product.IdEmpresa);
  }

  return (
    <>
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
          <TouchableWithoutFeedback onPress={() => navigation.navigate('LocalizaçõesCheckout')}>
            <View style={styles.locationOuterContainer}>
              <Typography size="caption" color={theme.palette.light}>
                Entregar em
              </Typography>

              <View style={styles.locationContainer}>
                <Ionicons name="md-locate" size={25} color={theme.palette.primary} />

                <View style={styles.locationInfo}>
                  <Typography size="small" color={theme.palette.dark}>
                    {showEndereco}
                  </Typography>
                </View>

                <Ionicons name="ios-arrow-forward" size={25} color={theme.palette.primary} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ContentContainer>
        {/* End Delivery Location */}

        {cartState.markets.length > 0 && cartState.markets.map((market, index) => (
          <View key={market.IdEmpresa}>
            {/* TouchableOpacity onPress={() => checkoutDispatch({ type: "setSelectedMarketIndex", payload: { selectedMarketIndex: index } }) */}
            <ContentContainer>
              <View style={styles.pricesOuterContiner}>
                <Typography size="large" color={theme.palette.dark}>
                  {market.Nome}
                </Typography>

                <Divider />

                <View style={styles.priceContainer}>
                  <Typography size="small" color={theme.palette.light}>
                    Total em produtos
                  </Typography>
                  <Typography size="small" color={theme.palette.light}>
                    R$
                    {' '}
                    {cartState.totalComprasPorEstabelecimento[`"${market.IdEmpresa}"`]?.toFixed(2).replace('.', ',') ?? '0,00'}
                  </Typography>
                </View>

                <View style={styles.priceContainer}>
                  <Typography size="small" color={theme.palette.light}>
                    Entrega
                  </Typography>
                  <Typography size="small" color={theme.palette.light}>
                    R$
                    {' '}
                    {checkoutState.horarioEntregaPorEstabelecimento[market.IdEmpresa]?.title?.split('-').length > 0
                      ? (+checkoutState.horarioEntregaPorEstabelecimento[market.IdEmpresa]?.title.split('-')[2]).toFixed(2).replace('.', ',')
                      : '0,00'}
                  </Typography>
                </View>

                <Divider />

                <View style={styles.priceContainer}>
                  <Typography size="medium" color={theme.palette.dark}>
                    TOTAL
                  </Typography>
                  <Typography size="medium" color={theme.palette.dark}>
                    R$
                    {' '}
                    {
                      (cartState.totalComprasPorEstabelecimento[`"${market.IdEmpresa}"`]
                        + (checkoutState.horarioEntregaPorEstabelecimento[market.IdEmpresa]?.title.split('-').length > 0 ? (+checkoutState.horarioEntregaPorEstabelecimento[market.IdEmpresa].title.split('-')[2]) : 0)
                      ).toFixed(2).replace('.', ',')
                    }
                  </Typography>
                </View>
              </View>
              <Divider />
              <Typography size="small" color={theme.palette.dark}>
                Dados da Entrega/Retirada
              </Typography>
              <TouchableOpacity onPress={() => navigation.navigate('Entrega', { IdEmpresa: market.IdEmpresa })}>
                <Box direction="row" justify="space-between" alignItems="center">
                  <Box direction="column" justify="center" alignItems="flex-start">
                    <Typography size="small" color={theme.palette.light}>
                      {checkoutState.horarioEntregaPorEstabelecimento[market.IdEmpresa]?.TIPOENTREGA || 'Tipo'}
                    </Typography>
                    <Typography size="small" color={theme.palette.light}>
                      {checkoutState.horarioEntregaPorEstabelecimento[market.IdEmpresa]?.Data ? `${checkoutState.horarioEntregaPorEstabelecimento[market.IdEmpresa]?.Data.getDate()}/${checkoutState.horarioEntregaPorEstabelecimento[market.IdEmpresa]?.Data.getMonth()}/${checkoutState.horarioEntregaPorEstabelecimento[market.IdEmpresa]?.Data.getFullYear()}` : 'Data'}
                    </Typography>
                    <Typography size="small" color={theme.palette.light}>
                      {checkoutState.horarioEntregaPorEstabelecimento[market.IdEmpresa]?.horario || 'Horário'}
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
              <Ionicons name="md-pricetag" size={25} color={cupom ? theme.palette.primary : theme.palette.light} />

              <View style={styles.couponTextContainer}>
                <Typography size="small" color={theme.palette.light}>
                  {cupom
                    ? `${cupom?.NomeCupom} - R$ ${cupom?.Valor.toFixed(2).replace('.', ',')}`
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
                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => selecionaOpcaoPagamento({ value: 'Cartão de crédito', id: 1 })}>
                  <RadioButton selected={selectedPayment.value === 'Cartão de crédito'} />
                  <View>
                    <Typography size="small" color={theme.palette.dark}>
                      Pagar Agora
                    </Typography>
                    <Typography size="small" color={theme.palette.light}>
                      {showCartao
                        && (
                        <>
                          {showCartao.Bandeira}
                          {' '}
                          {showCartao.Numero.split('').filter((index, i) => i < 4).join(' ')}
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

            {/* <TouchableOpacity onPress={() => selecionaOpcaoPagamento("Picpay")}>
              <View style={styles.paymentMethodContainer}>
                <RadioButton selected={selectedPayment === "Picpay"} />
                <Typography size="small" color={theme.palette.dark}>
                  Picpay
                </Typography>
              </View>
            </TouchableOpacity> */}

            <View style={styles.paymentMethodContainer}>
              <View style={styles.paymentContainer}>
                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => selecionaOpcaoPagamento({ value: 'Na retirada ou entrega', id: 2 })}>

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
