import React from 'react';
import {
  StyleSheet, TouchableOpacity, TextInput, View, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// component
import { useNavigation } from '@react-navigation/native';
import Navbar from '../components/Navbar';
import ScreenContainer from '../components/ScreenContainer';
import Typography from '../components/Typography';
import Button from '../components/Button';
import TextField from '../components/TextField';
import Box from '../components/Box';
// theme
import theme from '../theme';

const Location = ({ navigation, route }) => {
  const navigate = useNavigation();
  const { location } = route.params;

  return (
    <>

      <StatusBar backgroundColor={theme.palette.primary} />
      <Navbar
        left={(
          <TouchableOpacity
            hitSlop={theme.hitSlop}
            onPress={() => {
              if (navigate.canGoBack()) {
                navigate.goBack();
              }
            }}
          >
            <Ionicons name="md-arrow-back" size={25} color="#fff" />
          </TouchableOpacity>
        )}
        title={(
          <Typography size="small" color="#fff">
            Localização
          </Typography>
        )}
      />

      <ScreenContainer>
        <TextField
          width="100%"
          label="CEP"
          labelColor={theme.palette.primary}
          borderColor={theme.palette.primary}
          value={location.CEP}
        />

        <Box
          direction="row"
          justify="center"
          alignItems="center"
        >
          <TextField
            width="70%"
            label="Endereço"
            labelColor={theme.palette.primary}
            borderColor={theme.palette.primary}
            value={location.Endereco}
          />
          <TextField
            width="30%"
            label="Num"
            labelColor={theme.palette.primary}
            borderColor={theme.palette.primary}
            value={location.Num}
          />
        </Box>

        <TextField
          width="100%"
          label="Bairro"
          labelColor={theme.palette.primary}
          borderColor={theme.palette.primary}
          value={location.Bairro}
        />

        <TextField
          width="100%"
          label="Complemento"
          labelColor={theme.palette.primary}
          borderColor={theme.palette.primary}
          value={location.Complemento}
        />

        <View style={styles.confirmButton}>
          <Button
            background={theme.palette.secondary}
            color={theme.palette.primary}
            width="50%"
            text="Salvar"
          />
        </View>
      </ScreenContainer>
    </>
  );
};

const styles = StyleSheet.create({
  textInput: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fafafa',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: theme.palette.primary,
    marginVertical: 8,
  },

  confirmButton: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default Location;
