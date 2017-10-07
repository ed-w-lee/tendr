import React from 'react';
import { Platform, Text, View, Button, Image, StyleSheet } from 'react-native';
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
            <View>
                <Image source={{uri: 'https://scontent-lax3-2.xx.fbcdn.net/v/t35.0-12/22323708_1463306457099469_1587138_o.png?oh=fa403b4ec107b74f588cf11bdd189ca3&oe=59DAD5C5'}}
                resizeMode={'contain'}
                style={styles.fit}
            />
            
            <Button
            title="Let's go get chicken!"
            onPress={() => 
            navigate('Chicken', {location: this.state.location})
            }
            />
            </View>
        );
    }
}

class ChickenScreen extends React.Component {
    static navigationOptions = {
        title: 'Chicken',
    };
    render() {
        const { params } = this.props.navigation.state;
        let text = JSON.stringify(params.location['coords']);
        return (
            <View>  
                <Text> Chat with {text} </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  fit: {
    width: 360,
    height: 148,
  }
});

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