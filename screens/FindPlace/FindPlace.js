import React, { Component } from 'react';
import { View , Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { getPlaces } from '../../components/store/actions'


import { connect } from 'react-redux';
import PlaceList from '../../components/PlaceList';

class FindPlace extends Component{

    state = {
       placesLoaded: false,
       removeAnimation: new Animated.Value(1)
    };
    componentDidUpdate(){
        if(this.props.token){
            this.props.getPlaces();
        }

    }
    static navigationOptions = {
         tabBarLabel: "Find Place"
    };
    onItemSelectedHandler = key => {
        const selPlace = this.props.places.find(place => {
                return place.key === key
            });
      this.props.navigation.push("PlaceDetail", selPlace)
    };
    placesLoadedHandler = () => {
        Animated.timing(this.state.removeAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }).start()
    };
    placesSearchHandler = () => {
        Animated.timing(this.state.removeAnimation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true
        }).start(() => {
            this.setState({
                placesLoaded: true
            });
            this.placesLoadedHandler();
        });
    };
    render(){
        let content = (
            <Animated.View style={{
                opacity: this.state.removeAnimation,
                transform: [
                    {
                        scale: this.state.removeAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [12, 1]
                        })
                    }
                ]
            }}>
            <TouchableOpacity onPress={this.placesSearchHandler}>
                <View style={styles.searchButton}>
                    <Text style={styles.searchButtonText}>Find Places</Text>
                </View>
            </TouchableOpacity>
            </Animated.View>
        );
        if(this.state.placesLoaded){
            content = (
                <Animated.View style={{
                    opacity: this.state.removeAnimation
                }}>
                    <PlaceList places={this.props.places} onItemSelect={this.onItemSelectedHandler}/>
                </Animated.View>
            )
        }
        return(
            <View style={this.state.placesLoaded ? null : styles.buttonContainer}>
                {content}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    buttonContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    },
    searchButton:{
        borderColor: "#2196F3",
        borderWidth: 3,
        borderRadius: 50,
        padding: 20
    },
    searchButtonText: {
        color: "#2196F3",
        fontWeight: "bold",
        fontSize: 24
    }
});

const mapStateToProps = state => {
    return {
        places: state.places.places,
        token: state.auth.token
    }
};
export default connect(mapStateToProps, { getPlaces })(FindPlace);