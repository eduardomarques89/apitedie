import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import SkeletonContent from 'react-native-skeleton-content'
// components
import ContentContainer from './ContentContainer'
import Box from './Box'
import Typography from './Typography'
// theme
import theme from '../theme'

const TicketItem = ({ ticket, skeleton }) => {
  return (
    <ContentContainer background="#fff">
      {!skeleton && ticket && (
        <View style={styles.outerContainer}>
          <Ionicons name="md-chatbubbles" size={25} color={theme.palette.primary} /> 

          <View style={styles.infoContainer}>
            <Typography size="medium" color={theme.palette.dark}>
              Pedido #{ticket.Pedido}
            </Typography>
            <Typography size="small" color={theme.palette.dark}>
              {ticket.Empresa}
            </Typography>
            <Typography size="small" color={theme.palette.dark}>
              Aberto em {ticket.Data}
            </Typography>
            <Typography size="small" color={theme.palette.dark}>
              Atendimento {ticket.Status}
            </Typography>
          </View>

          <Ionicons name="ios-arrow-forward" size={25} color={theme.palette.primary} /> 
        </View>
      )}

      {skeleton && (
        <Box direction="row" justifyContent="center" alignItems="center">
          <SkeletonContent
            containerStyle={{ flexDirection: 'row', justifyContent: 'flex-start' }}
            isLoading={skeleton}
            layout={[
              { key: 0, width: 50, height: 50, borderRadius: 100 },
            ]}
          />
          <SkeletonContent
            containerStyle={{ flexDirection: 'column', alignItems: 'flex-start', marginLeft: 8 }}
            isLoading={skeleton}
            layout={[
              { key: 0, width: 200, height: 15, marginBottom: 24 },
              { key: 1, width: 120, height: 15, marginBottom: 8 },
              { key: 2, width: 150, height: 15 }
            ]}
          />
        </Box>
      )}
    </ContentContainer>
  )
}

const styles = StyleSheet.create({
  outerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoContainer: {
    maxWidth: 200,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  actionsContainer: {
    flex: 1,
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
})

TicketItem.propTypes = {
  ticket: PropTypes.object,
  skeleton: PropTypes.bool
}

export default TicketItem