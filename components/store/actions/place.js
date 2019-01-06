import * as actionTypes from './actionTypes';
import {uiStopLoading, uiStartLoading, authGetToken} from './index';
import NavigationService from '../../../utility/NavigationService';

export const addPlace = (placeName, location, image) => {
    return dispatch => {
        let authToken;
        dispatch(uiStartLoading());
        dispatch(authGetToken())
            .catch(() => {
                alert("No Valid Token Found")
            })
            .then(token => {
                authToken = token;
                return fetch("https://us-central1-reactnative-places.cloudfunctions.net/storeImage", {
                    method: "POST",
                    body: JSON.stringify({
                        image: image.base64
                    }),
                    headers: {
                        "Authorization": "Bearer " + authToken
                    }
                })
            })
            .catch(err => {
                alert("Something went wrong!!! Please try again");
                dispatch(uiStopLoading())
            })
            .then(res => {
                if (res.ok){
                    return res.json();
                }else {
                    throw(new Error());
                }
            })
            .then(parsedRes => {
                const placeData = {
                    name: placeName,
                    location: location,
                    image: parsedRes.imageUrl,
                    imagePath: parsedRes.imagePath
                };
                return fetch("https://reactnative-places.firebaseio.com/places.json?auth=" + authToken, {
                    method: "POST",
                    body: JSON.stringify(placeData)
                })
            })
            .catch(err => {
                alert("Something went wrong!!! Please try again");
                dispatch(uiStopLoading())
            })
            .then(res =>{
                if (res.ok){
                    return res.json();
                }else {
                    throw(new Error());
                }
            })
            .then(pasedRes => {

                dispatch(uiStopLoading());
                NavigationService.navigate('FindPlace');
            })
            .catch(err => {
                alert("Something went wrong!!! :/");
                dispatch(uiStopLoading());
            });

    }
};
export const setPlaces = places => {
    return {
        type: actionTypes.SET_PLACES,
        payload: {
            places
        }
    }
};
export const getPlaces = () => {
    return dispatch => {
        dispatch(authGetToken())
            .then(token => {
                return fetch("https://reactnative-places.firebaseio.com/places.json?auth=" + token)
            })
            .catch(() => {
                alert("No Valid Token Found")
            })
            .then(res => {
                if (res.ok){
                    return res.json();
                }else {
                    throw(new Error());
                }
            })
            .then(parsedRes => {
                const places = [];
                for (let place in parsedRes) {
                    places.push({
                        ...parsedRes[place],
                        image: {
                            uri: parsedRes[place].image
                        },
                        key: place
                    });
                }
                dispatch(setPlaces(places))
            })
            .catch(err => {
                alert("Logged Out ;)");
            });
    }
};
export const removePlace = key => {
    return {
        type: actionTypes.REMOVE_PLACE,
        payload: {
            key
        }
    }
};
export const deletePlace = (key) => {
    return dispatch => {
        dispatch(authGetToken())
            .catch(() => {
                alert("No Valid Token Found")
            })
            .then(token => {
                dispatch(removePlace(key));
                 return fetch(`https://reactnative-places.firebaseio.com/places/${key}.json?auth=${token}`, {
                    method: "DELETE"
                })
            })
            .then(res => res.json())
            .then(parsedRes => {
                console.log("done")
            })
            .catch(err => {
                alert("Something went wrong!!! :/");
            });
    }
};

