import config from '../config/configApp';
import requestConstants from '../constants/requestConstants';
import $ from 'jquery'

const USER_ROLE = 1;

function register(user) {
    const {username, email, password } = user;

    let date = new Date();
    let userData = {
        username,
        email,
        password,
        role: USER_ROLE,
        isBanned: false,
        isDeleted: false,
        registerDate: date.toISOString().substr(0, 10)
    };

    return $.ajax({
        type: "POST",
        data: userData,
        dataType: "text",
        url: config.apiUrl + '/users/register'
    });
}

function login(user) {
    const {username, password } = user;

    let userData = {
        username,
        password
    };

    return $.ajax({
        type: "POST",
        data: userData,
        dataType: "text",
        url: config.apiUrl + '/users/login'
    });
}

function logout(authtoken) {
    let userData = {
        authtoken
    };

    return $.ajax({
        type: "POST",
        data: userData,
        dataType: "text",
        url: config.apiUrl + '/users/logout'
    });
}

function getAllUsers(userData){
	return $.ajax({
        type: "POST",
        data: userData,
        dataType: "text",
        url: config.apiUrl + '/users/all'
    });
}

function deleteUser(userData){
	return $.ajax({
        type: "POST",
        data: userData,
        dataType: "text",
        url: config.apiUrl + '/users/delete'
    });
}

let userService = {
    login,
    register,
    logout,
    deleteUser,
    getAllUsers
}

export default userService;
