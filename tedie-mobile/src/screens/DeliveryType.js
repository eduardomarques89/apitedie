import React, { useContext, useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
// components
import Navbar from '../components/Navbar'
import Typography from '../components/Typography'
import ScreenContainer from '../components/ScreenContainer'
import ContentContainer from '../components/ContentContainer'
import Box from '../components/Box'
import Divider from '../components/Divider'
import RadioButton from '../components/RadioButton'
import DateTimePicker from '@react-native-community/datetimepicker';
// theme
import theme from '../theme'
import { CheckoutContext } from '../contexts/CheckoutContext'
import { CartContext } from '../contexts/CartContext'
import { buscaHorarios } from '../services/market'
import {useNavigation} from '@react-navigation/native'

const weekDay = ["DOMINGO","SEGUNDA-FEIRA","TERÇA-FEIRA", "QUARTA-FEIRA","QUINTA-FEIRA","SEXTA-FEIRA","SABADO"]

const DeliveryType = ({ navigation, route }) => {
  const navigate = useNavigation()
  const [selectedType, setSelectedType] = useState(0)
  const { checkoutState, checkoutDispatch } = useContext(CheckoutContext);
  const { cartState, cartDispatch } = useContext(CartContext);
  const [horarios, setHorarios] = useState([])
  const [filterHorario,seFilterHorario] = useState([])
  const { IdEmpresa } = route.params
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(true);
  const [week,setWeek] = useState("")

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    
    setShow(false)
    return event
  };
  useEffect(() => {
    buscaHorariosEstabelecimento()
  },[])
  
  useEffect(() =>{
    const week =weekDay[date.getDay()]
    setWeek(week)

  },[date])
  useEffect(() =>{
    const newHorarios = horarios.filter(horario => horario.diasemana == week)
    seFilterHorario(newHorarios)
  },[week,horarios])

  useEffect(() => {
    if (horarios.length > 0) {
      setSelectedIndexSaved()
    }
  }, [horarios])

  async function setSelectedIndexSaved() {
    const horarioEntrega = checkoutState.horarioEntregaPorEstabelecimento[IdEmpresa]
    setSelectedType(horarioEntrega)
  }

  async function buscaHorariosEstabelecimento() {
    const horarios = await buscaHorarios(IdEmpresa)
    setHorarios(horarios)
    seFilterHorario(horarios)
  }

  async function setSelectedHorario(horario) {
    const horarioEntrega = `${horario.TIPOENTREGA}-${horario.horario}-${horario.TAXA}-${horario.identrega}-${horario.horacod}`
    setSelectedType(horarioEntrega)

    let he = { ...checkoutState.horarioEntregaPorEstabelecimento, }
    console.log(horario)
    he[`${IdEmpresa}`] = {
      title:horarioEntrega,
      IdTipoEntrega:horario.identrega,
      IdHorario:horario.horacod,
      TipoEntrega:horario.TIPOENTREGA,
      DiaSemana:horario.diasemana,
      Horario:horario.horario,
      IdDiaSemana:horario.iddiasemana
    }
    // console.log(he)
    const action = { type: "setHorarioEntregaPorEstabelecimento", payload: { horarioEntregaPorEstabelecimento: he } }
    checkoutDispatch(action);

    navigation.pop()
  }

  return (
    <React.Fragment>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChange}

        />
      )}
      <Navbar
        left={
          <TouchableOpacity hitSlop={theme.hitSlop} onPress={() => {
            if(navigate.canGoBack()){
              navigate.goBack()
            }
          }}>
            <Ionicons name="md-arrow-back" size={25} color="#fff" />
          </TouchableOpacity>
        }
        title={
          <Typography size="small" color="#fff">
            Entrega
          </Typography>
        }
      />

      <ScreenContainer>
        {filterHorario.map((h, index) => (
          <ContentContainer key={`${h.identrega}-${h.horacod}`}>
            <Box direction="column" justify="center" alignContent="flex-start">
              <Typography size="large" color={theme.palette.dark}>
                {h.TIPOENTREGA}
              </Typography>

              <Divider />
              {filterHorario.filter(t => t.identrega == h.identrega)
                .map((th, index) => (
                  <TouchableOpacity key={`${th.identrega}-${th.horacod}`} onPress={() => setSelectedHorario(th)}>
                    <Box direction="row" justify="space-between" alignItems="center" fullwidth>
                      <Typography size="small" color={theme.palette.light}>
                        {th.horario}
                      </Typography>
                      <RadioButton selected={selectedType === `${th.TIPOENTREGA}-${th.horario}-${th.TAXA}`} />
                    </Box>
                  </TouchableOpacity>
                ))}
            </Box>
          </ContentContainer>
        ))}
      </ScreenContainer>
    </React.Fragment>
  )
}

export default DeliveryType
