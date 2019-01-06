import React, {Component} from "react";
import {View, Text, Button, StyleSheet, Dimensions} from 'react-native';
import MapView from 'react-native-maps';


class PickLocation extends Component {
    componentWillMount(){
        this.reset()
    }
    reset = () => {
        this.setState({
            focusedRegion: {
                latitude: 37.7900352,
                longitude: -122.4013726,
                latitudeDelta: 0.0122,
                longitudeDelta: Dimensions.get('window').width / Dimensions.get('window').height * 0.0122
            },
            locationChosen: false
        })
    };
    pickLocationHandler = event => {
        const coords = event.nativeEvent.coordinate;
        this.map.animateToRegion({
            ...this.state.focusedRegion,
            latitude: coords.latitude,
            longitude: coords.longitude
        }, 1000);
        this.setState(prevState => {
            return {
                focusedRegion: {
                    ...prevState.focusedRegion,
                    latitude: coords.latitude,
                    longitude: coords.longitude
                },
                locationChosen: true
            }
        });
        this.props.onLocationPick({
            latitude: coords.latitude,
            longitude: coords.longitude
        })
    };
    getLocationHandler = () => {
        navigator.geolocation.getCurrentPosition( pos => {
            const coordsEvent = {
                nativeEvent: {
                    coordinate: {
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude
                    }
                }
            };
            this.pickLocationHandler(coordsEvent)
            },
            err => {
                console.log(err);
                alert('Fetching position failed please pick on manually')
            })
    };

    render() {
        let marker = null;
        if (this.state.locationChosen) {
            marker = <MapView.Marker coordinate={this.state.focusedRegion}/>
        }
        return (
            <View style={styles.container}>
                <MapView
                    onPress={this.pickLocationHandler}
                    region={!this.state.locationChosen ? this.state.focusedRegion : null}
                    initialRegion={this.state.focusedRegion}
                    style={styles.map}
                    ref={ref => this.map = ref}
                >{marker}</MapView>
                <View style={styles.button}>
                    <Button
                        title={"Locate Me"}
                        onPress={this.getLocationHandler}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: "center"
    },
    map: {
        width: "100%",
        height: 250
    },
    button: {
        margin: 5
    }
});

export default PickLocation