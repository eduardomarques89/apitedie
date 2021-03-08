import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { AirbnbRating } from 'react-native-ratings'
// components
import theme from '../theme'
import Navbar from '../components/Navbar'
import Typography from '../components/Typography'
import ScreenContainer from '../components/ScreenContainer'
import ContentContainer from '../components/ContentContainer'
import TextField from '../components/TextField'
import Button from '../components/Button'
import {useNavigation} from '@react-navigation/native'

const Rating = ({ navigation, route }) => {
  const navigate = useNavigation()
  const { review } = route.params

  return (
    <React.Fragment>
      <Navbar
        left={
          <TouchableOpacity hitSlop={theme.hitSlop} onPress={() => {
            if(navigate.canGoBack()){
              navigate.goBack()
            }
          }}>
            <Ionicons name="md-arrow-back" size={25} color="#fff" />
          </TouchableOpacity>
        }
        title={
          <Typography size="small" color="#fff">
            Avaliar
          </Typography>
        }
      />

      {!review && (
        <ScreenContainer>
          <Typography size="medium" color={theme.palette.dark}>
            Avalie seu pedido #0003 de R$245,00 no Big Bom!
          </Typography>

          <ContentContainer>
            <Typography size="medium" color={theme.palette.dark}>
              Sua nota
            </Typography>

            <AirbnbRating
              reviews={["Péssimo", "Ruim", "Ok", "Bom", "Incrível!"]} 
            />
          </ContentContainer>

          <ContentContainer>
            <Typography size="medium" color={theme.palette.dark}>
              Deixe uma observação
            </Typography>

            <TextField
              width="100%"
              label="Observação"
              useContainerWidth
            />
          </ContentContainer>

          <Button
            background={theme.palette.primary}
            color="#fff"
            width="100%"
            text="Enviar"
            onPress={() => alert('woohoo')}
          />
        </ScreenContainer>
      )}

      {review && (
        <ScreenContainer>
          <Typography size="medium" color={theme.palette.dark}>
            Sua avaliação do pedido #0003 de R$245,00 no Big Bom!
          </Typography>

          <ContentContainer>
            <Typography size="medium" color={theme.palette.dark}>
              Sua nota
            </Typography>

            <AirbnbRating
              defaultRating={review.nota}
              reviews={["Péssimo", "Ruim", "Ok", "Bom", "Incrível!"]} 
              isDisabled
            />
          </ContentContainer>

          <ContentContainer>
            <Typography size="medium" color={theme.palette.dark}>
              Sua Observação:
            </Typography>

            <Typography size="small" color={theme.palette.dark}>
              "{review.message}"
            </Typography>
          </ContentContainer>
        </ScreenContainer>
      )}
    </React.Fragment>
  )
}

export default Rating
