import config from '../config/configApp';
import requestConstants from '../constants/requestConstants';
import $ from 'jquery'
import requestService from './requestService';
 
//const surveyUrl = `${API_URL}appdata/${APP_KEY}/surveys`;
//const sectionsUrl = `${API_URL}appdata/${APP_KEY}/sections`;
//const questionsUrl = `${API_URL}appdata/${APP_KEY}/questions`;
//const possibilitiesUrl = `${API_URL}appdata/${APP_KEY}/possibilities`;


function getRecentSurveys(authtoken) {
	let endpoint = 'surveys'+'?query={"isDeleted":"0"}&limit=5';
    return requestService.get('appdata',endpoint,authtoken);
}

function getSurveysByUserId(userId,authtoken) {
	let endpoint = 'surveys'+'?query={"userId": "' + userId + '"}';
	return requestService.get('appdata',endpoint,authtoken);
}

function getTypesOfQuestions(authtoken) {
    return requestService.get('appdata','typesOfQuestions',authtoken);
}

function addSurvey(survey) {
	let userId = survey.userId;
	let authtoken = survey.authtoken;
	let surveyId="";
	let sectionId="";
	let questionId="";
	
	let privateSectionId="";
	let privateQuestionId="";
	let data = {
			title:survey.title,
			userId:userId,
			respondents:0,
			isDeleted:0,
			notes:survey.notes
			};
	return requestService.post('appdata','surveys',authtoken, data, false)
	.then(res => {
			surveyId = res._id;
			for(let section of survey.sections){
				privateSectionId = section.sectionId;
				data = {
						surveyId:surveyId,
						sectionTitle:section.sectionTitle
				}
			    let sectionReq = requestService.post('appdata','sections',authtoken, data, false);
				sectionReq.done(res => {
					sectionId = res._id;
					for(let question of survey.questions){
						privateQuestionId = question.questionId;
						if(question.sectionId == privateSectionId){
							console.log('survey => ',survey)
							data = {
								surveyId:surveyId,
								sectionId: sectionId,
								questionTitle: question.questionTitle,
								isRequired:question.isRequired,
								typeId:question.typeId
							}
							let questionReq = requestService.post('appdata','questions',authtoken, data, false);
							questionReq.done(res => {
								questionId = res._id;
								for(let possibility of survey.possibilities){
									if(possibility.questionId == privateQuestionId && possibility.sectionId == privateSectionId){
										data = {
												surveyId:surveyId,
												sectionId: sectionId,
												questionId: questionId,
												possibilityTitle: possibility.possibilityTitle
											}
										let questionReq = requestService.post('appdata','possibilities',authtoken, data, false)
										questionReq.done();										
									}
								}
							})
						}
					}
				})
			}
			
	})
	
	
	
	
}

function getSectionBySurveyId(surveyId, authtoken, syncRequest){
	let endpoint = 'sections'+'?query={"surveyId":"'+surveyId+'"}';
	return requestService.get('appdata',endpoint,authtoken, syncRequest);
}

function getQuestionBySectionId(sectionId, authtoken, syncRequest){
	let endpoint = 'questions'+'?query={"sectionId":"'+sectionId+'"}';
	return requestService.get('appdata',endpoint,authtoken, syncRequest);
}

function getPossibilitiesByQuestionId(questionId, sectionId, authtoken, syncRequest){
	let endpoint = 'possibilities'+'?query={"questionId":"'+questionId+'","sectionId":"'+sectionId+'"}';
	return requestService.get('appdata',endpoint,authtoken, syncRequest);
}

function getById(surveyId, authtoken) {
	let endpoint = 'surveys'+'?query={"_id": "' + surveyId + '"}';
    return requestService.get('appdata',endpoint,authtoken);

}

function getByIdWithAnswers(id) {
    return $.ajax({
        type: "POST",
        data: {id},
        dataType: "text",
        url: config.apiUrl + '/surveys/getWithAnswers'
    });
}

function fillSurvey(surveyData) {
	console.log('surveyData ',surveyData)
//    return $.ajax({
//        type: "POST",
//        data: surveyData,
//        dataType: "text",
//        url: config.apiUrl + '/surveys/fill'
//    });
}

function getAllSurveys(authtoken) {
	return requestService.get('appdata','surveys',authtoken);
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
    getSectionBySurveyId,
    getQuestionBySectionId,
    getPossibilitiesByQuestionId,
    getByIdWithAnswers
}

export default surveyService;
