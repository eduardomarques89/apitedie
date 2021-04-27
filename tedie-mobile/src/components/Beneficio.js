import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';
// components
import ContentContainer from './ContentContainer';
import Typography from './Typography';

const BeneficioItem = ({ beneficio }) => (
  <View style={styles.container}>
    {!beneficio.Icone && (
    <ContentContainer>
      <View style={styles.image} />
    </ContentContainer>
    )}

    {beneficio.Icone && (
    <ContentContainer>
      <Image
        style={styles.image}
        source={{
          uri: beneficio.Icone,
        }}
        resizeMode="contain"
      />
    </ContentContainer>
    )}

    <Typography size="small" color="#000">
      { beneficio.Titulo }
    </Typography>
  </View>
);

const styles = StyleSheet.create({
  container: {
    maxWidth: 200,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  image: {
    width: 100,
    height: 100,
  },
});

BeneficioItem.propTypes = {
  beneficio: PropTypes.shape({
    Icone: PropTypes.string,
    Titulo: PropTypes.string.isRequired,

  }),
};

BeneficioItem.defaultProps = {
  beneficio: {
    Icone: '',
  },
};

export default BeneficioItem;
