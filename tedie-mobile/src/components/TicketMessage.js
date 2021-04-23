import React from 'react';
import { StyleSheet, View } from 'react-native';
// components
import theme from '../theme';
import Box from './Box';
import Typography from './Typography';
import ContentContainer from './ContentContainer';

const TicketMessage = ({ message }) => (
  <Box
    direction={message.type === 'mercado' ? 'row' : 'row-reverse'}
    justifyContent="center"
    alignItems="center"
  >
    <View style={styles.avatar} />
    <ContentContainer>
      <Typography size="small" color={theme.palette.primary}>
        {message.type === 'mercado' ? 'Mercado' : 'Eu'}
      </Typography>
      <Typography size="small" color={theme.palette.dark}>
        {message.message}
      </Typography>
    </ContentContainer>
  </Box>
);

export default TicketMessage;

const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 100,
    backgroundColor: theme.palette.secondary,
    marginHorizontal: 8,
  },
});
