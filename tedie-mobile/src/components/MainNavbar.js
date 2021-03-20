import React, { useContext, useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// components
import Avatar from './Avatar';
import Typography from './Typography';
import Navbar from './Navbar';
// theme
import theme from '../theme';

const MainNavbar = ({ navigation, left }) => (
  <Navbar
    left={
        left || (
        <>

          <Avatar
            size={60}
            color={theme.palette.secondary}
          />
        </>
        )

      }

    right={(
      <>
        <TouchableOpacity
          style={styles.navbarButton}
          hitSlop={theme.hitSlop}
          onPress={() => navigation.navigate('Localizações2')}
        >
          <Ionicons name="md-pin" size={30} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navbarButton}
          hitSlop={theme.hitSlop}
          onPress={() => navigation.navigate('Produtos2')}
        >
          <Ionicons name="md-search" size={30} color="#fff" />
        </TouchableOpacity>
      </>
      )}
  />
);

const styles = StyleSheet.create({
  navbarButton: {
    marginHorizontal: 8,
  },
});

export default MainNavbar;
