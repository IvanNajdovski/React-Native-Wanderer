import React, {Component} from 'react';
import {View, Text, Button, Image, StyleSheet, Dimensions, ScrollView} from 'react-native'
import {connect} from 'react-redux';
import {deletePlace} from '../../components/store/actions';

import MapView from 'react-native-maps'


class PlaceDetail extends Component {

    state = {
        viewMode: Dimensions.get('window').height > 500 ? 'portrait' : 'landscape',

    };

    constructor(props) {
        super(props);
        Dimensions.addEventListener("change", this.updateStyles)
    }

    componentWillUnmount() {
        Dimensions.removeEventListener("change", this.updateStyles)
    }

    updateStyles = (dims) => {
        this.setState({viewMode: dims.window.height > 500 ? 'portrait' : 'landscape'})
    };
    static navigationOptions = ({navigation}) => {
        return {
            title: navigation.state.params.name
        };
    };
    onItemDeletedHandler = () => {
        this.props.deletePlace(this.props.navigation.state.params.key);
        this.props.navigation.pop()
    };

    render() {

        const place = this.props.navigation.state.params;
        return (
            <ScrollView>
                <View>
                    <View style={this.state.viewMode === 'portrait' ? null : styles.container}>
                        <View
                            style={this.state.viewMode === 'portrait' ? styles.portraitModalContainer : styles.landscapeModalContainer}>
                            <Image source={place.image} style={styles.placeImage}/>
                            <Text style={styles.placeName}>{place.name}</Text>

                        </View>

                        <View style={this.state.viewMode === 'portrait' ? null : styles.landscapeButton}>
                            <Button onPress={this.onItemDeletedHandler} title="Delete"/>
                        </View>
                    </View>
                    <View>
                        <MapView

                            initialRegion={{
                                ...this.props.navigation.state.params.location.value,
                                latitudeDelta: 0.0122,
                                longitudeDelta: Dimensions.get('window').width / Dimensions.get('window').height * 0.0122
                            }}
                            style={styles.map}
                        >
                            <MapView.Marker coordinate={this.props.navigation.state.params.location.value}/>
                        </MapView>
                    </View>
                </View>
            </ScrollView>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    portraitModalContainer: {
        margin: 22,

    },
    landscapeModalContainer: {
        margin: 22,
        flex: 1
    },
    placeImage: {
        width: '100%',
        height: 200
    },
    placeName: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 28
    },
    landscapeButton: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    map: {
        width: "100%",
        height: 250
    }
});

const mapStateToProps = state => {
    return {
        mapLocation: state.places.places
    }
};

export default connect(mapStateToProps, {deletePlace})(PlaceDetail);