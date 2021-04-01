import React, { useContext, useEffect } from 'react';
import {
  StyleSheet, View, TouchableWithoutFeedback, TouchableOpacity, Text, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// components
import { useNavigation, CommonActions } from '@react-navigation/native';
import MainNavbar from '../../components/MainNavbar';
import ScreenContainer from '../../components/ScreenContainer';
import ContentContainer from '../../components/ContentContainer';
import Typography from '../../components/Typography';
import Avatar from '../../components/Avatar';
// theme
import theme from '../../theme';
import { AppContext } from '../../contexts/AppContext';
import { CartContext } from '../../contexts/CartContext';

const Account = ({ navigation }) => {
  const { state, dispatch } = useContext(AppContext);
  const { cartDispatch } = useContext(CartContext);
  const navigate = useNavigation();

  async function logoff() {
    const action = { type: 'LOG_OUT' };
    const actionCart = { type: 'CLEAR_CART' };
    dispatch(action);
    cartDispatch(actionCart);
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [
        { name: 'tabs' },
      ],
    });
    navigate.dispatch(resetAction);
  }

  useEffect(() => {
    console.log(state.sessao);
  }, [state]);

  return (
    <>

      <StatusBar backgroundColor={theme.palette.primary} />
      <MainNavbar
        navigation={navigation}
        left={
        state.market
        && (
        <>
          <Avatar
            size={35}
            color={theme.palette.secondary}
            image={state.market.Logo}
          />
          <Typography size="small" color="#fff">
            {state.market.Nome}
          </Typography>
        </>
        )

      }
      />

      <ScreenContainer>
        {
          !state?.sessao?.IdCliente ? (

            <TouchableOpacity onPress={() => navigate.navigate('Login')}>
              <ContentContainer>
                <View style={styles.optionContainer}>
                  <View style={styles.optionTextAndIcon}>
                    <Ionicons name="md-person" size={25} color={theme.palette.dark} />

                    <View style={styles.optionTextContainer}>
                      <Typography size="medium" color={theme.palette.dark}>
                        Acessar
                      </Typography>
                      <Typography size="caption" color={theme.palette.light}>
                        <Text style={{ color: theme.palette.primary }}>
                          Entre
                        </Text>
                        <Text>
                          {' ou '}
                        </Text>
                        <Text style={{ color: theme.palette.primary }}>
                          cadastre-se
                        </Text>
                      </Typography>
                    </View>
                  </View>

                  <Ionicons name="ios-arrow-forward" size={25} color={theme.palette.light} />
                </View>
              </ContentContainer>
            </TouchableOpacity>
          )
            : (
              <>
                <TouchableOpacity onPress={() => navigate.navigate('Perfil')}>
                  <ContentContainer>
                    <View style={styles.optionContainer}>
                      <View style={styles.optionTextAndIcon}>
                        <Ionicons name="md-person" size={25} color={theme.palette.dark} />

                        <View style={styles.optionTextContainer}>
                          <Typography size="medium" color={theme.palette.dark}>
                            Perfil
                          </Typography>
                          <Typography size="caption" color={theme.palette.light}>
                            Meus dados pessoais
                          </Typography>
                        </View>
                      </View>

                      <Ionicons name="ios-arrow-forward" size={25} color={theme.palette.light} />
                    </View>
                  </ContentContainer>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Indicação')}>
                  <ContentContainer>
                    <View style={styles.optionContainer}>
                      <View style={styles.optionTextAndIcon}>
                        <Ionicons name="md-gift" size={25} color={theme.palette.dark} />

                        <View style={styles.optionTextContainer}>
                          <Typography size="medium" color={theme.palette.dark}>
                            Indicação
                          </Typography>
                          <Typography size="caption" color={theme.palette.light}>
                            Indique e ganhe benefícios!
                          </Typography>
                        </View>
                      </View>

                      <Ionicons name="ios-arrow-forward" size={25} color={theme.palette.light} />
                    </View>
                  </ContentContainer>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Pedidos')}>
                  <ContentContainer>
                    <View style={styles.optionContainer}>
                      <View style={styles.optionTextAndIcon}>
                        <Ionicons name="ios-list-box" size={25} color={theme.palette.dark} />

                        <View style={styles.optionTextContainer}>
                          <Typography size="medium" color={theme.palette.dark}>
                            Pedidos
                          </Typography>
                          <Typography size="caption" color={theme.palette.light}>
                            Meu histórico de pedidos
                          </Typography>
                        </View>
                      </View>

                      <Ionicons name="ios-arrow-forward" size={25} color={theme.palette.light} />
                    </View>
                  </ContentContainer>
                </TouchableOpacity>
                <ContentContainer>
                  <View style={styles.optionContainer}>
                    <View style={styles.optionTextAndIcon}>
                      <Ionicons name="md-notifications" size={25} color={theme.palette.dark} />

                      <View style={styles.optionTextContainer}>
                        <Typography size="medium" color={theme.palette.dark}>
                          Notificações
                        </Typography>
                        <Typography size="caption" color={theme.palette.light}>
                          Minhas notificações recebidas
                        </Typography>
                      </View>
                    </View>

                    <Ionicons name="ios-arrow-forward" size={25} color={theme.palette.light} />
                  </View>
                </ContentContainer>
                <TouchableOpacity onPress={() => navigation.navigate('Cupons')}>
                  <ContentContainer>
                    <View style={styles.optionContainer}>
                      <View style={styles.optionTextAndIcon}>
                        <Ionicons name="md-pricetag" size={25} color={theme.palette.dark} />

                        <View style={styles.optionTextContainer}>
                          <Typography size="medium" color={theme.palette.dark}>
                            Cupons
                          </Typography>
                          <Typography size="caption" color={theme.palette.light}>
                            Meus cupons de desconto
                          </Typography>
                        </View>
                      </View>

                      <Ionicons name="ios-arrow-forward" size={25} color={theme.palette.light} />
                    </View>
                  </ContentContainer>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Localização')}>
                  <ContentContainer>
                    <View style={styles.optionContainer}>
                      <View style={styles.optionTextAndIcon}>
                        <Ionicons name="md-pin" size={25} color={theme.palette.dark} />

                        <View style={styles.optionTextContainer}>
                          <Typography size="medium" color={theme.palette.dark}>
                            Endereços
                          </Typography>
                          <Typography size="caption" color={theme.palette.light}>
                            Meus locais para entrega
                          </Typography>
                        </View>
                      </View>

                      <Ionicons name="ios-arrow-forward" size={25} color={theme.palette.light} />
                    </View>
                  </ContentContainer>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Pagamento')}>
                  <ContentContainer>
                    <View style={styles.optionContainer}>
                      <View style={styles.optionTextAndIcon}>
                        <Ionicons name="md-card" size={25} color={theme.palette.dark} />

                        <View style={styles.optionTextContainer}>
                          <Typography size="medium" color={theme.palette.dark}>
                            Pagamento
                          </Typography>
                          <Typography size="caption" color={theme.palette.light}>
                            Meus métodos de pagamento
                          </Typography>
                        </View>
                      </View>

                      <Ionicons name="ios-arrow-forward" size={25} color={theme.palette.light} />
                    </View>
                  </ContentContainer>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Tickets')}>
                  <ContentContainer>
                    <View style={styles.optionContainer}>
                      <View style={styles.optionTextAndIcon}>
                        <Ionicons name="md-chatboxes" size={25} color={theme.palette.dark} />

                        <View style={styles.optionTextContainer}>
                          <Typography size="medium" color={theme.palette.dark}>
                            Atendimento
                          </Typography>
                          <Typography size="caption" color={theme.palette.light}>
                            Minhas conversas com estabelecimento
                          </Typography>
                        </View>
                      </View>

                      <Ionicons name="ios-arrow-forward" size={25} color={theme.palette.light} />
                    </View>
                  </ContentContainer>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Ajuda')}>
                  <ContentContainer>
                    <View style={styles.optionContainer}>
                      <View style={styles.optionTextAndIcon}>
                        <Ionicons name="md-help-circle" size={25} color={theme.palette.dark} />

                        <View style={styles.optionTextContainer}>
                          <Typography size="medium" color={theme.palette.dark}>
                            Ajuda
                          </Typography>
                          <Typography size="caption" color={theme.palette.light}>
                            Perguntas frequentes
                          </Typography>
                        </View>
                      </View>

                      <Ionicons name="ios-arrow-forward" size={25} color={theme.palette.light} />
                    </View>
                  </ContentContainer>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => logoff()}>
                  <ContentContainer>
                    <View style={styles.optionContainer}>
                      <View style={styles.optionTextAndIcon}>
                        <Ionicons name="md-power" size={25} color={theme.palette.dark} />

                        <View style={styles.optionTextContainer}>
                          <Typography size="medium" color={theme.palette.dark}>
                            Sair
                          </Typography>
                          <Typography size="caption" color={theme.palette.light}>
                            Ir para tela de login
                          </Typography>
                        </View>
                      </View>

                      <Ionicons name="ios-arrow-forward" size={25} color={theme.palette.light} />
                    </View>
                  </ContentContainer>
                </TouchableOpacity>
              </>
            )
        }
      </ScreenContainer>
    </>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
  },
  optionTextAndIcon: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTextContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 8,
  },
});

export default Account;
