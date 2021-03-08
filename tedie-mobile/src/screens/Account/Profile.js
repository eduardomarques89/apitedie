import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
// components
import Navbar from '../../components/Navbar'
import Typography from '../../components/Typography'
import ScreenContainer from '../../components/ScreenContainer'
import Box from '../../components/Box'
import TextField from '../../components/TextField'
import Button from '../../components/Button'
// theme
import theme from '../../theme'
import {useNavigation} from '@react-navigation/native'

const Profile = ({ navigation }) => {
  const navigate = useNavigation()
  return (
    <React.Fragment>
      <Navbar
        left={
          <TouchableOpacity hitSlop={theme.hitSlop} onPress={() =>{
            if(navigate.canGoBack()){
              navigate.goBack()
            }
          } }>
            <Ionicons name="md-arrow-back" size={25} color="#fff" />
          </TouchableOpacity>
        }
        title={
          <Typography size="small" color="#fff">
            Seus Dados
          </Typography>
        }
      />

      <ScreenContainer>
        <View style={styles.formContainer}>
          <Box direction="row" justify="center" alignItems="center">
            <TextField
              width="50%"
              label="Nome"
            />
            <TextField
              width="50%"
              label="Sobrenome"
            />
          </Box>

          <Box direction="row" justify="center" alignItems="center">
            <TextField
              label="E-mail"
            />
          </Box>

          <Box direction="row" justify="center" alignItems="center">
            <TextField
              label="Telefone"
            />
          </Box>

          <Box direction="row" justify="center" alignItems="center">
            <TextField
              label="CPF"
            />
          </Box>
        </View>
        

        <Button 
          background={theme.palette.secondary}
          color={theme.palette.primary}
          width="100%"
          text="Salvar"
        />
      </ScreenContainer>
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 16
  }
})

export default Profile