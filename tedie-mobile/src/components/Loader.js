import React from 'react';
import { ActivityIndicator, View } from 'react-native';

const Loader = ({ show }) => (
  <View style={{
    flex: 1, alignItems: 'center', justifyContent: 'center', display: show ? 'flex' : 'none',
  }}
  >
    <ActivityIndicator size="large" color="#d70d0f" />
  </View>
);

export default Loader;
