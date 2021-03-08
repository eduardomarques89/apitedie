import React, { useContext, useEffect, useRef, useState } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
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

const Checkout = ({ navigation, route }) => {
  const [modalVisible, setModalVisible] = useState(!false);

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>O seu pagamento foi feito com sucesso!</Text>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setModalVisible(!modalVisible);
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Início' }],
                });
              }}
            >
              <Text style={styles.textStyle}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({

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
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    minWidth: 80
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
})

export default Checkout


