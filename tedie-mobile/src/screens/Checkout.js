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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// theme
import Toast from 'react-native-easy-toast';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import theme from '../theme';
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
import { postPedido } from '../services/products';
import { geraCheckoutAPI, fazPagamentoJuno } from '../utils/boletofacil';
import { getMarketsListByIds } from '../services/market';
import api from '../services/axios';

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

  async function fazerPedido() {
    const codigo_transacao = (Math.random() * 1000000).toFixed(0);
    const idCliente = state?.sessao?.IdCliente;
    const totalCompra = 0;
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
    if (selectedPayment === 'CREDIT_CARD') {
      postPagamento(codigo_transacao, cartState.totalCompras, showEndereco);
      return;
    }
    if (!IdCartao && selectedPayment === 'CREDIT_CARD') {
      toastRef.current?.show('Selecione um cartão', 2000);
      return;
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
      };

      if (selectedPayment === 'CREDIT_CARD') {
        pedido.IdCartao = checkoutState.cartaoPorEstabelecimento[0].IdCartao;
      }
      console.log('pedido');
      console.log(pedido);

      return api.post('Pedidos', pedido);
    });

    try {
      setLoading(true);
      const response = await Promise.all(promises);
      console.log(response);
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

  const fazPagamento = (cartao, codigo_transacao, valor) => {
    const paymentTypes = 'CREDIT_CARD';
    const checkout = geraCheckoutAPI();
    checkout.getCardHash(cartao, async (cardHash) => {
      console.log(cardHash);
      /* Sucesso - A variável cardHash conterá o hash do cartão de crédito */
      const data = await fazPagamentoJuno(cardHash, codigo_transacao, valor, cartao.holderName, '10934429642', 'Timóteo', 'MG', '35182362', paymentTypes, 'Rua Equador', '279', 'otaviool@hotmail.com');
      console.log(data);
      if (data.charges[0].payments[0].status == 'CONFIRMED') {
        pedidoConfirmado();
      }
    }, (error) => {
      console.log('erros');
      console.log(error.message);
      /* Erro - A variável error conterá o erro ocorrido ao obter o hash */
    });
  };

  const errorAoPagar = (error) => {
    console.log(error);
  };

  async function postPagamento(codigo_transacao, valor) {
    console.log('OIioio');
    const cartao = checkoutState.cartaoPorEstabelecimento[0];
    const cardData = {
      cardNumber: cartao?.Numero?.split(' ').join('') || '',
      holderName: cartao.Titular,
      securityCode: cartao.CVV.trim(),
      expirationMonth: cartao.Validade.split('/')[0],
      expirationYear: cartao.Validade.split('/')[1],
    };
    console.log(cardData);
    fazPagamento(cardData, codigo_transacao, valor);
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
            </ContentContainer>

            <ContentContainer>
              <TouchableOpacity onPress={() => navigation.navigate('Entrega', { IdEmpresa: market.IdEmpresa })}>
                <Box direction="row" justify="space-between" alignItems="center">
                  <Box direction="column" justify="center" alignItems="flex-start">
                    <Typography size="small" color={theme.palette.light}>
                      {checkoutState.horarioEntregaPorEstabelecimento[market.IdEmpresa]?.title.split('-').length > 0 ? changeHorario(market.IdEmpresa)?.split('-')[0] : 'Tipo de entrega'}
                    </Typography>
                    <Typography size="small" color={theme.palette.dark}>
                      {checkoutState.horarioEntregaPorEstabelecimento[market.IdEmpresa]?.title.split('-').length > 0 ? changeHorario(market.IdEmpresa)?.split('-')[1] : 'Horário'}
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
                  <RadioButton selected={selectedPayment === 'Cartão de crédito'} />
                  <View>
                    <Typography size="small" color={theme.palette.dark}>
                      Cartão pelo TEDIE
                    </Typography>
                    <Typography size="small" color={theme.palette.light}>
                      {showCartao
                        && (
                        <>
                          {showCartao.Bandeira}
                          {' '}
                          {showCartao.Numero.split(' ').map((y, i) => (i == 1 || i == 2 ? '****' : y)).join(' ')}
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

            <TouchableOpacity onPress={() => selecionaOpcaoPagamento({ value: 'Na retirada ou entrega', id: 2 })}>
              <View style={styles.paymentMethodContainer}>
                <RadioButton selected={selectedPayment.value === 'Na retirada ou entrega'} />
                <Typography size="small" color={theme.palette.dark}>
                  Pagar na entrega ou retirada
                </Typography>
              </View>
            </TouchableOpacity>

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
    marginVertical: 8,
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
