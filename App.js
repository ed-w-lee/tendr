import React from 'react';
import Swiper from 'react-native-deck-swiper';
import { TouchableHighlight, Platform, Text, View, Button, Image, StyleSheet } from 'react-native';
import { Constants, Location, Permissions, WebBrowser } from 'expo';
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
        console.log('--->'+JSON.stringify(this.state.location));


        return (
            <View style={{ flex: 1 }}>

                <TouchableHighlight style={{ flex: 1 }}
                    onPress={() =>
                        navigate('Chicken', { user: 'Lucy', location: this.state.location, stringLocation: JSON.stringify(this.state.location) })} >

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
        chickenJson: null,
        Cards: ['nnn']
    }

    verticalSwipe = false;


    _getChickenInfo = async (location) => { // When we set up a server, we will actually use location
        // currently reading off a json file to simulate retrieving from Yelp
        // reason for this is that we do not have a server set up and we do not want to
        // expose our API key
        console.log(location);
        if(!location){
            return;
        }
        console.log(location["coords"]);
        console.log(JSON.parse(JSON.stringify(location))["coords"]);
        let coords = location["coords"];

        let temp = await fetch('https://ca5a937a.ngrok.io?latitude='+coords['latitude']+'&longitude='+coords['longitude'] )
        .then((response)=>response.json())
        .then((responseJson)=>{
            return responseJson.businesses;
            });
        this.setState({chickenJson:temp});
        console.log("ChickenJson -----> ");
        console.log(this.state.chickenJson);
        this.setState({Cards:this.state.chickenJson});
        console.log("this.state.Cards ->\n\n\n\n\n ");
        console.log(this.state.Cards);
        }

componentWillMount(){
        const { params } = this.props.navigation.state;
        console.log("Render : " + params.user);
        console.log("Render : " + params.location);
        console.log("Render : " + params.stringLocation);
        console.log(JSON.stringify(params.location));
        this._getChickenInfo(params.location);
};

    render() {
                //TODO change string to food[0]['businesses']
        //TODO change name to card['name']
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>



                <Swiper
                    verticalSwipe={false}
                    cards={this.state.Cards}
                    renderCard={(card) => {
                        return (
                            <View style={styles.card}>
                                <Text style={styles.title}>{card.name}</Text>
                                <Image source={{ uri: card.image_url }}
                                style={styles.centerCard} />
                            </View>
                        )
                    }}

                    onSwipedRight={(cardindex) => {
                        navigate('FinalScreen', {place: this.state.Cards[cardindex]})
                        console.log('RIGHT');
                    }}

                    onSwiped={(cardIndex) => { console.log(cardIndex) }}
                    onSwipedAll={() => {
                        <View>
                        <Image source={{ uri: 'https://m.popkey.co/a66c16/46E01.gif'}}
                        style ={{flex: 1}} />
                        </View>
                        console.log('onSwipedAll');
                        }}
                    cardIndex={0}
                    backgroundColor={'#4FD0E9'}>
                </Swiper>

            </View>
        );

    }


}
class FinalScreen extends React.Component {
    static navigationOptions = {
        title: 'Restaurant',
    };
    render() {
        const { params } = this.props.navigation.state;
        return (
            <View style={styles.container}>
            <Button style={{flex: 1}}
                title= "Best Chicken Around You!!"
                onPress = {this._handleButtonAsync(params.place.url)} />
            </View>
        );
    }

    _handleButtonAsync = async(url) => {
        let result = await WebBrowser.openBrowserAsync(url)
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

    },
    FinalScreen: {
        screen: FinalScreen
    }
},
    { headerMode: 'none' }
);


export default class App extends React.Component {

    render() {
        return <SimpleApp />;
    }
}
