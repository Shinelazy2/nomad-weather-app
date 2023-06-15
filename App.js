import { StatusBar  } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import * as Location from 'expo-location'
import { Fontisto } from '@expo/vector-icons'

const icons = {
  "Clouds": 'cloudy',
  "Clear": 'day-sunny',
  "Snow" : 'snow',
  "Rain" : 'rains',
  "Drizzle" : 'rain',
  "Thunderstorm" : "lightning",
  "Atmosphere" : 'cloudy-gusts'
}

const { height, width: SCRENN_WIDTH }=Dimensions.get('window')

const API_KEY = 'd2bdc2d971e90a3a5410be6bbe070028'
const API_URL = ''
export default function App() {
  const [city , setCity] = useState('Loading...')
  const [ days, setDays ] = useState([])
  const [ ok, setOk ] = useState(true)

  const getWeather = async () => {
    const {granted} = await Location.requestForegroundPermissionsAsync()
    if(!granted) {
      setOk(false)
    }

    /** TODO: accuracy 설정해줘야함. 
     * https://nomadcoders.co/react-native-for-beginners/lectures/3126
    */
    const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy: 5})
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, { useGoogleMaps: false})
    setCity(location[0].district + '\n' + location[0].street)
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`)
    const json = await response.json()
    setDays(json.daily)
  }

  useEffect(() => {
    getWeather()
  }, [])

  return (
    <View style={styles.container}>
      <StatusBar style="auto"></StatusBar>

      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView 
        pagingEnabled 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? 
          <View style={{...styles.day, alignItems: 'center'}}>
            <ActivityIndicator color='white' style={{marginTop: 10}} size='large'  />
          </View> 
          : 
            days.map((day, index) => (
            <View key={index} style={styles.day}>
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
                <Fontisto name={icons[day.weather[0].main]} size={68} color="white"></Fontisto>
              </View>
              <Text style={styles.decription}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>

            </View>
          ))
        }
        
       
      </ScrollView>
      
      <View style={styles.city}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'column', 
    backgroundColor: 'teal'
  },
  text: {
    fontSize: 25,
    // color: 'red'
  },
  city: {
    flex: 3,
    // backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cityName: {
    marginTop: 20,
    fontSize: 40,
    fontWeight: '500',
    color: 'white',
    alignItems: 'center'
  },
  /** flex 없어야됨. scrollView 때문. */
  weather: {
  },
  day: {
    width: SCRENN_WIDTH,
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    
    
  },
  temp: {
    fontSize: 120,
    marginTop: 10,
    color: 'white'
  },
  decription: {
    marginTop: -30,
    fontSize: 60,
    color: 'white'
  },
  tinyText: {
    fontSize: 30,
    color: 'white'

  }
});
