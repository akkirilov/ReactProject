import notificationConstants from '../constants/notificationConstants';

function clearAll() {
    return {type: notificationConstants.CLEAR_ALL};
}

function clearError() {
    return {type: notificationConstants.CLEAR_ERROR};
}

function clearInfo() {
    return {type: notificationConstants.CLEAR_INFO};
}

function error(message) {
    return {type: notificationConstants.ERROR, message};
}

function info(message) {
    return {type: notificationConstants.INFO, message};
}


const notificationActions = {
    clearAll,
    clearError,
    clearInfo,
    info,
    error
};

export default notificationActions;
