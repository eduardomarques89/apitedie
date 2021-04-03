import React, { useState, useCallback } from 'react';
import {
  TouchableOpacity, StatusBar, FlatList, StyleSheet, View, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// components
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Navbar from '../../components/Navbar';
import Typography from '../../components/Typography';
import ScreenContainer from '../../components/ScreenContainer';
import ContentContainer from '../../components/ContentContainer';
import Loader from '../../components/Loader';
import Box from '../../components/Box';
import api from '../../services/axios';
// theme
import theme from '../../theme';

const Help = ({ navigation }) => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigation();
  useFocusEffect(useCallback(() => {
    async function fetch() {
      try {
        setLoading(true);
        const { data } = await api.get('Faq');
        setFaqs(data);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    }
    fetch();
  }, []));
  return (
    <SafeAreaView style={{ flex: 1, paddingBottom: 10 }}>

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

      <Loader show={loading} />
      {
            !loading && (
            <View style={styles.container}>

              <FlatList
                data={faqs}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                keyExtractor={(item) => `${item.IdFaq}`}
                renderItem={({ item }) => (
                  <ContentContainer>
                    <Box direction="column" justify="space-between" alignItems="center">
                      <Typography size="small" color={theme.palette.dark}>
                        {item.Pergunta}
                      </Typography>
                      <Typography size="caption" color={theme.palette.dark}>
                        {item.Resposta}
                      </Typography>
                    </Box>
                  </ContentContainer>
                )}
              />
            </View>
            )
          }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    flex: 1,
  },
});

export default Help;
