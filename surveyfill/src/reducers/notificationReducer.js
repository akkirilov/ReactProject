import notificationConstants from '../constants/notificationConstants';

let initialState = {
    infoMessage: null,
    errorMessage: null
}

export function notification(state = initialState, action) {
    switch (action.type) {
        case notificationConstants.CLEAR_ALL:
            return Object.assign({}, state, {
                        infoMessage: null,
                        errorMessage: null
                    });
        case notificationConstants.CLEAR_ERROR:
            return Object.assign({}, state, {
                        errorMessage: null
                    });
        case notificationConstants.CLEAR_INFO:
            return Object.assign({}, state, {
                        infoMessage: null
                    });
        case notificationConstants.INFO:
            return Object.assign({}, state, {
                        infoMessage: action.message
                    });
        case notificationConstants.ERROR:
            return Object.assign({}, state, {
                        errorMessage: action.message
                    });       
        default:
            return state;
    }
}
