import React, {Component} from 'react';
import { StyleSheet, View, Button} from 'react-native';
import { connect } from 'react-redux';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { addPlace, selectPlace, deletePlace, deselectPlace } from './src/components/store/actions';

import PlaceInput from './src/components/PlaceInput';
import PlaceList from './src/components/PlaceList';
import PlaceDetail from './src/components/PlaceDetail';
import AppContainer from './src/Router';




class App extends Component{
    componentDidMount(){
        console.log("props are",this.props)
    }

    addedPlaceHandler = (place) => {
        this.props.addPlace(place);
    };
    onItemSelectHandler = (key) => {
        this.props.selectPlace(key);
    };
    onModalCloseHandler = () => {
        this.props.deselectPlace()
    };
    onItemDeletedHandler = () => {
        this.props.deletePlace()
    };
    render() {
        return (
            <View style={styles.container}>
                <PlaceDetail
                    onModalClose={this.onModalCloseHandler}
                    onItemDeleted={this.onItemDeletedHandler}
                    placeSelected={this.props.placeSelected}
                />

                <PlaceInput
                    addedPlace={this.addedPlaceHandler}
                />
                <PlaceList
                    onItemSelect={this.onItemSelectHandler}
                    places={this.props.places}
                />
                <AppContainer/>

            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    }
});

const mapStateToProps = state => {
    return {
        places: state.places.places,
        placeSelected: state.places.placeSelected
    }
};
// const mapDispatchToProps = dispatch => {
//     return {
//         onAddPlace: (name) => dispatch(addPlace(name)),
//         onDeletePlace: () => dispatch(deletePlace()),
//         onSelectPlace: (key) => dispatch(selectPlace(key)),
//         onDeselectPlace: () => dispatch(deselectPlace())
//     }
// }
export default connect(mapStateToProps, { addPlace, selectPlace, deselectPlace, deletePlace } )(App)
