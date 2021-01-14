import React, { useState, useEffect } from 'react'
import { Feather as Icon } from '@expo/vector-icons'
import { View, Image, StyleSheet, Text, ImageBackground, SafeAreaView, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { text } from 'express';
// import {Picker} from '@react-native-picker/picker';
import RNPickerSelect from 'react-native-picker-select'
import axios from 'axios';

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}


export default function Home() {
  const navigation = useNavigation();

   function handleNavigateToPoints ()  {
    setTimeout( () =>{
      // alert('esperei')
      if (selectedCity != null && navegar.city != false ){
        navegar.uf != false 
        ? 
        navigation.navigate('Points', {
          selectedUF,
          selectedCity 
        })
        : null
        
      }else alert('Por favor, escolha uma cidade referente ao estado.')
        }, 1000  )
    

    
    
    


  }


  const [uf, setUf] = useState<string[]>([]);
  const [city, setCity] = useState<string[]>([]);

  const [selectedUF, setSelectedUF] = useState('');
  const [selectedCity, setSelectedCity] = useState('0');

  const [labelCity, setLabelCity] = useState('')
  const [labelUf, setLabelUf] = useState('UF.')

  const [navegar, setNavegar] = useState({
    city:false,
    uf:false
  })


  const [texto, setTexto] = useState({
    title:'Seu marketplace de coleta de resíduos',
    desc:'Ajudamos as pessoas a encontrar pontos de coleta de forma eficiente. ',
    padd1:20,
    padd2:30
  })

 function refreshFunc(){

  }

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
    .then(response => {
      const siglas = response.data.map(uf => uf.sigla);
      setUf(siglas);
  
    }).catch((error) => {  alert(error)})
  },[] )

  useEffect(() => {
    if (selectedUF === '0'){
      return 
    }

    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`)
    .then(response => {
      const cityNames = response.data.map(city => city.nome);
      
      setCity(cityNames);

      
    }).catch((error) => {  alert(error)})
  },[selectedUF ])



  return (
    <SafeAreaView style={{flex:1}} >
      <KeyboardAvoidingView style={{flex: 1}}  behavior={Platform.OS === 'ios'  ? 'padding' : undefined } >

      
      <ImageBackground source={require('../../../assets/home-background.png')}
      style={styles.container}
      imageStyle={{ width: 274, height: 368 }}
      >

            {/* <ScrollView style={{flex:1, }} > */}
        <View style={styles.main} >
          
            <Image   source={require('../../../assets/logo.png')} />


            <Text style={styles.title}>{texto.title}</Text>

              
            <Text style={styles.description} >{texto.desc}</Text>

        </View>
            {/* </ScrollView> */}

        <View style={styles.footer} >

        <View style={styles.pickerArea}>

          {/* <RNPickerSelect 
            placeholder={{label: 'UF', value: null, color: 'red'}}
            useNativeAndroidPickerStyle={false}
            style
          /> */}

                    <RNPickerSelect
          placeholder={{ label: labelUf, color:'red' ,value: null}}
          
          useNativeAndroidPickerStyle={false}
          style={{inputAndroid: styles.pickerSelectUF}}
            onValueChange={(uf, key) => (setSelectedUF(uf), setNavegar({city:false,uf:false})  )}
          
          items={

              uf.map(uf => (
              { label: uf, value: uf, color:'#000'  }
              
          ))} 
          
          />

          { 
          

      



          



          }





          {/* <TextInput 
            style={styles.input}
            placeholder="Digite a UF"
            value={uf}
            maxLength={2}
            autoCapitalize="characters"
            autoCorrect={false}
            onChangeText={setUf}
            
          /> */}

          {/* <TextInput 
            style={styles.input}
            placeholder="Digite a cidade"
            value={city}
            autoCorrect={false}
            

            onChangeText={setCity}
          /> */}

        <View>

        {  
            selectedCity != null ?  (

          <RNPickerSelect
              placeholder={{ label: 'Selecione uma cidade.', value: null, color: 'red'}}
              useNativeAndroidPickerStyle={false}
              style={{ inputAndroid: styles.pickerSelectCity }}
              onValueChange={(city) =>  ( setSelectedCity(city), setNavegar({city:false,uf:false}))}

              

              items={ 

                  city.map(city => ( { label: city, value: city,color:'#000' }))

              }
              
              />
            ): 
            ( 
              <RNPickerSelect 
              placeholder={{ label: 'Selecione uma cidade.', value: null, color: 'red'}}
              useNativeAndroidPickerStyle={false}
              style={{ inputAndroid: styles.pickerSelectCityNull }}
              onValueChange={(city) =>  ( setSelectedCity(city), setNavegar({city:true,uf:true}))}

              

              items={ 

                  city.map(city => ( { label: city, value: city,color:'#000' }))

              }
              
              />
            )
            

        }

        </View>
        </View>



          <RectButton style={styles.button} onPress={handleNavigateToPoints} >
            <View style={styles.buttonIcon} >
              <Text>
                <Icon name ="arrow-right" color="#fff" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText} >
              Entrar
            </Text>
          </RectButton>

        </View>

      </ImageBackground> 
      </KeyboardAvoidingView>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    backgroundColor:'#f0f0f5'

  },

  main: {
    flex: 1,
    justifyContent: 'center'
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,

    
    //--
    // marginTop: 5,
    //fontSize: 22,
    // marginBottom:5

  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,

    //----
    // marginBottom:10

  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

  pickerSelectUF:{
    fontSize: 18,
    fontFamily: 'Roboto_500Medium',
    width: 50,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 10,
    backgroundColor: '#fff',
    color:'#322153'
  },
  pickerSelectCity:{
    fontSize: 18,
    fontFamily: 'Roboto_500Medium',
    width: 220,
    paddingHorizontal: 5,
    paddingVertical: 12,
    borderWidth: 2,
    borderRadius: 10,
    paddingRight: 5,
    borderColor: '#fff',
    backgroundColor: '#fff',
    color:'#322153'

  },
  pickerSelectCityNull:{
    fontSize: 18,
    fontFamily: 'Roboto_500Medium',
    width: 240,
    paddingHorizontal: 5,
    paddingVertical: 12,
    borderWidth: 2,
    borderRadius: 10,
    paddingRight: 5,
    borderColor: 'red',
    backgroundColor: '#fff',
    color:'#bbb'
  },
  pickerArea:{
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  }

    
});
