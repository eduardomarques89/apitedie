import React, {
  useContext, useEffect, useState, useRef, useCallback,
} from 'react';
import {
  TouchableOpacity, StatusBar, TextInput, View, StyleSheet, Text, FlatList,
} from 'react-native';
import { Ionicons, EvilIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
// components
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-easy-toast';
import Navbar from '../components/Navbar';
import Typography from '../components/Typography';
import ScreenContainer from '../components/ScreenContainer';
import ContentContainer from '../components/ContentContainer';
import Box from '../components/Box';
import Divider from '../components/Divider';
import RadioButton from '../components/RadioButton';
// theme
import theme from '../theme';
import { CheckoutContext } from '../contexts/CheckoutContext';
import { CartContext } from '../contexts/CartContext';
import { buscaHorarios } from '../services/market';
// import {} from '@expo/vector-icons'

const weekDay = ['DOMINGO', 'SEGUNDA-FEIRA', 'TERÇA-FEIRA', 'QUARTA-FEIRA', 'QUINTA-FEIRA', 'SEXTA-FEIRA', 'SABADO'];

const DeliveryType = ({ navigation, route }) => {
  const toastRef = useRef();
  const navigate = useNavigation();
  // const [selectedType, setSelectedType] = useState(0);
  const { checkoutState, checkoutDispatch } = useContext(CheckoutContext);
  const { cartState, cartDispatch } = useContext(CartContext);
  const [horarios, setHorarios] = useState([]);
  const { IdEmpresa } = route.params;
  const [date, setDate] = useState(new Date());
  const [filterHorario, seFilterHorario] = useState([]);
  const [dateFinal, setDateFinal] = useState(new Date());
  const [show, setShow] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [week, setWeek] = useState(weekDay[date.getDay()]);
  const [horario, setHorario] = useState({});
  const [dataFormat, setDataFormat] = useState(`${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`);
  const [dataFormatFinal, setDataFormatFinal] = useState(`${dateFinal.getDay()}/${dateFinal.getMonth()}/${dateFinal.getFullYear()}`);
  const [type, setType] = useState({ label: 'Entrega', id: 1 });
  const typesDelivery = [{
    label: 'Entrega',
    id: 1,
  }, {
    label: 'Retirada',
    id: 2,
  }];

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;

    // const he = horario;
    // he[`${IdEmpresa}`].Data = currentDate;
    // console.log(he);

    // const action = { type: 'setHorarioEntregaPorEstabelecimento', payload: { horarioEntregaPorEstabelecimento: he } };

    setShow(false);
    setDate(currentDate);

    return event;
  };

  useEffect(() => {
    setDataFormat(`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`);
  }, [date, dateFinal]);

  useFocusEffect(useCallback(() => {
    buscaHorariosEstabelecimento();
  }, []));

  useEffect(() => {
    const week = weekDay[date.getDay()];
    setWeek(week);
  }, [date]);

  // useEffect(() => {
  //   if (horarios.length > 0) {
  //     setSelectedIndexSaved();
  //   }
  // }, [horarios]);
  useEffect(() => {
    if (horario.length > 0) {
      const newHorario = horarios.filter((horario) => horario.identrega === type.id || horario.identrega > 2 && horario.diasemana === week);
      seFilterHorario(newHorario);
    }
  }, [type, horario, week]);

  // async function setSelectedIndexSaved() {
  //   const horarioEntrega = checkoutState.horarioEntregaPorEstabelecimento[IdEmpresa];
  //   setSelectedType(horarioEntrega);
  // }

  async function buscaHorariosEstabelecimento() {
    console.log('carregando horarios');
    const horarios = await buscaHorarios(IdEmpresa);
    console.log(horarios);
    setHorarios(horarios);
  }

  async function setSelectedHorario(horario) {
    const horarioEntrega = `${horario.TIPOENTREGA}-${horario.horario}-${horario.TAXA}-${horario.identrega}-${horario.horacod}`;
    // setSelectedType(horarioEntrega);

    const he = { ...checkoutState.horarioEntregaPorEstabelecimento };
    he[`${IdEmpresa}`] = {
      ...he[`${IdEmpresa}`],
      title: horarioEntrega,
      IdTipoEntrega: horario.identrega,
      IdHorario: horario.horacod,
      TipoEntrega: horario.TIPOENTREGA,
      DiaSemana: horario.diasemana,
      Horario: horario.horario,
      IdDiaSemana: horario.iddiasemana,

    };
    console.log(he[`${IdEmpresa}`]);
    const action = { type: 'setHorarioEntregaPorEstabelecimento', payload: { horarioEntregaPorEstabelecimento: he } };
    checkoutDispatch(action);
    setHorario(he);
  }

  function formatDate(value, setValue) {
    let newValue = value.match(/\d+/g)?.join('') || '';
    const { length } = newValue;
    newValue = newValue.replace(/\D/g, '');
    newValue = newValue.replace(/^(\d{2})(\d)/g, '$1/$2');
    newValue = newValue.replace(/(\d{2})\/(\d{2})(\d)/g, '$1/$2/$3');
    if (length > 8) {
      return;
    }
    setValue(newValue);
  }

  return (
    <>

      <StatusBar backgroundColor={theme.palette.primary} />
      <Toast
        ref={toastRef}
        style={{ backgroundColor: 'black' }}
        opacity={0.8}
        textStyle={{ color: 'white' }}
      />
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          is24Hour
          display="default"
          onChange={onChange}

        />
      )}
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
            Entrega
          </Typography>
        )}
      />

      <ScreenContainer>
        <Text style={styles.dataLabel}>Data Inicial</Text>
        <View style={styles.dataInputContainer}>
          <TextInput value={dataFormat} onChangeText={(e) => formatDate(e, setDataFormat)} style={styles.dataInput} />
          <TouchableOpacity onPress={() => setShow(true)}>
            <EvilIcons name="calendar" size={32} color="black" />
          </TouchableOpacity>
        </View>
        <Text style={styles.dataLabel}>Entrega</Text>
        <View style={{
          borderWidth: 1,
          margin: 8,
        }}
        >
          <Picker
            style={{
              height: 50,
            }}
            selectedValue={type}
            onValueChange={(itemValue, itemIndex) => setType(itemValue)}
          >
            {
            typesDelivery.map((value) => (

              <Picker.Item key={value.id} label={value.label} value={value} />
            ))
          }
          </Picker>
        </View>

        <ContentContainer>
          <Box direction="column" justify="center" alignContent="flex-start">
            <Typography size="large" color={theme.palette.dark}>
              {type.label}
            </Typography>

            <Divider />
            <FlatList
              data={filterHorario}
              keyExtractor={(item) => `${item.horacod}`}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => setSelectedHorario(item)}>
                  <Box direction="row" justify="space-between" alignItems="center" fullwidth>
                    <Typography size="small" color={theme.palette.light}>
                      {item.horario}
                    </Typography>
                    <RadioButton selected={horario.horacode === item.horacode} />
                  </Box>
                </TouchableOpacity>

              )}
            />
            {/* {filterHorario.map((th, index) => (
              ))} */}
          </Box>
        </ContentContainer>
        {/* {filterHorario.map((h, index) => (
        ))} */}
      </ScreenContainer>
    </>
  );
};

const styles = StyleSheet.create({
  dataInput: {
    fontSize: 24,
  },
  dataLabel: {
    fontSize: 24,
  },
  dataInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderWidth: 1,
    paddingVertical: 8,
    margin: 8,
  },
});

export default DeliveryType;
