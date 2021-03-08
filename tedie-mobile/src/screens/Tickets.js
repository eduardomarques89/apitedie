import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
// components
import theme from '../theme'
import Navbar from '../components/Navbar'
import Typography from '../components/Typography'
import ScreenContainer from '../components/ScreenContainer'
import TicketItem from '../components/TicketItem'
import {useNavigation} from '@react-navigation/native'

const Tickets = ({ navigation }) => {
  const navigate = useNavigation()
  const tickets = [
    {
      "Pedido": "1234",
      "Empresa": "Mercado",
      "Data": "27/10/2020",
      "Status": "Aberto" 
    },
    {
      "Pedido": "1233",
      "Empresa": "Mercado",
      "Data": "15/10/2020",
      "Status": "Fechado" 
    },
    {
      "Pedido": "1232",
      "Empresa": "Mercado",
      "Data": "03/10/2020",
      "Status": "Fechado" 
    }
  ]

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
            Atendimento
          </Typography>
        }
      />

      <ScreenContainer>
        {tickets.length > 0 && tickets.map(ticket => (
          <TouchableOpacity onPress={() => navigation.push("Ticket")}>
            <TicketItem ticket={ticket} key={ticket.Pedido} />
          </TouchableOpacity>
        ))}
      </ScreenContainer>
    </React.Fragment>
  )
}

export default Tickets
