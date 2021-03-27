import React, { useState } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { Hoshi } from 'react-native-textinput-effects';
// theme
import theme from '../theme';

const TextField = ({
  width, label, labelColor, borderColor, backgroundColor,
  keyboardType, returnKeyType, onEndEditing, useContainerWidth, value, setValue, date, password, ...rest
}) => {
  const propWidth = width ? Number.parseInt(width.replace('%', '')) : null;
  const fieldWidth = width ? ((Dimensions.get('window').width * (propWidth / 100)) - 20) : null;
  const windowSizeWidth = (Dimensions.get('window').width - 24);

  const [inputValue, setInputValue] = useState(value);

  function setInfo(value) {
    if (date == true) {
      setInputValue(maskDate(value));
      setValue(maskDate(value));
    } else {
      const x = value;
      setInputValue(x);
      setValue(x);
    }
  }

  const maskDate = (value) => {
    if (value.length >= 10) return value.slice(0, 10);
    const v = value.replace(/\D/g, '').slice(0, 10);
    if (v.length >= 5) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`;
    }
    if (v.length >= 3) {
      return `${v.slice(0, 2)}/${v.slice(2)}`;
    }
    return v;
  };

  return (
    <Hoshi
      {...rest}
      style={[
        styles.input,
        { width: useContainerWidth ? '100%' : (width ? fieldWidth : windowSizeWidth) },
      ]}
      label={label}
      labelStyle={[styles.label]}
      borderColor={borderColor || theme.palette.primary}
      borderHeight={3}
      backgroundColor={backgroundColor}
      keyboardType={keyboardType}
      returnKeyType={returnKeyType}
      onEndEditing={() => {}}
      // value={date ? maskDate(inputValue) : password ? inputValue.split("").reduce((a, v) => { return (a += "*") }, "") : inputValue}
      value={inputValue}
      onChangeText={(value) => { setInfo(value); }}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    alignSelf: 'center',
    margin: 8,
  },
  label: {
    color: '#aaa',
    fontWeight: 'bold',
  },
});

TextField.propTypes = {
  width: PropTypes.string,
  label: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string,
  keyboardType: PropTypes.string,
  returnKeyType: PropTypes.string,
  onEndEditing: PropTypes.func,
  value: PropTypes.string,
};

export default TextField;
