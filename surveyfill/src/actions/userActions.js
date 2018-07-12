import userConstants from '../constants/userConstants';

function login() {
    return {type: userConstants.LOGIN};
}

function logout() {
    return {type: userConstants.LOGOUT};
}

const userActions = {
    login,
    logout
};

export default userActions;
