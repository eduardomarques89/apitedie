import React from 'react'
import { StyleSheet, View, Image } from 'react-native'
import PropTypes from 'prop-types'
// components
import ContentContainer from './ContentContainer'
import Typography from './Typography'

const CategoryItem = ({ category }) => {
  return (
    <View style={styles.container}>
      {!category.Icone && (
        <ContentContainer>
          <View style={styles.image} />
        </ContentContainer>
      )}

      {category.Icone && (
        <ContentContainer>
          <Image
            style={styles.image}
            source={{
              uri: category.Icone,
            }}  
            resizeMode="contain"
          />
        </ContentContainer>
      )}

      <Typography size="small" color="#000">
        { category.NomeCategoria }
      </Typography>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 200,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16
  },
  image: {
    width: 100,
    height: 100
  }
})

export default CategoryItem