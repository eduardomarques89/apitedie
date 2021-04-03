import React, {
  useContext, useRef, useState, useCallback,
} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet from 'reanimated-bottom-sheet';
// theme
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import theme from '../theme';
// components
import Navbar from '../components/Navbar';
import Typography from '../components/Typography';
import ScreenContainer from '../components/ScreenContainer';
import ContentContainer from '../components/ContentContainer';
import Divider from '../components/Divider';
import Button from '../components/Button';
import { getCard } from '../services/card';
import { CheckoutContext } from '../contexts/CheckoutContext';
import { AppContext } from '../contexts/AppContext';
import Loader from '../components/Loader';

const OrderPayments = ({ navigation }) => {
  const navigate = useNavigation();
  const [meiosPag, setMeiosPag] = useState([]);
  const [loading, setLoading] = useState(true);
  const { checkoutState, checkoutDispatch } = useContext(CheckoutContext);
  const { state } = useContext(AppContext);

  useFocusEffect(useCallback(() => {
    loadMeiosPag();
  }, []));

  async function loadMeiosPag() {
    try {
      setLoading(true);
      const cartoes = await getCard(state.sessao.IdCliente);
      setMeiosPag(cartoes);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }

  async function selecionaCartao(card) {
    card.opcao = 'credit';
    const he = { ...checkoutState.cartaoPorEstabelecimento };
    he[`${0}`] = card;
    const action = { type: 'setCartaoPorEstabelecimento', payload: { cartaoPorEstabelecimento: he } };
    checkoutDispatch(action);
    navigation.pop();
  }

  const bottomSheetRef = useRef(null);

  const openBottomSheet = (ref) => {
    ref.current.snapTo(150);
  };

  const closeBottomSheet = (ref) => {
    ref.current.snapTo(0);
  };

  const BotomSheetContent = ({ sheetRef }) => (
    <>
      <View style={styles.bottomSheetContainer}>
        <TouchableOpacity hitSlop={theme.hitSlop} onPress={() => closeBottomSheet(sheetRef)}>
          <View style={styles.bottomSheetHeader}>
            <Ionicons name="md-close-circle" size={25} color={theme.palette.light} />
            <Typography size="small" color={theme.palette.light}>
              Fechar
            </Typography>
          </View>
        </TouchableOpacity>

        <View style={styles.bottomSheetActions}>
          <TouchableOpacity>
            <View style={styles.bottomSheetItem}>
              <Ionicons name="md-create" size={25} color={theme.palette.primary} />
              <Typography size="small" color={theme.palette.dark}>
                Editar
              </Typography>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.bottomSheetItem}>
              <Ionicons name="md-trash" size={25} color={theme.palette.primary} />
              <Typography size="small" color={theme.palette.dark}>
                Excluir
              </Typography>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

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
      <Loader show={loading} />
      {!loading && (
        <>
          <ScreenContainer>

            <ContentContainer>
              <View style={styles.columnContainer}>
                <Typography size="medium" color={theme.palette.dark}>
                  Pagamento pelo TEDIE
                </Typography>

                <Divider />

                {meiosPag.length > 0 && meiosPag.map((p) => (
                  <View style={styles.lineSpaceContainer} key={p.IdCartao}>
                    <TouchableOpacity onPress={() => selecionaCartao(p)}>
                      <View style={styles.columnContainer}>
                        <Typography size="small" color={theme.palette.dark}>
                          Cartão de Crédito/Débito
                        </Typography>
                        <Typography size="caption" color={theme.palette.light}>
                          {p.Bandeira}
                          {' '}
                          {p.Numero.split(' ').map((y, i) => (i == 1 || i == 2 ? '****' : y)).join(' ')}
                        </Typography>
                      </View>
                    </TouchableOpacity>

                    <View style={styles.lineContainer}>
                      <Ionicons name="md-card" size={25} color={theme.palette.dark} />
                      <TouchableOpacity
                        style={styles.editButton}
                        hitSlop={styles.slope}
                        onPress={() => openBottomSheet(bottomSheetRef)}
                      >
                        <Ionicons name="md-more" size={25} color={theme.palette.primary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}

                <Button
                  background={theme.palette.primary}
                  color="#fff"
                  width="100%"
                  text="Adicionar Cartão"
                  onPress={() => navigation.navigate('Cartão')}
                />
              </View>
            </ContentContainer>
          </ScreenContainer>

          <BottomSheet
            snapPoints={[0, 1, 150]}
            renderContent={() => (<BotomSheetContent sheetRef={bottomSheetRef} />)}
            ref={bottomSheetRef}
          />
        </>
      )}

    </>
  );
};

const styles = StyleSheet.create({
  lineContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  lineSpaceContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  columnContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  editButton: {
    marginLeft: 16,
  },
  slope: {
    top: 25,
    left: 25,
    bottom: 25,
    right: 25,
  },
  bottomSheetContainer: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 4,
    backgroundColor: '#fff',
  },
  bottomSheetHeader: {
    width: '100%',
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
  },
  bottomSheetActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSheetItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderColor: theme.palette.primary,
    borderWidth: 2,
    borderRadius: 8,
    marginHorizontal: 8,
  },
});

export default OrderPayments;
