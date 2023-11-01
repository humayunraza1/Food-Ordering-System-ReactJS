// updateUserActions.js (for updating user details)
export const updateUserDetailsSuccess = (userData) => {
    return {
        type: 'UPDATE_USER_DETAILS_SUCCESS',
        payload: userData,
    };
};

export const updateUserDetailsError = (error) => {
    return {
        type: 'UPDATE_USER_DETAILS_ERROR',
        payload: error,
    };
};

export const updateUserName = (token, fullname) => {
    return async (dispatch) => {
        try {
            const res = await fetch('http://192.168.18.139:3001/users/update-user-details', {
                method: 'PUT',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fullname }),
            });

            const data = await res.json();
            if (!data || data.status !== 'success') {
                return data;
                // dispatch(updateUserDetailsError(data)); // Dispatch error action
            } else {
                return data;
                // dispatch(updateUserDetailsSuccess(data)); // Dispatch success action
            }
        } catch (err) {
            console.log(err);
            dispatch(updateUserDetailsError(err)); // Dispatch error action
        }
    };
};

export const updateUserNumber = (token, phonenumber) => {
    return async (dispatch) => {
        try {
            const res = await fetch('http://192.168.18.139:3001/users/update-user-details', {
                method: 'PUT',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phonenumber }),
            });

            const data = await res.json();
            if (!data || data.status !== 'success') {
                return data;
                // dispatch(updateUserDetailsError(data)); // Dispatch error action
            } else {
                return data;
                // dispatch(updateUserDetailsSuccess(data)); // Dispatch success action
            }
        } catch (err) {
            console.log(err);
            dispatch(updateUserDetailsError(err)); // Dispatch error action
        }
    };
};

export const updateUserAddress = (token, address) => {
    return async (dispatch) => {
        try {
            const res = await fetch('http://192.168.18.139:3001/users/update-user-details', {
                method: 'PUT',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ address }),
            });

            const data = await res.json();
            if (!data || data.status !== 'success') {
                return data;// dispatch(updateUserDetailsError(data)); // Dispatch error action
            } else {
                return data; // dispatch(updateUserDetailsSuccess(data)); // Dispatch success action
            }
        } catch (err) {
            console.log(err);
            dispatch(updateUserDetailsError(err)); // Dispatch error action
        }
    };
};


export const updateUserPassword = (token, password) => {
    return async (dispatch) => {
        try {
            const res = await fetch('http://192.168.18.139:3001/users/update-user-details', {
                method: 'PUT',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ oldpassword: password.oldpassword, newpassword: password.newpassword }),
            });

            const data = await res.json();
            if (!data || data.status !== 'success') {
                return data; // dispatch(updateUserDetailsError(data)); // Dispatch error action
            } else {
                return data;
                //dispatch(updateUserDetailsSuccess(data)); // Dispatch success action
            }
        } catch (err) {
            console.log(err);
            dispatch(updateUserDetailsError(err)); // Dispatch error action
        }
    };
};