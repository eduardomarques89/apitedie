import React, { useContext, useEffect, useRef, useState } from 'react'
import { StyleSheet, View, TextInput, Text, Image,BackHandler } from 'react-native'
// theme
import TextField from '../components/TextField'
import Box from '../components/Box'
import Button from '../components/Button'
import theme from '../theme'
import Typography from '../components/Typography'
import { login, postCliente } from '../services/clients'
import { AppContext } from '../contexts/AppContext'
import Toast from 'react-native-easy-toast'
import {useNavigation} from '@react-navigation/native'
import logo from '../assets/logo_amarelo_grande.png'

const Login = ({ route }) => {
  const navigate = useNavigation()
  const [code,setCode] = useState({
    code1:'',
    code2:'',
    code3:'',
    code4:'',
    code5:'',
    code6:''
  })
  const refArray = [useRef(),useRef(),useRef(),useRef(),useRef(),useRef()]
  const { state, dispatch } = useContext(AppContext);

  function changeText(index,value,code){
    if(!Number(value) && value  !== ''){
      return
    }
    setCode(props => ({...props,[code]:value[value.length-1]}))

    if(!refArray[index+1]){
      navigate.goBack()
      navigate.goBack()
      return
    }else if(value !== ''){
      refArray[index+1].current.focus()
    }
  }

  return (
    <View style={styles.container}>
         <Box direction="column" justify="center" alignItems="center" >
           <Image source={logo} style={{width:140,height:180,resizeMode:'contain'}}/>
          </Box>

        <Text style={styles.text}>Insira o Código de autenticação</Text>
        <View style={styles.containerNumber}>
            <TextInput 
              style={styles.number} 
              keyboardType="decimal-pad" 
              ref={refArray[0]}  value={code.code0} onChangeText={e => changeText(0,e,'code0')}/>
            <TextInput 
              style={styles.number} 
              keyboardType="decimal-pad" 
              ref={refArray[1]}  
              value={code.code1} 
              onChangeText={e => changeText(1,e,'code1')}/>
            <TextInput 
              style={styles.number} 
              keyboardType="decimal-pad" 
              ref={refArray[2]}  
              value={code.code2} 
              onChangeText={e => changeText(2,e,'code2')}/>
            <TextInput 
              style={styles.number} 
              keyboardType="decimal-pad" 
              ref={refArray[3]}  
              value={code.code3} 
              onChangeText={e => changeText(3,e,'code3')}/>
            <TextInput 
              style={styles.number} 
              keyboardType="decimal-pad" 
              ref={refArray[4]}  
              value={code.code4} 
              onChangeText={e => changeText(4,e,'code4')}/>
            <TextInput 
              style={styles.number} 
              keyboardType="decimal-pad" 
              ref={refArray[5]}  
              value={code.code5} 
              onChangeText={e => changeText(5,e,'code5')}/>
        </View>
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.palette.primary,
    alignItems:'center',
    // justifyContent:'center',
    paddingHorizontal:16,
},
containerNumber:{
    justifyContent:'space-between',
    flexDirection:'row',
    alignItems:'center',
    width:"100%",
  },
  number:{
    width:50,
    height:70,
    fontSize:20,
    alignItems:'center',
    textAlign:'center',
    justifyContent:'center',
    borderRadius:20,
    backgroundColor:"#fff"
  },   
  text:{
    fontSize:24,
    color:"#fff",
    textAlign:'center',
    marginBottom:16,
    marginTop:64
  }, 
  logoPlaceholder: {
    fontSize: 48,
    fontWeight: 'bold',
    color: theme.palette.secondary
  }
})

export default Login

