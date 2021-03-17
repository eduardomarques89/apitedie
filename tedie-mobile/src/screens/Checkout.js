import React, { useContext, useEffect, useRef, useState } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Text
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
// theme
import theme from '../theme'
// components
import Navbar from '../components/Navbar'
import Typography from '../components/Typography'
import ScreenContainer from '../components/ScreenContainer'
import ContentContainer from '../components/ContentContainer'
import Divider from '../components/Divider'
import Button from '../components/Button'
import RadioButton from '../components/RadioButton'
import Box from '../components/Box'
import { CartContext } from '../contexts/CartContext'
import { CheckoutContext } from '../contexts/CheckoutContext'
import { AppContext } from '../contexts/AppContext'
import { postPedido } from '../services/products'
import { geraCheckoutAPI, fazPagamentoJuno } from '../utils/boletofacil'
import Toast, { DURATION } from 'react-native-easy-toast'
import { getMarketsListByIds } from '../services/market'
import { Modal } from 'react-native'
import * as Yup from 'yup'
import api from '../services/axios'
import randowString from 'random-string'
import {login} from '../services/clients'
import {useNavigation} from '@react-navigation/native'
const emailSchema = Yup.object({
  email:Yup.string().email().required()
})



const Checkout = ({ navigation, route }) => {
 
  const navigate = useNavigation()
  const toastRef = useRef();
  const [selectedPayment, setSelectedPayment] = useState("Na retirada ou entrega")
  const { cartState, cartDispatch } = useContext(CartContext);
  const { checkoutState, checkoutDispatch } = useContext(CheckoutContext);
  const { state, dispatch } = useContext(AppContext);
  // const [showHorario, setShowHorario] = useState("Tipo de entrega-Horário-0-0")
  const [showEndereco, setShowEndereco] = useState( "selecione")
  const [showCartao, setShowCartao] = useState("")
  const [cupom, setCupom] = useState("")
  const [email,setEmail] = useState("")

  useEffect(() => {
    changeAddress()
    changeCartao()
  }, [checkoutState.selectedMarketIndex])

  useEffect(() => {
    changeAddress()
  }, [checkoutState.enderecoEntregaPorEstabelecimento])

  useEffect(() => {
    setCupom(checkoutState.cupom)
  }, [checkoutState.cupom])

  useEffect(() => {
    changeCartao()
  }, [checkoutState.cartaoPorEstabelecimento])

  async function changeAddress() {
    if (!checkoutState.enderecoEntregaPorEstabelecimento) return
    const selected = checkoutState.enderecoEntregaPorEstabelecimento
    setShowEndereco(selected?.Beautify ?? "Selecione")
  }

  function changeHorario(IdEmpresa) {
    if (checkoutState.horarioEntregaPorEstabelecimento.length == 0) return
    const selected = checkoutState.horarioEntregaPorEstabelecimento[IdEmpresa].title
    const ret = selected?.split('-').length > 0 ? selected : "Tipo de entrega-Horário-0-0-0"
    return ret
  }

  async function changeCartao() {
    if (checkoutState.cartaoPorEstabelecimento.length == 0) return
    const selected = checkoutState.cartaoPorEstabelecimento[0]
    setShowCartao(selected)
    if (selected)
      setSelectedPayment(selected.opcao)
  }

  function selecionaOpcaoPagamento(opcao) {
    if (opcao ==='credit') {
      let he = { ...checkoutState.cartaoPorEstabelecimento }
      const cartao = he[`${0}`]
      if(cartao == undefined){
        return
      }
      cartao.opcao = opcao
      he[`${0}`] = cartao
      const action = { type: "setCartaoPorEstabelecimento", payload: { cartaoPorEstabelecimento: he } }
      checkoutDispatch(action);
      setSelectedPayment(opcao)
    }else{
      setSelectedPayment(opcao)
    }
  }

  async function createUser(email){
    const password = randowString({length: 10,numeric: true,
      letters: true,
      special: true,
      
    })+'#'
      try{
        const response = await api.post("Account/Register",{
          Email:email,
          Password:password,
          ConfirmPassword:password
        })
        console.log(email)
        console.log(password)
      const token = await login(email,password)
      console.log(token)
    }catch(e){
      console.log(e)

    }
  }

  async function fazerPedido() {
    const codigo_transacao = (Math.random() * 1000000).toFixed(0)
    const idCliente = state?.sessao?.IdCliente || -1
    let totalCompra = 0
    const endereco = checkoutState.enderecoEntregaPorEstabelecimento

    if(idCliente == -1){
      const test = await emailSchema.isValid({email})
      if(!test){
        toastRef.current?.show('Digite um email', 2000)
        return
      }
      createUser(email)
      return
    }
    if (!endereco) {
      toastRef.current?.show('Selecione o endereço', 2000)
      return
    }

    let horarioOk = true
    cartState.markets.forEach(market => {
      if (!checkoutState.horarioEntregaPorEstabelecimento[market.IdEmpresa]) {
        horarioOk = false;
        return
      }
    });
    if (!horarioOk) {
      toastRef.current?.show('Selecione o horário de entrega', 2000)
      return
    }

    let OpcaoPagamento = checkoutState.cartaoPorEstabelecimento
    console.log(OpcaoPagamento)
    // if(!OpcaoPagamento || OpcaoPagamento.length === 0){
    //   toastRef.current?.show('Selecione um meio de pagamento', 2000)
    //   return
    // }

    cartState.markets.forEach(async market => {
      let IdCartao = 0
      const {Bairro,CEP,Cidade,Complemento,Endereco,IdEndereco,UF,Num} = checkoutState.enderecoEntregaPorEstabelecimento
      let Valor = cartState.totalComprasPorEstabelecimento[`"${market.IdEmpresa}"`] +
        (checkoutState.horarioEntregaPorEstabelecimento[market.IdEmpresa]?.title.split('-').length > 0 ? (+checkoutState.horarioEntregaPorEstabelecimento[market.IdEmpresa].title.split('-')[2]) : 0)
      let IdCupom = market.IdEmpresa == cupom?.IdEmpresa ? cupom.IdCupom : 0
      let Desconto = market.IdEmpresa == cupom?.Valor ? cupom.IdCupom : 0
      let IdTipoEntrega = checkoutState.horarioEntregaPorEstabelecimento[market.IdEmpresa].title.split('-')[3]
      let Taxa = checkoutState.horarioEntregaPorEstabelecimento[market.IdEmpresa].title.split('-')[2]
      const {TipoEntrega,IdHorario,DiaSemana,Horario,IdDiaSemana} = checkoutState.horarioEntregaPorEstabelecimento[market.IdEmpresa]

      // let CEP = endereco?.CEP ?? ""
      // let OpcaoPagamento = checkoutState.cartaoPorEstabelecimento[0].opcao

      if (OpcaoPagamento == 'credit')
        IdCartao = checkoutState.cartaoPorEstabelecimento[0].IdCartao

      let pedido = {
        nomecliente:"",
        apelido:"",
        datanasc:"",
        email:"",
        cpf:"",
        senha:"",
        codigo_transacao: codigo_transacao,
        IdCliente: idCliente,
        IdTipoEntrega,
        IdHorario,
        IdCupom,
        IdCartao,
        IdFormaPagamento: null,
        IdDiaSemana,
        IdEndereco: IdEndereco,
        NumeroPedido: (Math.random() * 1000000).toFixed(0),
        Data: new Date(),
        Valor,
        Desconto,
        Taxa,
        //Cupom
        TipoEntrega,
        DiaSemana,
        Horario,
        // Status
        Endereco,
        Bairro,
        Cidade,
        UF,
        CEP,
        Num,
        Complemento,
        FormaPagamento: selectedPayment,
        QtdeParcela:1,
        Observacao: "",
        //Score
      }
      totalCompra += Valor
      try{
        await postPedido(pedido)
      }catch{
        alert("ocorreu algum error")
      }
    });
    pedidoConfirmado()
    // postPagamento(codigo_transacao, totalCompra)
  }

  function getSelectedMarkets() {
    return state.carrinho
      .filter((c, i, v) => v.findIndex((f) => f.product.IdEmpresa == c.product.IdEmpresa) == i)
      .map(c => c.product.IdEmpresa)
  }

  async function carregaCarrinho() {
    const selectedMarkets = getSelectedMarkets()
    getMarketsListByIds(selectedMarkets)
      .then(markets => {
        const action = { type: "setMarkets", payload: { markets: markets } }
        cartDispatch(action);
      })
  }

  async function pedidoConfirmado() {
    const limpaCarrinho = () => {
      let action = { type: 'createCarrinho', payload: new Array() }
      dispatch(action)
      action = { type: "setTotalCompras", payload: { totalCompras: 0 } }
      cartDispatch(action)
      action = { type: "setSomaParcial", payload: { somaParcial: [] } }
      cartDispatch(action)
      action = { type: "setHorarioEntregaPorEstabelecimento", payload: { horarioEntregaPorEstabelecimento: [] } }
      cartDispatch(action)
      action = { type: "setEnderecoEntregaPorEstabelecimento", payload: { enderecoEntregaPorEstabelecimento: [] } }
      cartDispatch(action)
      action = { type: "setTotalComprasPorEstabelecimento", payload: { totalComprasPorEstabelecimento: [] } }
      cartDispatch(action)
      action = { type: "setCartaoPorEstabelecimento", payload: { cartaoPorEstabelecimento: [] } }
      cartDispatch(action)
    }
    limpaCarrinho()
    carregaCarrinho()
    navigate.goBack()
  }

  const fazPagamento = (cartao, codigo_transacao, valor) => {
    return pedidoConfirmado()
  }

  const errorAoPagar = (error) => {
    console.log(error)
  }

  async function postPagamento(codigo_transacao, valor) {
    const cartao = checkoutState.cartaoPorEstabelecimento[0]
    var cardData = {
      cardNumber: cartao?.Numero?.split(' ').join("") || "",
      holderName: cartao.Titular,
      securityCode: cartao.CVV.trim(),
      expirationMonth: cartao.Validade.split('/')[0],
      expirationYear: cartao.Validade.split('/')[1]
    };
    fazPagamento(cardData, codigo_transacao, valor)
  }
  
  return (
    <React.Fragment>
      <Toast ref={toastRef}
        style={{ backgroundColor: 'black' }}
        opacity={0.8}
        textStyle={{ color: 'white' }} />

      <Navbar
        left={
          <TouchableOpacity hitSlop={theme.hitSlop} onPress={() => {
            if(navigate.canGoBack()){
              navigate.goBack()
            }
          }} >
            <Ionicons name="md-arrow-back" size={25} color="#fff" />
          </TouchableOpacity>
        }
        title={
          <Typography size="small" color="#fff">
            Checkout
          </Typography>
        }
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
                    R$ {cartState.totalComprasPorEstabelecimento[`"${market.IdEmpresa}"`]?.toFixed(2).replace('.', ',') ?? "0,00"}
                  </Typography>
                </View>

                <View style={styles.priceContainer}>
                  <Typography size="small" color={theme.palette.light}>
                    Entrega
              </Typography>
                  <Typography size="small" color={theme.palette.light}>
                    R$ {checkoutState.horarioEntregaPorEstabelecimento[market.IdEmpresa]?.title?.split('-').length > 0 ?
                      (+checkoutState.horarioEntregaPorEstabelecimento[market.IdEmpresa]?.title.split('-')[2]).toFixed(2).replace('.', ',')
                      : "0,00"}
                  </Typography>
                </View>

                <Divider />

                <View style={styles.priceContainer}>
                  <Typography size="medium" color={theme.palette.dark}>
                    TOTAL
              </Typography>
                  <Typography size="medium" color={theme.palette.dark}>
                    R$ {
                      (cartState.totalComprasPorEstabelecimento[`"${market.IdEmpresa}"`]
                        +
                        (checkoutState.horarioEntregaPorEstabelecimento[market.IdEmpresa]?.title.split('-').length > 0 ? (+checkoutState.horarioEntregaPorEstabelecimento[market.IdEmpresa].title.split('-')[2]) : 0)
                      ).toFixed(2).replace('.', ',')
                    }
                  </Typography>
                </View>
              </View>
            </ContentContainer>

            <ContentContainer>
              <TouchableOpacity onPress={() => navigation.navigate("Entrega", { IdEmpresa: market.IdEmpresa })}>
                <Box direction="row" justify="space-between" alignItems="center">
                  <Box direction="column" justify="center" alignItems="flex-start">
                    <Typography size="small" color={theme.palette.light}>
                      {checkoutState.horarioEntregaPorEstabelecimento[market.IdEmpresa]?.title.split('-').length > 0 ? changeHorario(market.IdEmpresa)?.split('-')[0] : "Tipo de entrega"}
                    </Typography>
                    <Typography size="small" color={theme.palette.dark}>
                      {checkoutState.horarioEntregaPorEstabelecimento[market.IdEmpresa]?.title.split('-').length > 0 ? changeHorario(market.IdEmpresa)?.split('-')[1] : "Horário"}
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
                  {cupom ?
                    `${cupom?.NomeCupom} - R$ ${cupom?.Valor.toFixed(2).replace('.', ',')}`
                    : "Selecionar Cupom"
                  }
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
                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => selecionaOpcaoPagamento("Cartão de crédio")}>
                  <RadioButton selected={selectedPayment === "Cartão de crédio"} />
                  <View>
                    <Typography size="small" color={theme.palette.dark}>
                      Cartão pelo TEDIE
                  </Typography>
                    <Typography size="small" color={theme.palette.light}>
                      {showCartao &&
                        <>
                          {showCartao.Bandeira} {showCartao.Numero.split(" ").map((y, i) => { return i == 1 || i == 2 ? "****" : y }).join(" ")}
                        </>
                      }
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

            <TouchableOpacity onPress={() => selecionaOpcaoPagamento("Na retirada ou entrega")}>
              <View style={styles.paymentMethodContainer}>
                <RadioButton selected={selectedPayment === "Na retirada ou entrega"} />
                <Typography size="small" color={theme.palette.dark}>
                  Pagar na entrega ou retirada
                </Typography>
              </View>
            </TouchableOpacity>

            <Divider />
                      {
                        state?.sessao?.IdCliente &&

            <TouchableOpacity onPress={() => navigation.navigate('Documento')}>
              <View style={styles.paymentMethodContainer}>
                <View style={styles.paymentContainer}>
                  <Typography size="small" color={theme.palette.dark}>
                    CPF/CNPJ na Nota
                  </Typography>
                  <Typography size="small" color={theme.palette.light}>
                    {state?.cpf?.replace(/(\d{3})?(\d{3})?(\d{3})?(\d{2})/g,"$1.$2.$3-$4") || '123.456.789-00'}
                  </Typography>
                </View>

                <Typography size="small" color={theme.palette.primary}>
                  Trocar
                </Typography>
              </View>
            </TouchableOpacity>
                      }
          </View>
        </ContentContainer>
        {/* End Payment Methods */}
        { !state?.sessao?.IdCliente &&
        
          <ContentContainer>
          <TouchableWithoutFeedback onPress={() => navigation.navigate('Login')}>
            <View style={styles.login}>
              <View>
              <Typography size="medium" color={theme.palette.dark}>
                Acessar
              </Typography>
              <Typography size="caption" color={theme.palette.light}>
                <Text style={{color:theme.palette.primary}}>

                    Entre
                </Text>
                <Text>

                     {` ou `} 
                </Text>
                <Text style={{color:theme.palette.primary}}>

                     cadastre-se
                </Text>
                  </Typography>

              </View>
                  
              <Ionicons name="ios-arrow-forward" size={25} color={theme.palette.light} />
            </View>
          </TouchableWithoutFeedback>
        </ContentContainer>
        }
        {
          state?.sessao?.IdCliente &&(
            <Button
              background={theme.palette.primary}
              color="#fff"
              width="100%"
              text="Fazer pedido"
              onPress={(e) => { fazerPedido() }}
            />

          )
        }
      </ScreenContainer>
    </React.Fragment >
  )
}


const styles = StyleSheet.create({
  locationOuterContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  login: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  locationContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginTop: 8
  },
  email:{
    paddingLeft:8,
    marginTop:8,
    fontSize:18
  },  
  locationInfo: {
    maxWidth: 200,
    marginHorizontal: 16
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
    alignItems: 'center'
  },

  couponContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8
  },

  paymentContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  paymentMethodContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
})

export default Checkout


