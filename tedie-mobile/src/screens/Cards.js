import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// components
import { useNavigation } from '@react-navigation/native';
import Navbar from '../components/Navbar';
import ScreenContainer from '../components/ScreenContainer';
import Typography from '../components/Typography';
import ContentContainer from '../components/ContentContainer';
import Box from '../components/Box';
import { AppContext } from '../contexts/AppContext';
// theme
import theme from '../theme';
import { getCard } from '../services/card';

const Cards = ({ navigation }) => {
  const navigate = useNavigation();
  const [cards, setCads] = useState([]);
  const { state } = useContext(AppContext);

  useEffect(() => {
    async function fetch() {
      const cards = await getCard(state?.sessao?.IdCliente);
      setCads(cards);
    }
    fetch();
  }, []);
  return (
    <>
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
            Pagamento
          </Typography>
        )}
      />

      <ScreenContainer>
        {cards.map((card) => (
          <ContentContainer key={card.IdCartao}>
            <Box direction="row" justify="space-between" alignItems="center">
              <Box direction="column" justify="center" alignItems="flex-start">
                <Typography size="small" color={theme.palette.dark}>
                  Cartão de Crédito/Débito
                </Typography>
                <Typography size="caption" color={theme.palette.light}>
                  {`${card.Bandeira} **** ${card.Numero.split(' ')[3]}`}
                </Typography>
              </Box>

              <Box direction="row" justify="center" alignItems="center">
                <Ionicons name="md-card" size={25} color={theme.palette.dark} />
                <TouchableOpacity
                  style={styles.editButton}
                  hitSlop={styles.slope}
                >
                  <Ionicons name="md-more" size={25} color={theme.palette.primary} />
                </TouchableOpacity>
              </Box>
            </Box>

          </ContentContainer>
        ))}
      </ScreenContainer>
    </>
  );
};

const styles = StyleSheet.create({
  editButton: {
    marginLeft: 16,
  },
});

export default Cards;
