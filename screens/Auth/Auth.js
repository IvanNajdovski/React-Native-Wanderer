import React, {Component} from 'react';
import {
    View,
    Button,
    StyleSheet,
    ImageBackground,
    ActivityIndicator,
    Dimensions,
    KeyboardAvoidingView,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';
import {connect} from 'react-redux';
import { tryAuth, authAutoSignIn, authLogout } from '../../components/store/actions/index';

import DefaultInput from '../../components/UI/DefaultInput/DefaultInput';
import HeadingText from '../../components/UI/HeadingText/HeadingText';
import MainText from '../../components/UI/MainText/MainText';
import BackgroundImage from '../../assets/background.jpg';
import ButtonWithBackground from '../../components/UI/Button/ButtonWithBackgroud';

import validate from '../../utility/validation';

class AuthScreen extends Component {
    state = {
        viewMode: Dimensions.get('window').height > 500 ? "portrait" : 'landscape',
        authMode: 'login',
        controls: {
            email: {
                value: '',
                valid: false,
                validationRules: {
                    isEmail: true
                },
                touched: false

            },
            password: {
                value: '',
                valid: false,
                validationRules: {
                    minLength: 6
                },
                touched: false
            },
            confirmPassword: {
                value: '',
                valid: false,
                validationRules: {
                    equalTo: "password"
                },
                touched: false
            },
        }

    };

    constructor(props) {
        super(props);
        Dimensions.addEventListener("change", this.updateStyles)
    }

    componentWillUnmount() {
        Dimensions.removeEventListener("change", this.updateStyles)
    }
    componentDidMount(){
        this.props.authAutoSignIn()
    }

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return {
                authMode: prevState.authMode === 'login' ? 'signup' : 'login'
            }
        })
    };
    updateStyles = (dims) => {
        this.setState({viewMode: dims.window.height > 500 ? 'portrait' : 'landscape'})
    };
    static navigationOptions = {
        headerLeft: (
            <Button
                onPress={() => alert('This is a button!')}
                title="Info"
                color="#fff"
            />
        ),
    };
    updateInputState = (key, value) => {
        let connectedValue = {};
        if (this.state.controls[key].validationRules.equalTo) {
            const equalControl = this.state.controls[key].validationRules.equalTo;
            connectedValue = {
                ...connectedValue,
                equalTo: this.state.controls[equalControl].value
            }
        }
        if (key === 'password') {
            connectedValue = {
                ...connectedValue,
                equalTo: value
            }
        }
        this.setState(prevState => {
            return {
                controls: {
                    ...prevState.controls,
                    confirmPassword: {
                        ...prevState.controls.confirmPassword,
                        valid:
                            key === "password"
                                ? validate(
                                prevState.controls.confirmPassword.value,
                                prevState.controls.confirmPassword.validationRules,
                                connectedValue
                                )
                                : prevState.controls.confirmPassword.valid
                    },
                    [key]: {
                        ...prevState.controls[key],
                        value: value,
                        valid: validate(
                            value,
                            prevState.controls[key].validationRules,
                            connectedValue
                        ),
                        touched: true
                    },

                }
            }
        })
    };
    loginHandler = () => {
        const authData = {
            email: this.state.controls.email.value,
            password: this.state.controls.password.value
        };
        this.props.tryAuth(authData, this.state.authMode);
    };
    render() {
        let logout = null;
        if(this.props.token !== null){
            logout = (
                <Button onPress={() => this.props.authLogout()} title={"Logout"} color="#2196F3" style={styles.button}/>
            )
        }
        let loading = (
            <ButtonWithBackground
                disabled={
                    !this.state.controls.confirmPassword.valid && this.state.authMode === 'signup' ||
                    !this.state.controls.email.valid ||
                    !this.state.controls.password.valid
                }
                color="#2196F3"
                onPress={() => this.loginHandler()}>
                Submit
            </ButtonWithBackground>
        );
        if (this.props.loading) {
            loading = (
                <ActivityIndicator size={"large"} color={"#2196F3"}/>
            )
        }

        let headingText = null;
        let confirmPasswordControl = null;
        if (Dimensions.get('window').height > 500) {
            headingText = (
                <MainText>
                    <HeadingText>Please Log In</HeadingText>
                </MainText>
            )
        }
        if (this.state.authMode === "signup") {
            confirmPasswordControl = (
                <View style={
                    this.state.viewMode === 'landscape'
                        ? styles.landscapePasswordWrapper
                        : styles.portraitPasswordWrapper
                }>
                    <DefaultInput
                        secureTextEntry
                        touched={this.state.controls.confirmPassword.touched}
                        valid={this.state.controls.confirmPassword.valid}
                        onChangeText={(val) => this.updateInputState('confirmPassword', val)}
                        value={this.state.controls.confirmPassword.value}
                        placeholder={"Confirm Password"}
                        style={styles.input}
                    />
                </View>
            )
        }
        return (
            <ImageBackground source={BackgroundImage} style={styles.backgroundImage}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                        {headingText}
                        <ButtonWithBackground
                            onPress={this.switchAuthModeHandler}
                            color="#2196F3">Switch
                            to {this.state.authMode === "login" ? "LogIn" : "SignUp"}</ButtonWithBackground>

                        <View style={styles.inputContainer}>
                            <DefaultInput
                                autoCapitalize={"none"}
                                autoCorrect={false}
                                keyboardType={"email-address"}
                                touched={this.state.controls.email.touched}
                                valid={this.state.controls.email.valid}
                                onChangeText={(val) => this.updateInputState("email", val)}
                                value={this.state.controls.email.value}
                                placeholder={"Your E-mail Address"}
                                style={styles.input}
                            />
                            <View
                                style={this.state.viewMode === 'landscape' && this.state.authMode === 'signup' ? styles.landscapePasswordContainer : styles.portraitPasswordContainer}>
                                <View
                                    style={this.state.viewMode === 'landscape' && this.state.authMode === 'signup' ? styles.landscapePasswordWrapper : styles.portraitPasswordWrapper}>
                                    <DefaultInput
                                        secureTextEntry
                                        touched={this.state.controls.password.touched}
                                        valid={this.state.controls.password.valid}
                                        onChangeText={(val) => this.updateInputState('password', val)}
                                        value={this.state.controls.password.value}
                                        placeholder={"Password"}
                                        style={styles.input}
                                    />
                                </View>
                                {confirmPasswordControl}

                            </View>
                        </View>
                        {loading}
                        {logout}


                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
            </ImageBackground>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center"
    },
    inputContainer: {
        width: "80%"
    },
    backgroundImage: {
        width: "100%",
        flex: 1
    },
    input: {
        backgroundColor: "#eee",
        borderColor: "#bbb"
    },
    landscapePasswordContainer: {
        flexDirection: 'row',
        justifyContent: "space-between"
    },
    portraitPasswordContainer: {
        flexDirection: 'column',
        justifyContent: "flex-start"
    },
    landscapePasswordWrapper: {
        width: "45%"
    },
    portraitPasswordWrapper: {
        width: "100%"
    },
    button:{
        padding: 10,
        margin: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "black"
    },


});
const mapStateToProps = state => {
    return {
        loading: state.ui.isLoading,
        isAuth: state.auth.isLogedIn,
        token: state.auth.token
    }
};
export default connect(mapStateToProps, {tryAuth, authAutoSignIn, authLogout })(AuthScreen);