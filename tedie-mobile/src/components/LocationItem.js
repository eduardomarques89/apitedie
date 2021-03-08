import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import SkeletonContent from 'react-native-skeleton-content'
// components
import ContentContainer from './ContentContainer'
import Box from './Box'
import Typography from './Typography'
// theme
import theme from '../theme'

const LocationItem = ({ onPressEdit, location, skeleton, setLocalization }) => {
  return (
    <ContentContainer background="#fff">
      {!skeleton && location && (
        <View style={styles.outerContainer}>

          <TouchableOpacity
            onPress={() => setLocalization(location)}
            style={{
              width: '100%',
              minWidth: '50%',
              paddingLeft: '25%',
              flex: 1,
              flexDirection: 'row'
            }}
          >
            <View style={{ position: 'absolute', left: 0 }}>
              <Ionicons name="md-pin" size={30} color={theme.palette.primary} />
            </View>
            <View style={styles.infoContainer}>
              <Typography size="medium" color={theme.palette.dark}>
                {location.Endereco}, {location.Num}
              </Typography>
              <Typography size="small" color={theme.palette.dark}>
                {location.Bairro}, {location.Cidade} - {location.UF}
              </Typography>
            </View>
          </TouchableOpacity>

          <View styles={styles.actionsContainer}>
            <TouchableOpacity
              hitSlop={theme.hitSlop}
              onPress={onPressEdit}
            >
              <Ionicons name="md-create" size={30} color={theme.palette.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              hitSlop={theme.hitSlop}
            >
              <Ionicons name="md-trash" size={30} color={theme.palette.primary} />
            </TouchableOpacity>
          </View>
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

LocationItem.propTypes = {
  onPressEdit: PropTypes.func,
  location: PropTypes.object,
  skeleton: PropTypes.bool
}

export default LocationItem
