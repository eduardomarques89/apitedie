import React, { useEffect, useState } from 'react';
import { TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AirbnbRating } from 'react-native-ratings';
// components
import { useNavigation } from '@react-navigation/native';
import theme from '../../theme';
import Navbar from '../../components/Navbar';
import Typography from '../../components/Typography';
import ScreenContainer from '../../components/ScreenContainer';
import ContentContainer from '../../components/ContentContainer';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import api from '../../services/axios';

const Rating = ({ navigation, route }) => {
  const navigate = useNavigation();
  const [review, setReview] = useState({
    value: 3,
    content: 'Ok',
  });
  const [order, setOrder] = useState({});
  const [value, setValue] = useState('observação');
  const { order: orderParams } = route.params;

  useEffect(() => {
    if (orderParams) {
      setValue(orderParams.Observacao);
      setOrder(orderParams);
    }
  }, [orderParams]);

  async function postRating() {
    try {
      await api.post(`Pedidos/${orderParams.NumeroPedido}/Avaliacao?nota=${review.value}&observacao=${value}`);
      alert('Avaliação feita com sucesso');
    } catch (e) {
      alert('error, tente novamente');
    }
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
            Avaliar
          </Typography>
        )}
      />

      <ScreenContainer>
        <>
          <Typography size="medium" color={theme.palette.dark}>
            {order?.Score ? <>{`Sua avaliação do pedido #${order.NumeroPedido} de R$ ${(order?.Valor || 0).toFixed(2).replace('.', ',')} no Big Bom!`}</>
              : (
                <>
                  {`Avalie seu pedido #${order?.NumeroPedido} de R$ ${(order?.Valor || 0).toFixed(2).replace('.', ',')} no Big Bom!`}
                </>
              )}
          </Typography>
          <ContentContainer>
            <Typography size="medium" color={theme.palette.dark}>
              Sua nota
            </Typography>
            <AirbnbRating
              defaultRating={review.value}
              isDisabled={order?.Score}
              onFinishRating={(e) => setReview((props) => ({
                ...props,
                value: e,
              }))}
              reviews={['1 estrela', '2 estrelas', '3 estrelas', '4 estrelas', '5 estrelas']}
              unSelectedColor="#eee"
            />
          </ContentContainer>
          <ContentContainer>
            <Typography size="medium" color={theme.palette.dark}>
              {`${order?.Score ? 'Sua' : 'Deixe uma'} Observação`}

            </Typography>
            <TextField
              width="100%"
              label="Observação"
              useContainerWidth
              value={value}
              setValue={setValue}
              inputStyle={{ color: '#000' }}
            />
          </ContentContainer>
          {
                !order?.Score
              && (
              <Button
                background={theme.palette.primary}
                color="#fff"
                width="100%"
                text="Enviar"
                onPress={postRating}
              />
              )
              }
        </>
      </ScreenContainer>
    </>
  );
};

export default Rating;
