import * as React from 'react';
import {View, StyleSheet,ImageBackground, Text, Image,Dimensions, ScrollView} from 'react-native'
import {List, Avatar, Divider} from 'react-native-paper'
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { TouchableOpacity } from 'react-native-gesture-handler';
class ProfileScreen extends React.Component{

    static navigationOptions = ({navigation})=>{
        return {
            headerTitle: 'Profile',
            headerStyle: {
              backgroundColor: '#4b8b3b',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
            fontWeight: 'bold',
            },
        }
    }

    constructor(props){
        super(props)
        this.state={
            userName: '',
            userPhoto: '',
            userNick: '',
            userObservations: [],
            noObs: 0
        }
    }

    componentDidMount(){
        database().ref('/users/').on("value", snapshot=>{
            this.getUserData()
        })
        
    }

    getUserData = async function () {
        // Get the users ID
        const uid = auth().currentUser.uid;
       
        // Create a reference
        const ref = database().ref(`/users/${uid}`);
       
        // Fetch the data snapshot
        const snapshot = await ref.once('value');

        let obs = snapshot.val().observations
        let observations = []
        for(let i in obs){
            let photUrl = obs[i].photoURL
            let location = obs[i].location
            let time = obs[i].time
            let isSingle = obs[i].isSingle===0?
            "Single Elephant":obs[i].isSingle===1?
            "Group of Elephant with Calves":obs[i].isSingle===2?
            "Group of Elephant with out Calves":""
            observations.push([photUrl, location, time, isSingle])
        }

        await this.setState({
            userName: snapshot.val().name,
            userPhoto: snapshot.val().photo,
            userNick: snapshot.val().name.toLowerCase().replace(/ /g, ''),
            userObservations: observations,
            noObs: observations.length
        })
      }

    render() {
        return (
            <View style={styles.container}>
                <ImageBackground blurRadius={1} style={styles.profileConatiner} source={{uri: this.state.userPhoto}}>
                    <Text style={styles.userNick}>{this.state.userNick}</Text>
                    <Image style={styles.userPhoto} source={{uri: this.state.userPhoto}}></Image>
                    <Text style={styles.userName}>{this.state.userName}</Text>
                    <Text style={styles.userNick}>Observations</Text>
                    <Text style={styles.obCount}>{this.state.noObs}</Text>
                </ImageBackground>

                <ScrollView style={styles.scrollView}>
                    <View style={styles.imgConatiner}>
                        {this.state.userObservations.map((val,i)=>{
                                return(
                                    <TouchableOpacity key={i}>
                                        <Image style={styles.img} source={{uri: val[0]}}/>
                                    </TouchableOpacity>
                                )
                            
                            })
                        }
                    </View>
                </ScrollView>
            </View>
            
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'stretch',
        width: '100%'
        //backgroundColor: getRandomColor(),
    },
    profileConatiner:{
        width: Dimensions.get('window').width,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    observationConatiner:{
        width: '100%',
    },
    userNick: {
        color: 'white'
    },
    userName: {
        fontWeight: 'bold',
        color: 'white'
    },
    obCount: {
        color: 'white',
        fontSize: 30
    },
    userPhoto: {
        width: 100, 
        height: 100,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: 'white'
    },
    img: {
        width: Dimensions.get('window').width/3.2, 
        height: Dimensions.get('window').width/3.5,
        borderWidth: 2, 
        margin: 2
    },
    imgConatiner: {
        flexDirection: 'row', 
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        width: Dimensions.get('window').width
    },
    scrollView: {
        width: Dimensions.get('window').width
    },
})
export default ProfileScreen;

