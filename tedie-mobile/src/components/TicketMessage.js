import React from 'react'
import { StyleSheet, View } from 'react-native'
// components
import theme from '../theme'
import Box from '../components/Box'
import Typography from '../components/Typography'
import ContentContainer from '../components/ContentContainer'


const TicketMessage = ({ message }) => {
  return (
    <Box 
      direction={message.type === "mercado" ? "row" : "row-reverse"} 
      justifyContent="center" 
      alignItems="center"
    >
      <View style={styles.avatar} />
      <ContentContainer>
        <Typography size="small" color={theme.palette.primary}>
          {message.type === "mercado" ? "Mercado" : "Eu"}
        </Typography>
        <Typography size="small" color={theme.palette.dark}>
          {message.message}
        </Typography>
      </ContentContainer>
    </Box>
  )
}

export default TicketMessage

const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 100,
    backgroundColor: theme.palette.secondary,
    marginHorizontal: 8
  },
})
