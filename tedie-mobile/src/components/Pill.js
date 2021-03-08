import React from 'react'
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native'
// components
import theme from '../theme'
import Typography from './Typography'

const Pill = ({ selected, title, onPress }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View 
        style={[
          styles.pill, 
          { backgroundColor: selected ? theme.palette.primary : theme.palette.light }
        ]}
      >
        <Typography size="small" color="#fff">
          {title}
        </Typography>
      </View>
    </TouchableWithoutFeedback>
    
  )
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderRadius: 100,
    elevation: 2,
    marginLeft: 8
  }
})

export default Pill
