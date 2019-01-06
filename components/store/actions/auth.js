import * as actionTypes from './actionTypes';
import {AsyncStorage} from 'react-native';
import {uiStartLoading, uiStopLoading} from './index';
import NavigationService from '../../../utility/NavigationService';

export const authSignup = (authData) => {
    return dispatch => {


    }
};

export const tryAuth = (authData, authMode) => {
    return dispatch => {
        dispatch(uiStartLoading());
        const apiKey = "AIzaSyBvlSS-0MTwD23poNV40t4ymdnie-BbNiE";
        let url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${apiKey}`
        if (authMode === "login") {
            url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${apiKey}`
        }
        fetch(url, {
            method: "POST",
            body: JSON.stringify({
                email: authData.email,
                password: authData.password,
                returnSecureToken: true
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .catch(err => {

                alert("Authentication failed");
                dispatch(uiStopLoading())
            })
            .then(res => res.json())
            .then(parsedRes => {
                dispatch(uiStopLoading());
                if (!parsedRes.idToken) {
                    alert("Authentication failed")
                } else {
                    dispatch(authStoreToken(
                        parsedRes.idToken,
                        parsedRes.expiresIn,
                        parsedRes.refreshToken
                    ));
                    NavigationService.navigate('Places');
                }

            })
    }
};
export const loggedIn = () => {
    return {
        type: actionTypes.LOGED_IN
    }
};
export const authStoreToken = (token, expiresIn, refreshToken) => {
    return dispatch => {

        const now = new Date();
        const expiryDate = now.getTime() + expiresIn * 1000;
        dispatch(authSetToken(token, expiryDate));
        AsyncStorage.setItem("ap:auth:token", token);
        AsyncStorage.setItem("ap:auth:expiryDate", expiryDate.toString());
        AsyncStorage.setItem("ap:auth:refreshToken", refreshToken)
    }
};
export const authSetToken = (token, expiryDate) => {
    return {
        type: actionTypes.AUTH_SET_TOKEN,
        payload: {
            token,
            expiryDate
        }
    }
};
export const authGetToken = () => {
    return (dispatch, getState) => {
        const promise = new Promise((resolve, reject) => {
            const token = getState().auth.token;
            const expiryDate = getState().auth.expiryDate;

            if (!token || new Date(expiryDate) <= new Date()) {
                let fetchedToken;
                AsyncStorage.getItem("ap:auth:token")
                    .catch(err => reject())
                    .then(tokenFromStorage => {
                        console.log("token from storage", tokenFromStorage)
                        fetchedToken = tokenFromStorage;
                        if (!tokenFromStorage) {
                            reject();
                            return;
                        }
                        return AsyncStorage.getItem("ap:auth:expiryDate");
                    })
                    .then(expiryDate => {
                        const parsedExpiryDate = new Date(parseInt(expiryDate));
                        const now = new Date();
                        if (parsedExpiryDate > now) {
                            console.log("fetched token", fetchedToken)
                            dispatch(authSetToken(fetchedToken));
                            resolve(fetchedToken);
                        } else {
                            reject()
                        }
                    })
                    .catch(err => reject())
            } else {
                resolve(token);
            }
        });
        return promise
            .catch(err => {
                return AsyncStorage.getItem("ap:auth:refreshToken")
                    .then(refreshToken => {
                        return fetch("https://securetoken.googleapis.com/v1/token?key=AIzaSyBvlSS-0MTwD23poNV40t4ymdnie-BbNiE", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            body: "grand_type=refresh_token&refresh_token=" + refreshToken
                        });
                    })
                    .then(res => res.json())
                    .then(parsedRes => {
                        if (parsedRes.id_token) {
                            dispatch(authStoreToken(
                                parsedRes.id_token,
                                parsedRes.expires_in,
                                parsedRes.refresh_token
                                )
                            );
                            return parsedRes.id_token;
                        } else {
                            dispatch(authClearStorage())
                        }
                    })
            })
            .then(token => {
                if (!token) {
                    throw(new Error());
                } else {
                    return token;
                }
            });
    }
};
export const authAutoSignIn = () => {
    return dispatch => {
        dispatch(authGetToken())
            .then(token => NavigationService.navigate('Places'))
            .catch(err => console.log("Failed to fetch token"))
    }
};
export const authClearStorage = () => {
    return dispatch => {
        AsyncStorage.clear()
        // AsyncStorage.removeItem("app:auth:token")
        //     .then(() => {
        //         AsyncStorage.removeItem("app:auth:expiryDate")
        //             .then(() => {
        //                 AsyncStorage.removeItem("ap:auth:refreshToken")
        //             })
        //     })


    }

};
export const authLogout = () => {

    return dispatch => {
        dispatch(authClearStorage());
        dispatch(authRemoveToken());
    };
};
export const authRemoveToken = () => {

    return {
        type: actionTypes.AUTH_REMOVE_TOKEN
    };
};

