import React, { useState, useEffect, useContext } from 'react';
import { TouchableOpacity, StatusBar, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// components
import { useNavigation } from '@react-navigation/native';
import theme from '../theme';
import Navbar from '../components/Navbar';
import Typography from '../components/Typography';
import ScreenContainer from '../components/ScreenContainer';
import TicketItem from '../components/TicketItem';
import api from '../services/axios';
import { AppContext } from '../contexts/AppContext';
import Loader from '../components/Loader';

const Tickets = ({ navigation }) => {
  const { state } = useContext(AppContext);
  const navigate = useNavigation();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const { data } = await api.get(`Ticket/Cliente/${state?.sessao?.IdCliente}`);
        const newTickes = data.map((ticket) => {
          const date = new Date(ticket.DataCadastro);
          return {
            ...ticket,
            date: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
          };
        });
        setTickets(newTickes);
      } catch {

      } finally {
        setLoading(false);
      }
    }
    fetchData();
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
      <Loader show={loading} />

      {!loading && (
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 16 }}
          data={tickets}
          keyExtractor={(item) => `${item.IdTicket}`}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.push('Ticket', { ticket: item })}>
              <TicketItem ticket={item} />
            </TouchableOpacity>
          )}
        />

      )}

    </>
  );
};

export default Tickets;
