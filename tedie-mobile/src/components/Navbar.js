import React from 'react';
import {
  StyleSheet, View, Text, Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import Constants from 'expo-constants';
// theme
import theme from '../theme';

const Navbar = ({ title, left, right }) => (
  <View style={styles.container}>
    <View style={styles.sideContainer}>
      { left }
    </View>

    <View>{ title }</View>

    <View style={styles.sideContainer}>
      { right }
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {

    marginTop: Platform.OS === 'ios' ? Constants.statusBarHeight : 0,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: theme.palette.primary,
  },

  sideContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

Navbar.propTypes = {
  title: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  left: PropTypes.object,
  right: PropTypes.object,
};

export default Navbar;
