import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
// components
import Typography from './Typography';

const Button = ({
  color, background, onPress, text, width, customComponent = false,
}) => (
  <TouchableOpacity style={{ width }} onPress={onPress}>
    <View style={[styles.button, { backgroundColor: background }]}>
      {customComponent || (
      <Typography size="small" color={color}>
        { text }
      </Typography>
      )}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    marginVertical: 16,
    borderRadius: 8,
  },
});

Button.propTypes = {
  color: PropTypes.string,
  background: PropTypes.string,
  onPress: PropTypes.func,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

Button.defaultProps = {
  color: PropTypes.string,
  background: PropTypes.string,
  onPress: PropTypes.func,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default Button;
