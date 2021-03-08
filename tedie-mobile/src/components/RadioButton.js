import React from 'react'
import { StyleSheet, View } from 'react-native'
import theme from '../theme'

const RadioButton = ({ selected }) => {
  return (
    <React.Fragment>
      {!selected && (
        <View style={styles.unselected} />
      )}
      {selected && (
        <View style={styles.unselected}>
          <View style={styles.selected} />
        </View>
      )}
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
  unselected: {
    width: 30,
    height: 30,
    borderRadius: 100,
    backgroundColor: '#eeeeee',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  selected: {
    width: 18,
    height: 18,
    borderRadius: 100,
    backgroundColor: theme.palette.primary
  }
})

export default RadioButton