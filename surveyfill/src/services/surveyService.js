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

function addSurvey(surveyData) {
    return $.ajax({
        type: "POST",
        data: surveyData,
        dataType: "text",
        url: config.apiUrl + '/surveys/add'
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
    getTypesOfQuestions,
    addSurvey,
    editSurvey,
    getById
}

export default surveyService;
