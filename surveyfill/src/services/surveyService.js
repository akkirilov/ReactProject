import config from '../config/configApp';
import requestConstants from '../constants/requestConstants';
import $ from 'jquery'
 
function getTypesOfQuestions() {
    return $.ajax({
        type: "GET",
        url: config.apiUrl + '/types_of_questions'
    });
}

function getById(id) {
    return $.ajax({
        type: "POST",
        data: {id},
        dataType: "text",
        url: config.apiUrl + '/surveys/get'
    });
}

function getByIdWithAnswers(id) {
    return $.ajax({
        type: "POST",
        data: {id},
        dataType: "text",
        url: config.apiUrl + '/surveys/getWithAnswers'
    });
}

function addSurvey(surveyData) {
    return $.ajax({
        type: "POST",
        data: surveyData,
        dataType: "text",
        url: config.apiUrl + '/surveys/add'
    });
}

function fillSurvey(surveyData) {
    return $.ajax({
        type: "POST",
        data: surveyData,
        dataType: "text",
        url: config.apiUrl + '/surveys/fill'
    });
}

function getRecentSurveys() {
    return $.ajax({
        type: "POST",
        data: {},
        dataType: "text",
        url: config.apiUrl + '/surveys/getRecent'
    });
}

function getSurveysByUserId(userData) {
    return $.ajax({
        type: "POST",
        data: userData,
        dataType: "text",
        url: config.apiUrl + '/surveys/getByUserId'
    });
}

function getAllSurveys() {
    return $.ajax({
        type: "POST",
        data: {},
        dataType: "text",
        url: config.apiUrl + '/surveys/getAll'
    });
}

function deleteSurvey(surveyData) {
    return $.ajax({
        type: "POST",
        data: {surveyData},
        dataType: "text",
        url: config.apiUrl + '/surveys/delete'
    });
}

function editSurvey(surveyData) {
    return $.ajax({
        type: "POST",
        data: surveyData,
        dataType: "text",
        url: config.apiUrl + '/surveys/edit'
    });
}

let surveyService = {
	getSurveysByUserId,
	getRecentSurveys,
    getTypesOfQuestions,
    deleteSurvey,
    getAllSurveys,
    addSurvey,
    fillSurvey,
    editSurvey,
    getById,
    getByIdWithAnswers
}

export default surveyService;
