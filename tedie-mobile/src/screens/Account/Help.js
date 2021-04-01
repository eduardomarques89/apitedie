import React from 'react';
import { TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// components
import { useNavigation } from '@react-navigation/native';
import Navbar from '../../components/Navbar';
import Typography from '../../components/Typography';
import ScreenContainer from '../../components/ScreenContainer';
import ContentContainer from '../../components/ContentContainer';
import Box from '../../components/Box';
// theme
import theme from '../../theme';

const Help = ({ navigation }) => {
  const navigate = useNavigation();
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
            Ajuda
          </Typography>
        )}
      />

      <ScreenContainer>
        <ContentContainer>
          <Box direction="row" justify="space-between" alignItems="center">
            <Typography size="small" color={theme.palette.dark}>
              Uma pergunta frequente?
            </Typography>
            <Ionicons name="ios-arrow-forward" size={25} color={theme.palette.primary} />
          </Box>
        </ContentContainer>
      </ScreenContainer>
    </>
  );
};

export default Help;
