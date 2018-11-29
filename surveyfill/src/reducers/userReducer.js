import userConstants from '../constants/userConstants';

let initialState = {
    userId: null,
    username: null,
    authtoken: null
}

export function user(state = initialState, action) {
    switch (action.type) {
        case userConstants.LOGIN:
        	console.log('in login reducer')
            return Object.assign({}, state, {
                        authtoken: action.authtoken,
                        username: action.username,
                        userId: action.userId,
                        role: action.role,
                        infoMessage: action.infoMessage
                    });
        case userConstants.LOGOUT:
            return Object.assign({}, state, {
                        authtoken: null,
                        username: null,
                        userId: null,
                        role: null,
                        infoMessage: action.infoMessage
                    });
        default:
            return state;
    }
}
