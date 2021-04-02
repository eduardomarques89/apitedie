import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StatusBar, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// components
import { useNavigation } from '@react-navigation/native';
import theme from '../theme';
import Navbar from '../components/Navbar';
import Typography from '../components/Typography';
import ScreenContainer from '../components/ScreenContainer';
import TicketItem from '../components/TicketItem';

const Tickets = ({ navigation }) => {
  const navigate = useNavigation();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    setTickets([
      {
        Pedido: '1234',
        Empresa: 'Mercado',
        Data: '27/10/2020',
        Status: 'Aberto',
      },
      {
        Pedido: '1233',
        Empresa: 'Mercado',
        Data: '15/10/2020',
        Status: 'Fechado',
      },
      {
        Pedido: '1232',
        Empresa: 'Mercado',
        Data: '03/10/2020',
        Status: 'Fechado',
      },
    ]);
  }, []);

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
            Atendimento
          </Typography>
        )}
      />

      <ScreenContainer>
        <FlatList
          data={tickets}
          keyExtractor={(item) => `${item.Pedido}`}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.push('Ticket', { ticket: item })}>
              <TicketItem ticket={item} />
            </TouchableOpacity>
          )}
        />
      </ScreenContainer>
    </>
  );
};

export default Tickets;
