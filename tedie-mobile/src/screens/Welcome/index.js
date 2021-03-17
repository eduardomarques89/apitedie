import React, { useEffect, useState } from 'react';
import {
  StyleSheet, View, Image, StatusBar, TouchableOpacity, Text, Dimensions,
} from 'react-native';
import Swiper from 'react-native-swiper';
import { useNavigation, CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import theme from '../../theme';
import Tela1 from '../../assets/tela1.png';
import Tela2 from '../../assets/telaWelcome.png';
import Tela3 from '../../assets/tela3.png';

const Welcome = ({ navigation }) => {
  const navigate = useNavigation();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);

    async function verifyWelcome() {
      const value = JSON.parse(await AsyncStorage.getItem('welcomeView'));
      if (value?.value) {
        const resetAction = CommonActions.reset({
          index: 0,
          routes: [
            { name: 'tabs' },
          ],
        });
        navigate.dispatch(resetAction);
        return;
      }
      setLoading(false);
    }

    verifyWelcome();
  }, []);
  return (
    <>
      {loading ? <View style={styles.container} />

        : (
          <View style={styles.container}>
            <StatusBar backgroundColor={theme.palette.primary} />
            <Swiper
              activeDotStyle={{
                backgroundColor: '#fff', width: 10, height: 10, borderRadius: 10,
              }}
              dotStyle={{
                backgroundColor: 'rgba(255,255,255,0.8)', width: 10, height: 10, borderRadius: 10,
              }}
              style={styles.wrapper}
              showsPagination
              loop={false}
            >
              <Image source={Tela1} style={{ width: '100%', height: '100%' }} />
              <Image source={Tela2} style={{ width: '100%', height: '100%' }} />
              <Image source={Tela3} style={{ width: '100%', height: '100%' }} />
            </Swiper>

            <TouchableOpacity
              style={{ position: 'absolute', bottom: 8, right: 8 }}
              onPress={async () => {
                await AsyncStorage.setItem('welcomeView', JSON.stringify({ value: true }));
                const resetAction = CommonActions.reset({
                  index: 0,
                  routes: [
                    { name: 'tabs' },
                  ],
                });

                navigate.dispatch(resetAction);
              }}
            >
              <Text style={{ fontSize: 20, color: '#fff' }}>Pular</Text>
            </TouchableOpacity>

          </View>
        )}

    </>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d70d0f',
  },
  logoPlaceholder: {
    fontSize: 48,
    fontWeight: 'bold',
    color: theme.palette.secondary,
  },
});

export default Welcome;
