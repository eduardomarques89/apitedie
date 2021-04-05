import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text, Modal,
} from 'react-native';

const Checkout = ({ navigation, route }) => {
  const [modalVisible, setModalVisible] = useState(!false);

  return (
    <View style={styles.centeredView} />
  );
};

const styles = StyleSheet.create({

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
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
