import React, {Component} from 'react';
import {View, Button, StyleSheet, ScrollView, Text, ActivityIndicator } from 'react-native';
import {connect} from 'react-redux';
import {addPlace} from "../../components/store/actions";
import validate from '../../utility/validation';


import MainText from '../../components/UI/MainText/MainText';
import HeadingText from '../../components/UI/HeadingText/HeadingText';
import PickImage from '../../components/PickImage/PickImage';
import PickLocation from '../../components/PickLocation/PickLocation';
import DefaultInput from '../../components/UI/DefaultInput/DefaultInput';
import FindPlace from "../FindPlace/FindPlace";


class SharePlace extends Component {
    componentWillMount() {
        this.reset();
    };

    static navigationOptions = {
        tabBarLabel: "Share Place"
    };
    reset = () => {
        this.setState({
            controls: {
                placeName: {
                    value: '',
                    valid: false,
                    validationRules: {
                        isEmpty: 0
                    },
                    touched: false
                },
                location: {
                    value: null,
                    valid: false
                },
                image: {
                    value: null,
                    valid: false
                }
            }
        })
    };

    placeNameChangedHandler = (key, value) => {
        this.setState(prevState => {
            return {
                controls: {
                    ...prevState.controls,
                    placeName: {
                        ...prevState.controls.placeName,
                        value: value,
                        touched: true,
                        valid: validate(value, prevState.controls[key].validationRules)

                    }
                }
            }


        });
    };
    placeSubmitHandler = () => {
        this.props.addPlace(
            this.state.controls.placeName.value,
            this.state.controls.location,
            this.state.controls.image.value
            );
        this.reset();
        this.imagePicker.reset();
        this.mapPicker.reset();
        //this.props.navigation.navigate("FindPlace")
    };
    locationPickedHandler = location => {
      this.setState(prevState => {
          return {
              controls: {
                  ...prevState.controls,
                  location: {
                      value: location,
                      valid: true
                  }
              }
          }

      })
    };
    imagePickedHandler = image => {
        this.setState(prevState => {
            return {
                controls: {
                    ...prevState.controls,
                    image: {
                        value: image,
                        valid: true
                    }
                }
            }
        })
    };

    render() {
        let isLoading = null;
        if(this.props.loading){
            isLoading = (
                <ActivityIndicator size={"large"} color="#2196F3"/>
            )
        }else{
            isLoading = (
                <Button
                    style={this.state.controls.placeName.valid ? null : styles.invalid}
                    disabled={
                        !this.state.controls.placeName.valid ||
                        !this.state.controls.location.valid ||
                        !this.state.controls.image.valid
                    }
                    title={"Share The Place"}
                    onPress={this.placeSubmitHandler}
                />
            )
        }
        return (
            <ScrollView>
                <View style={styles.container}>
                    <MainText>
                        <HeadingText>Share a Place with Us</HeadingText>
                    </MainText>
                    <PickImage
                        onImagePicked={this.imagePickedHandler}
                        ref={ref => this.imagePicker = ref}
                    />
                    <PickLocation
                        onLocationPick={this.locationPickedHandler}
                        ref={ref => this.mapPicker = ref}
                    />
                    <DefaultInput
                        value={this.state.controls.placeName.value}
                        valid={this.state.controls.placeName.valid}
                        touched={this.state.controls.placeName.touched}
                        placeName={this.state.controls.placeName.value}
                        onChangeText={(val) => this.placeNameChangedHandler('placeName', val)}
                    />
                    <View style={styles.button}>
                        {isLoading}
                    </View>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    placeholder: {
        borderWidth: 1,
        borderColor: "black",
        backgroundColor: '#eee',
        width: "80%",
        height: 150
    },
    button: {
        margin: 5
    },
    invalid: {
        backgroundColor: '#eee',
        color: "#aaa"
    },
    previewImage: {
        width: "100%",
        height: "100%"
    }
});
const mapStateToProps = state => {
    return {
        loading: state.ui.isLoading
    }
};
export default connect(mapStateToProps, {addPlace})(SharePlace);