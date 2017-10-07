import React from 'react';
import { Platform, Text, View, StyleSheet, Button } from 'react-native';
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
            <Button
            title="Let's go get chicken!"
            onPress={() => 
            navigate('Chicken', {location: this.state.location})
            }
            />
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

    _getChickenInfo = async (location) => { // When we set up a server, we will actually use location
        // currently reading off a json file to simulate retrieving from Yelp
        // reason for this is that we do not have a server set up and we do not want to
        // expose our API key
        this.state.chickenJson = require('./assets/chicken.json')['businesses'];
    }

    componentWillMount() {
        this._getChickenInfo(this.state.location);
    }

    render() {
        const { params } = this.props.navigation.state;
        text = JSON.stringify(params.location['coords']);
        chickenText = JSON.stringify(this.state.chickenJson);
        return (
            <View>
                <Text> Chat with {text} </Text>
                <Text> {chickenText} </Text>
            </View>
        );
    }
}

const SimpleApp = StackNavigator({
    Home: {
        screen: HomeScreen
    },
    Chicken: {
        screen: ChickenScreen
    },
});

export default class App extends React.Component {
    render() {
        return <SimpleApp />;
    }
}
