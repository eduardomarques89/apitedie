import { useLinkProps } from '@react-navigation/native'
import React from 'react'
import { View, StyleSheet } from 'react-native'

const ContentContainer = ({ children, background }) => {
  return (
    <View style={styles.container}>
      { children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // flex: 1, // se descomentar outras telas vao bugar
    backgroundColor: '#fff',
    marginVertical: 8,
    padding: 16,
    elevation: 2,
    borderRadius: 8,
    textShadowColor: 'black'
  }
})

export default ContentContainer
