import React from 'react'
import { StyleSheet, Text } from 'react-native'

const Typography = ({ size, color, children, wrap }) => {
  return (
    <React.Fragment>
      {size === 'caption' && (
        <Text numberOfLines={wrap ? 1 : null} style={[styles.caption, styles.text, { color: color }]}>
          { children }
        </Text>
      )}

      {size === 'small' && (
        <Text numberOfLines={wrap ? 1 : null} style={[styles.small, styles.text, { color: color }]}>
          { children }
        </Text>
      )}

      {size === 'medium' && (
        <Text numberOfLines={wrap ? 1 : null} style={[styles.medium, styles.text, { color: color }]}>
          { children }
        </Text>
      )}

      {size === 'large' && (
        <Text numberOfLines={wrap ? 1 : null} style={[styles.large, styles.text, { color: color }]}>
          { children }
        </Text>
      )}
    </React.Fragment>
    
  )
}

const styles = StyleSheet.create({
  text: {
    paddingHorizontal: 8
  },
  caption: {
    fontSize: 12
  },
  small: {
    fontSize: 16
  },
  medium: {
    fontSize: 20
  },
  large: {
    fontSize: 24
  }
})

export default Typography
