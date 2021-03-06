import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';

const ScreenContainer = ({ children, bottomGutter }) => (
  <ScrollView contentContainerStyle={[styles.container, { paddingBottom: bottomGutter }]}>
    {children}
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
    paddingTop: 0,
  },
});

export default ScreenContainer;
