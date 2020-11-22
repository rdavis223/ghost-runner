import * as React from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, Button } from 'react-native';
import { GoogleMap, DistanceMatrixService } from "@react-google-maps/api";

import * as Location from 'expo-location'
import ProgressBar from './../../components/ProgressBar.js';

export default class MapScreen extends React.Component {
  constructor({ navigation }){
    super()
    this.navigation = navigation;
    global.navigation = navigation;


    this.state = {
      lat: -49.98491666389771,
      long: -81.24528725322716,
      TIME_ELAPSED: 0,
      PLAYER_ORIGIN_LONG: 0,
      PLAYER_ORIGIN_LAT: 0,
      PLAYER_DESTINATION_LONG: 0,
      PLAYER_DESTINATION_LAT: 0,
      PLAYER_DISTANCE: 0,
      PLAYER_CURRENT_DISTANCE: 0,
      GHOST_ORIGIN: 0,
      GHOST_DESTINATION: 0,
      GHOST_DISTANCE: 0,
      PLAYER_PROGRESS: 30,
      GHOST_PROGRESS: 40,
      PLAYER_DISTANCES: [],
      GHOST_DISTANCES: [],
      RACE_LENGTH: 2000
    }
  }

  componentDidMount(){
    this.interval = setInterval(() => {
      this.setState({
        TIME_ELAPSED: (this.state.TIME_ELAPSED + 20),
        PLAYER_ORIGIN_LONG: (this.state.PLAYER_DESTINATION_LONG),
        PLAYER_ORIGIN_LAT: (this.state.PLAYER_DESTINATION_LAT),
      })
      console.log("Running for: ", this.state.TIME_ELAPSED, " seconds.")
      Location.getCurrentPositionAsync({accuracy: Location.Accuracy.BestForNavigation})
        .then((location) => {
          this.setState({
            lat: location["coords"]["latitude"],
            long: location["coords"]["longitude"],
            PLAYER_DESTINATION_LONG: location["coords"]["longitude"],
            PLAYER_DESTINATION_LAT: location["coords"]["latitude"]
          });
          // console.log(this.state.lat, this.state.long)
          // Get the ghost's distance at TIME_ELAPSED seconds.
          url = "https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins="+
            this.state.PLAYER_ORIGIN_LAT        + ", " +
            this.state.PLAYER_ORIGIN_LONG       + "&destinations=" +
            this.state.PLAYER_DESTINATION_LAT   + ", "+
            this.state.PLAYER_DESTINATION_LONG  + "&mode=walking&key=AIzaSyD8LiaQi4w3UySiDfi_38xpGvJ2iqFv7Hk";
          // console.log("URL is: ", url)
          // distance fetch
          fetch(url)
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              const distance = data.rows[0].elements[0].distance.text.split(' ')[0]
              this.setState({
                PLAYER_CURRENT_DISTANCE: distance,
              })
            });
          
          this.setState({
            PLAYER_DISTANCE: parseInt(parseInt(this.state.PLAYER_DISTANCE) + parseInt(this.state.PLAYER_CURRENT_DISTANCE)),
          })
          // console.log("Player Distance is now: ", this.state.PLAYER_DISTANCE)
          this.state.PLAYER_DISTANCES.push(this.state.PLAYER_DISTANCE)
          // console.log("Player Distances is now: ", this.state.PLAYER_DISTANCES)
          // const ghost_index = this.state.TIME_ELAPSED / 20
          // this.state.GHOST_DISTANCE = this.state.GHOST_DISTANCES[ghost_index]
          // if (this.state.GHOST_DISTANCE < this.state.PLAYER_DISTANCE) {
          //   console.log("You're ahead of the ghost, keep up the pace!")
          // }
          // //
          // else if (this.state.GHOST_DISTANCE == this.state.PLAYER_DISTANCE) {
          //   console.log("You're tied with the ghost, time to pick up the pace!")
          // }
          // //
          // else {
          //   console.log("You're behind the ghost, what a spooooooky place to be!")
          // }

        });
    }, 20000);
  }
  
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  updatePlayerBar = (player_distance, race_distance) => {
    PLAYER_PROGRESS = (player_distance - race_distance) * 100;
    GHOST_PROGRESS = (player_distance - race_distance) * 100;
  }

  updateGhostBar = (ghost_distance, race_distance) => {
    PLAYER_PROGRESS = (ghost_distance - race_distance) * 100;
    GHOST_PROGRESS = (ghost_distance - race_distance) * 100;
  }

  render() {
    return (
    <View style={styles.container}>
      {/* Map Object */}
      <MapView
        region={{
          latitude: this.state.lat,
          longitude: this.state.long,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        style={styles.mapStyle}
      />        
      {/* Menu Item 1 */}
      <Text 
        onPress = { () => this.navigation.navigate('Ghost')} 
        style={styles.ghost}
        >Ghost
      </Text>
      {/* Menu Item 2 */}
      {global.signedIn ? (null) : 
      (<Text 
        onPress = { () => this.navigation.navigate('Login')} 
        style={styles.login}
        >Login
      </Text>)}
      {/* Menu Item 3 */}
      { global.signedIn ?
      (<Text 
        onPress = { () => this.navigation.navigate('Profile')} 
        style={styles.profile}
        >Profile
      </Text>
      ) : (null)}
      {/* Player Progress Bar */}
      <View style={styles.progress1}>
        <ProgressBar icon="run" progress={this.state.PLAYER_PROGRESS}/>
      </View>
      {/* Ghost Progress Bar */}
      <View style={styles.progress2}>
        <ProgressBar icon="ghost" progress={this.state.GHOST_PROGRESS}/>
      </View>
    </View>
    )
  }

  restRequest() {
    url = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=-49.98491666389771,-81.24528725322716&destinations=-49.6905615%2C-81.9976592&key=AIzaSyD8LiaQi4w3UySiDfi_38xpGvJ2iqFv7Hk";
    fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
    });
    
    // const origin = {lat: -49.98491666389771, lng: -81.24528725322716}
    // const destination = {lat: -50, lng: -81}

    // service = new google.maps.DistanceMatrixService();
    // <DistanceMatrixService
    // options=
    //   {{
    //     destinations: [origin],
    //     origins: [destination],
    //     travelMode: "WALKING",
    //   }}
    // callback = {(response) => {console.log(response)}}
    // />
  }
}

