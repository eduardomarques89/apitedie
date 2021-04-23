import React from 'react';
import { StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';

const Typography = ({
  size, color, children, wrap,
}) => (
  <>
    <Text numberOfLines={wrap ? 1 : null} style={[styles[size], styles.text, { color }]}>
      { children }
    </Text>
  </>

);

const styles = StyleSheet.create({
  text: {
    paddingHorizontal: 8,
  },
  caption: {
    fontSize: 12,
  },
  small: {
    fontSize: 16,
  },
  medium: {
    fontSize: 20,
  },
  large: {
    fontSize: 24,
  },
});

Typography.propTypes = {
  children: PropTypes.element.isRequired,
  size: PropTypes.oneOf(['large', 'medium', 'small', 'caption']).isRequired,
};

export default Typography;
