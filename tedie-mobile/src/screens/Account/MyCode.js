import React, { useEffect, useState, useContext } from 'react';
import {
  StyleSheet, TouchableOpacity, Dimensions, StatusBar, Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// components
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import { AppContext } from '../../contexts/AppContext';
import Navbar from '../../components/Navbar';
import Typography from '../../components/Typography';
import ScreenContainer from '../../components/ScreenContainer';
import ContentContainer from '../../components/ContentContainer';
import Box from '../../components/Box';
import api from '../../services/axios';

// theme
import theme from '../../theme';
// qrcode

const MyCode = ({ navigation }) => {
  const [codigoIndicacao, setCodigoIndicacao] = useState(false);
  const { state } = useContext(AppContext);
  const navigate = useNavigation();

  useEffect(() => {
    async function fetchData() {
      const { data } = await api.get(`Clientes/${state?.sessao?.IdCliente}`);
      setCodigoIndicacao(data.Codigo_Indicacao);
      console.log(data);
    }
    fetchData();
  }, []);

  async function sharingProduct() {
    await Share.share({
      title: 'Tedie',
      message: `https://tedie.com.br/cadastro.aspx?id=${state?.sessao?.IdCliente}&codigo=${codigoIndicacao}`,
    });
  }

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
            Indicação
          </Typography>
        )}
      />

      <ScreenContainer>
        <Box direction="column" justify="center" alignItems="center">
          <TouchableOpacity
            style={styles.navbarButton}
          >
            <Typography size="small" color={theme.palette.dark}>
              INDIQUE E CONCORRA A PRÊMIOS
            </Typography>
          </TouchableOpacity>

          <ContentContainer>
            {codigoIndicacao !== false && (
              <QRCode
                size={Dimensions.get('window').width - 64}
                value={`https://tedie.com.br/cadastro.aspx?id=${state?.sessao?.IdCliente}&codigo=${codigoIndicacao}`}
              />

            )}
          </ContentContainer>

          <TouchableOpacity hitSlop={theme.hitSlop} onPress={sharingProduct}>
            <Typography size="small" alignItems="center" justify="center" color={theme.palette.dark}>
              COMPARTILHAR COM OS AMIGOS
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navbarButton}
            hitSlop={theme.hitSlop}
            onPress={sharingProduct}
          >
            <Entypo name="share" size={40} color={theme.palette.dark} />
          </TouchableOpacity>

        </Box>
      </ScreenContainer>
    </>
  );
};

const styles = StyleSheet.create({

  navbarButton: {
    marginHorizontal: 8,
    marginTop: 6,
  },
});

export default MyCode;
