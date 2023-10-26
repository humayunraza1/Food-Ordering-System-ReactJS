// userActions.js
export const fetchUserDetailsSuccess = (userData) => {
    return {
        type: 'FETCH_USER_DETAILS_SUCCESS',
        payload: userData,
    };
};

export const fetchUserDetailsError = (error) => {
    return {
        type: 'FETCH_USER_DETAILS_ERROR',
        payload: error,
    };
};

export const fetchUserDetails = (token) => {
    return async (dispatch) => {
        try {
            const res = await fetch('http://192.168.18.139:3001/users/user-details', {
                method: 'GET',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            });

            const data = await res.json();
            if (!data || data.status !== 'success') {
                console.log(data);
                dispatch(fetchUserDetailsError(data.error)); // Dispatch error action
            } else {
                console.log("DATA:", data);
                dispatch(fetchUserDetailsSuccess(data.data)); // Dispatch success action
            }
        } catch (err) {
            console.log(err);
            dispatch(fetchUserDetailsError(err)); // Dispatch error action
        }
    };
};
