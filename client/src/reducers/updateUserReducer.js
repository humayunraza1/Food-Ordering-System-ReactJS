// updateUserReducer.js (for updating user details)
const initialState = {
    user: null,
    error: null,
};

const updateUserReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_USER_DETAILS_SUCCESS':
            return {
                ...state,
                user: action.payload,
                error: null,
            };
        case 'UPDATE_USER_DETAILS_ERROR':
            return {
                ...state,
                user: null,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default updateUserReducer;
