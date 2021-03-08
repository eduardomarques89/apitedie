import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
// components
import ContentContainer from './ContentContainer'
import Avatar from './Avatar'
import Typography from './Typography'
import Box from './Box'
// theme
import theme from '../theme'
// skeleton 
import SkeletonContent from 'react-native-skeleton-content';

const MarketItem = ({ market, skeleton }) => {
  return (
    <ContentContainer>
      {!skeleton && (
        <View style={styles.container}>
          <View style={styles.leftContainer}>
            <Avatar color={theme.palette.secondary} image={market.Logo} size={50} />

            <View style={styles.infoContainer}>
              <Box direction="row" justifyContent="center" alignItems="baseline">
                <Typography size="medium" color="#000">
                  {market.Nome}
                </Typography>

                <Box direction="row" justifyContent="center" alignItems="center">
                  <Typography size="medium" color={theme.palette.secondary}>
                    {market.Score.toFixed(1).toString().replace('.', ',')}
                  </Typography>
                  <Ionicons name="md-star" size={25} color={theme.palette.secondary} />
                </Box>
              </Box>

              <Typography size="small" color="#000">
                {market.Endereco}, {market.Num}
              </Typography>
              <Typography size="small" color={theme.palette.light}>
                {market.TipoEntrega}
              </Typography>
            </View>
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
              { width: 50, height: 50, borderRadius: 100 },
            ]}
          />
          <SkeletonContent
            containerStyle={{ flexDirection: 'column', alignItems: 'flex-start', marginLeft: 8 }}
            isLoading={skeleton}
            layout={[{ width: 200, height: 15, marginBottom: 24 },]}
          />
          <SkeletonContent
            containerStyle={{ flexDirection: 'column', alignItems: 'flex-start', marginLeft: 8 }}
            isLoading={skeleton}
            layout={[{ width: 120, height: 15, marginBottom: 8 },]}
          />
          <SkeletonContent
            containerStyle={{ flexDirection: 'column', alignItems: 'flex-start', marginLeft: 8 }}
            isLoading={skeleton}
            layout={[{ width: 150, height: 15 }]}
          />
        </Box>
      )}
    </ContentContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  leftContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  infoContainer: {
    maxWidth: 200,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start'
  }
})

export default MarketItem
