import config from '../config/configApp';
import requestConstants from '../constants/requestConstants';
import $ from 'jquery'
import requestService from './requestService';

const USER_ROLE = 1;
const MODULE = 'user';
const AUTH_BASIC = 'basic';
const AUTH_KINVEY = 'kinvey';
const LOGIN_ENDPOINT = 'login';
const LOGOUT_ENDPOINT = '_logout';
const REGISTER_ENDPOINT = '';

function register(user) {
    let data = {
    	username:user.username,
    	email:user.email,
        password:user.password,
        role:user
    };
    return requestService.post(MODULE, REGISTER_ENDPOINT, AUTH_BASIC, data);
}

function login(user) {
    let data = {
        	username:user.username,
            password:user.password
        };
    return requestService.post(MODULE, LOGIN_ENDPOINT, AUTH_BASIC, data);
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
