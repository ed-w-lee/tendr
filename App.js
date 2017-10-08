import React from 'react';
import Swiper from 'react-native-deck-swiper';
import { TouchableHighlight, Platform, Text, View, Button, Image, StyleSheet } from 'react-native';
import { Constants, Location, Permissions } from 'expo';
import {
    StackNavigator
} from 'react-navigation'; // 1.0.0-beta.13

class HomeScreen extends React.Component {

    static navigationOptions = {
        title: 'Welcome',
    };
    state = {
        location: null,
        errorMessage: null,
    }

    componentWillMount() {
        if (Platform.OS === 'android' && !Constants.isDevice) {
            this.setState({
                errorMessage: 'Oops, this will not work on Sketch.'
            });
        } else {
            this._getLocationAsync();

        }

    }


    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);

        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
        }

        let location = await Location.getCurrentPositionAsync({});
        this.setState({ location });
    };

    render() {

        let text = 'Waiting..';

        if (this.state.errorMessage) {
            text = this.state.errorMessage;
        } else if (this.state.location) {
            text = JSON.stringify(this.state.location);
        }
        const { navigate } = this.props.navigation;



        return (
            <View style={{ flex: 1 }}>

                <TouchableHighlight style={{ flex: 1 }}
                    onPress={() =>
                        navigate('Chicken', { location: this.state.location })} >

                    <Image source={{ uri: 'https://scontent-lax3-2.xx.fbcdn.net/v/t34.0-12/22359145_1463978777032237_1019828485_n.png?oh=2bef57f36b622cb5e24eea2566016184&oe=59DB697E' }}
                        style={styles.fit} />
                </TouchableHighlight>

            </View>
        );

    }


}

class ChickenScreen extends React.Component {

    static navigationOptions = {
        title: 'Chicken',
    };

    state = {
        chickenJson: null
    }

    verticalSwipe = false;


    _getChickenInfo = async (location) => { // When we set up a server, we will actually use location
        // currently reading off a json file to simulate retrieving from Yelp
        // reason for this is that we do not have a server set up and we do not want to
        // expose our API key
        this.state.chickenJson = fetch('10.105.223.72:3000', {
            method: 'GET',
            body: JSON.stringify({
                latitude: location['latitude'],
                longitude: location['longitude']
            })
        });
    }

    componentWillMount() {
        this._getChickenInfo(this.props.navigation.state.location);
    }

    render() {
        const { params } = this.props.navigation.state;
        //TODO change string to food[0]['businesses']
        //TODO change name to card['name']

        return (
            <View style={styles.container}>

                <Image source={{ uri: 'https://media.giphy.com/media/VofiGkwOdH2fu/200.gif' }}
                    style={styles.fit} />


                <Swiper
                    verticalSwipe={false}
                    cards={this.state.chickenJson['businesses']}
                    renderCard={(card) => {
                        return (
                            <View style={styles.card}>
                                <Text style={styles.title}>{card}</Text>
                                <Image source={{ uri: 'https://s3-media4.fl.yelpcdn.com/bphoto/8T2efLPtg5s56BeRCYStfw/o.jpg' }}
                                    style={styles.centerCard} />

                            </View>
                        )
                    }}
                    onSwiped={(cardIndex) => { console.log(cardIndex) }}

                    cardIndex={0}
                    backgroundColor={'#4FD0E9'}>
                </Swiper>

            </View>
        );

    }


}

const styles = StyleSheet.create({
    fit: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF'
    },
    card: {
        flex: 1,
        flexDirection: 'column',
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#E8E8E8',
        justifyContent: 'flex-start',
        backgroundColor: 'white',
    },
    text: {
        textAlign: 'center',
        fontSize: 50,
        backgroundColor: 'transparent'
    },
    title: {
        textAlign: 'center',
        fontSize: 50,
        backgroundColor: 'transparent'
    },
    centerCard: {
        flex: 2,
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        borderWidth: 1,
        width: 315,
        height: 150
    }

});

const SimpleApp = StackNavigator({
    Home: {
        screen: HomeScreen


    },

    Chicken: {
        screen: ChickenScreen

    }
},
    { headerMode: 'none' }
);


export default class App extends React.Component {

    render() {
        return <SimpleApp />;
    }
}
