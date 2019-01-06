import * as actionTypes from '../actions/actionTypes';
const initialState = {
  places: []
};

const reducer = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.ADD_PLACE:
            return {
                ...state,
                places: state.places.concat({
                    key: Math.random(),
                    name: action.payload.placeName,
                    image: {
                        uri: action.payload.image.uri
                    },
                    location: action.payload.location,

                })
            };
        case actionTypes.REMOVE_PLACE:
            return {
                ...state,
                places: state.places.filter((place) => {
                    return place.key !== action.payload.key
                })
            };
        case actionTypes.SET_PLACES:
            return {
                ...state,
                places: action.payload.places
            };

        default:
            return state;

    }

};

export default reducer;