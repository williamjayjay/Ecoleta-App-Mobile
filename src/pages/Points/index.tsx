import React, { useEffect, useState } from 'react'
import Constants from 'expo-constants';
import { Feather as Icon } from '@expo/vector-icons';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native';
import Emoji from 'react-native-emoji';
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import api from '../../Services/api';
import * as Location from 'expo-location';

import {MapMarkerContainer, Market, MidMap} from './styles'

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface Point{
  id: number;
  name: string;
  image: string;
  latitude: number;
  longitude: number;

}

interface Params{
  selectedUF: string;
  selectedCity: string;
}

export default function Points() {
  const navigation = useNavigation();
  const route = useRoute();

  const routeParams = route.params as Params;
  
  
  const [points, setPoints] = useState<Point[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
  
  useEffect(() => {
    async function loadPosition(){
      const { status } = await Location.requestPermissionsAsync();  
      
      if (status !== 'granted'){
        Alert.alert('Temos um problema..', 'Precisamos da sua permissão para obter a localização no mapa.')
        return;
      }

      const locationUser = await Location.getCurrentPositionAsync();

      const { latitude, longitude } = locationUser.coords;

      setInitialPosition([latitude, longitude])
    }

    loadPosition();

  },[])

  useEffect(() => {
    api.get('items').then(response => {
      setItems(response.data);
  });
  }, []);

  useEffect(() => {
    api.get('points', {
      params: {
        city: routeParams.selectedCity,
        uf: routeParams.selectedUF,
        items: selectedItems
      }
    }).then(response => {
      setPoints(response.data);
    })
  },[selectedItems])

  function handleNavigateBack(){
    navigation.goBack();
  }

  function handleNavigateToDetail(id: number){
    navigation.navigate('Detail', { point_id: id });
  }
  
  function handleSelectItem(id: number){
    const alreadySelected = selectedItems.findIndex(item => item === id);

    if(alreadySelected >= 0){
      const filteredItems = selectedItems.filter(item => item !== id);

      setSelectedItems(filteredItems)
    }else {
      setSelectedItems([ ...selectedItems,id]);
    }
  }

  return (
    <SafeAreaView style={{flex:1}} >
    <View style={styles.container} >
      <TouchableOpacity onPress={handleNavigateBack} >
        <Icon name="corner-down-left" size={25} color="#34cb79" />
      </TouchableOpacity>

      <View style={{flexDirection:'row', alignItems:'center', marginTop:24}} >
        <Emoji name="smiley" style={{fontSize: 25, paddingRight:10}} />
        <Text style={styles.title} >Bem vindo.</Text>
      </View>
      <Text style={styles.description} >Encontre no mapa um ponto de coleta.</Text>

      <View style={styles.mapContainer} >
        { initialPosition[0] !== 0 && (
               <MapView 
               style={styles.map} 
               loadingEnabled={initialPosition[0] === 0 }
               initialRegion={{
                 latitude: initialPosition[0],
                 longitude: initialPosition[1],
                 latitudeDelta: 0.014,
                 longitudeDelta: 0.024,
       
               }}>
                 {points.map(point => (
                 <Marker 
                    key={String(point.id)}
                    style={styles.mapMarker}
                      onPress={() => handleNavigateToDetail(point.id)}
                      coordinate={{
                        latitude: point.latitude,
                        longitude: point.longitude,
                      }}
                  >
                   <MapMarkerContainer >
                     <MidMap>
       
                     <Image style={styles.mapMarkerImage} source={{ uri: point.image}} />
                     <Text style={styles.mapMarkerTitle} >{point.name}</Text>
       
                     </MidMap>
                     <Market/>
                   </MapMarkerContainer>
                 </Marker>
                 ))}
               </MapView>
        ) }
      </View>

    </View>
    <View style={styles.itemsContainer}>
      <ScrollView horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal:15 }}
      >

      {items.map(item => (
              <TouchableOpacity 
              key={String(item.id)} 
              style={[
                styles.item,
                selectedItems.includes(item.id) ? styles.selectedItem : {}
              ]} 
              activeOpacity={0.5}
              onPress={() => handleSelectItem(item.id)} >
              <SvgUri width={42} height={42} uri={item.image_url} />
              <Text style={styles.itemTitle} >{item.title}</Text>
            </TouchableOpacity>
      ))}

      </ScrollView>
    </View>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingTop: 32 
  },

  title: {
    fontSize: 20,
    fontFamily: 'Ubuntu_700Bold',
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Roboto_400Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 10,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80, 
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#34CB79',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',

    
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    color: '#FFF',
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 0,
    marginBottom: 15,
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',

    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#34CB79',
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 13,
  },
});