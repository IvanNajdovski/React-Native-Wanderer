import * as actionTypes from '../actions/actionTypes';

const initialState = {
    isLoggedIn: false,
    token: null,
    expiryDate: null
};
const reducer = (state = initialState, action) => {
    switch (action.type){
        case actionTypes.LOGED_IN:
            return {
                ...state,
                isLoggedIn: true
            };
        case actionTypes.AUTH_SET_TOKEN:
            return{
                ...state,
                token: action.payload.token,
                expiryDate: action.payload.expiryDate
            };
        case actionTypes.AUTH_REMOVE_TOKEN:
            return{
                ...state,
                token: null,
                expiryDate: null
            };
        default:
            return state
    }
};

export default reducer;