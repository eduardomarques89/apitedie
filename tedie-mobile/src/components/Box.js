import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

const Box = ({
  direction, justify, alignItems, alignContent, children, fullwidth, noMargin, alignSelf,
}) => {
  const styles = StyleSheet.create({
    container: {
      width: fullwidth ? '100%' : null,
      paddingRight: 8,
      flexDirection: direction,
      justifyContent: justify,
      alignItems,
      alignContent,
      marginBottom: noMargin ? 0 : 8,
      alignSelf,
    },
  });

  return (
    <View style={styles.container}>
      {children}
    </View>
  );
};

Box.propTypes = {
  direction: PropTypes.oneOf(['row', 'column']).isRequired,
  children: PropTypes.element.isRequired,
  justify: PropTypes.oneOf(['center', 'flex-start', 'flex-end', 'space-around', 'space-between', 'space-evenly']),
  alignItems: PropTypes.oneOf(['baseline', 'center', 'flex-start', 'flex-end', 'stretch']),
  alignSelf: PropTypes.oneOf(['baseline', 'center', 'flex-start', 'flex-end', 'stretch']),
  alignContent: PropTypes.oneOf(['center', 'flex-start', 'flex-end', 'space-around', 'space-between', 'stretch']),
  fullwidth: PropTypes.bool,
  noMargin: PropTypes.bool,
};

Box.defaultProps = {
  justify: 'flex-start',
  alignItems: 'flex-start',
  alignSelf: 'auto',
  alignContent: 'flex-start',
  fullwidth: false,
  noMargin: false,
};

export default Box;