//   componentDidMount() {
//     this.interval = setInterval(() => 
//       // Calculate player's distance travelled
//       player_distance = require('google-distance'),
//       player_distance.get(
//         {
//           origin:       this.PLAYER_ORIGIN,
//           destination:  this.PLAYER_DESTINATION
//         },
//         function(err, data) {
//           if (err) return console.log(err);
//           console.log(data);
//         }
//       ),
//       this.PLAYER_DISTANCES.push(player_distance),
//       // Calculate ghost's distance travelled
//       ghost_distance = require('google-distance'),
//       ghost_distance.get(
//         {
//           origin:       this.GHOST_ORIGIN,
//           destination:  this.GHOST_DESTINATION
//         },
//         function(err, data) {
//           if (err) return console.log(err);
//           console.log(data);
//         }
//       ),
//       this.GHOST_DISTANCES.push(ghost_distance),
//       this.setState({PLAYER_PROGRESS: (PLAYER_PROGRESS + 1)}),
//       this.updatePlayerBar(this.PLAYER_PROGRESS, 500), 20000);
//   }
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  ghost: {
    position: "absolute",
    bottom: 50,
    fontWeight: 'bold',
    paddingLeft: 300,
  },
  login: {
    position: "absolute",
    bottom: 100,
    fontWeight: 'bold',
    paddingLeft: 300,
  },
  profile: {
    position: "absolute",
    bottom: 150,
    fontWeight: 'bold',
    paddingLeft: 300,
  },
  GhostPickerButton: {
    position: "absolute",
  },
  progress1: {
    position: "absolute",
    top: 10,
    // color: "black"
  },
  progress2: {
    position: "absolute",
    top: 40,
    // color: "black"
  }
});