import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';
import logo from '../assets/logoicon_tedie.png';
// theme
import theme from '../theme';

const Avatar = ({
  image, size, color, styles, selected,
}) => (
  <>
    {image && (
    <Image
      style={[
        customStyles.avatar,
        { width: size, height: size, backgroundColor: color },
        styles,
        selected ? customStyles.selected : null,
      ]}
      source={{
        uri: image,
      }}
      resizeMode="contain"
    />
    )}

    {!image && (
    <View
      style={[
        customStyles.avatar,
        // { width: size, height: size, backgroundColor: color },
        styles,
        selected ? customStyles.selected : null,
      ]}
    >
      <Image style={{ width: 100, height: 40, resizeMode: 'contain' }} source={logo} />
    </View>
    )}
  </>
);

const customStyles = StyleSheet.create({
  avatar: {
    borderRadius: 100,
  },
  selected: {
    borderWidth: 2,
    borderColor: theme.palette.primary,
  },
});

Avatar.propTypes = {
  image: PropTypes.string,
  size: PropTypes.number,
  color: PropTypes.string,
};

export default Avatar;
