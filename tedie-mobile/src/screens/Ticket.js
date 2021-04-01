import React from 'react';
import {
  StyleSheet, TouchableOpacity, View, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// components
import { useNavigation } from '@react-navigation/native';
import theme from '../theme';
import Navbar from '../components/Navbar';
import Typography from '../components/Typography';
import ScreenContainer from '../components/ScreenContainer';
import TicketMessage from '../components/TicketMessage';
import Box from '../components/Box';
import TextField from '../components/TextField';
import ContentContainer from '../components/ContentContainer';

const Ticket = ({ navigation }) => {
  const navigate = useNavigation();
  const messages = [
    {
      type: 'user',
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vitae nulla quis dolor sagittis sodales.',
    },
    {
      type: 'mercado',
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      type: 'user',
      message: 'Phasellus vitae nulla quis dolor sagittis sodales.',
    },
    {
      type: 'user',
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vitae nulla quis dolor sagittis sodales.',
    },
    {
      type: 'mercado',
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      type: 'user',
      message: 'Phasellus vitae nulla quis dolor sagittis sodales.',
    },
    {
      type: 'user',
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vitae nulla quis dolor sagittis sodales.',
    },
    {
      type: 'mercado',
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      type: 'user',
      message: 'Phasellus vitae nulla quis dolor sagittis sodales.',
    },
  ];

  return (
    <>

      <StatusBar backgroundColor={theme.palette.primary} />
      <Navbar
        left={(
          <TouchableOpacity hitSlop={theme.hitSlop} onPress={() => navigation.pop()}>
            <Ionicons name="md-arrow-back" size={25} color="#fff" />
          </TouchableOpacity>
        )}
        title={(
          <Typography size="small" color="#fff">
            Atendimento
          </Typography>
        )}
        right={(
          <TouchableOpacity
            hitSlop={theme.hitSlop}
            onPress={() => {
              if (navigate.canGoBack()) {
                navigate.goBack();
              }
            }}
          >
            <Ionicons name="md-refresh" size={25} color="#fff" />
          </TouchableOpacity>
        )}
      />

      <ScreenContainer bottomGutter={90}>
        {messages.map((message, index) => (
          <TicketMessage message={message} key={index} />
        ))}
      </ScreenContainer>

      <View style={styles.inputContainer}>
        <Box direction="row" justify="flex-start" alignItems="center">
          <TextField
            width="90%"
            label="Mensagem"
          />
          <TouchableOpacity hitSlop={theme.hitSlop}>
            <Ionicons name="md-send" size={30} color={theme.palette.primary} />
          </TouchableOpacity>
        </Box>
      </View>
    </>
  );
};

export default Ticket;

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
  },
});
