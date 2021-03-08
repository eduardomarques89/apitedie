import React,{useState,useContext} from 'react'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
// components
import Navbar from '../components/Navbar'
import Typography from '../components/Typography'
import ScreenContainer from '../components/ScreenContainer'
import Box from '../components/Box'
import TextField from '../components/TextField'
import Button from '../components/Button'
import { AppContext } from '../contexts/AppContext'
// theme
import theme from '../theme'
import {useNavigation} from '@react-navigation/native'

const Document = ({ navigation }) => {
  const { state, dispatch } = useContext(AppContext);
  const [cpf,setCpf] = useState("")
  const navigate = useNavigation()
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
            CPF na nota
          </Typography>
        }
      />

      <ScreenContainer>
        <Box direction="row" justify="center" alignItems="center">
          <TextField
            width="100%"
            label="CPF na nota"
            value={cpf}
            setValue={setCpf}
          />
        </Box>
        
        <Button 
          background={theme.palette.secondary}
          onPress = {() =>{
            dispatch({type:"addCpfOrCpnj",value:cpf})
          }}
          color={theme.palette.primary}
          width="100%"
          text="Salvar"
        />
      </ScreenContainer>
    </React.Fragment>
  )
}

export default Document