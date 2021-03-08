import React from 'react'
import { StyleSheet, View } from 'react-native'
// theme
import theme from '../theme'

const Divider = () => {
  return (
    <View style={styles.divider} />
  )
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 12,
    backgroundColor: theme.palette.light 
  }
})

export default Divider


