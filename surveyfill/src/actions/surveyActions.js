import surveyConstants from '../constants/surveyConstants';

function changeSurveyHeader(subState) {
    return {type: surveyConstants.CHANGE_SURVEY_HEADER, subState};
}

function clearSurvey() {
    return {type: surveyConstants.CLEAR_SURVEY};
}

function initializeSurvey(survey) {
    return {type: surveyConstants.INITIALIZE_SURVEY, survey};
}

function addSection() {
    return {type: surveyConstants.ADD_SECTION};
}

function changeSectionHeader(sectionId, sectionTitle) {
    return {type: surveyConstants.CHANGE_SECTION_HEADER, sectionId, sectionTitle};
}

function removeSection(sectionId) {
    return {type: surveyConstants.REMOVE_SECTION, sectionId};
}

function addQuestion(sectionId) {
    return {type: surveyConstants.ADD_QUESTION, sectionId};
}

function changeQuestionHeader(sectionId, questionId, value) {
    return {type: surveyConstants.CHANGE_QUESTION_HEADER, sectionId, questionId, value};
} 

function changeQuestionType(sectionId, questionId, questionType) {
    return {type: surveyConstants.CHANGE_QUESTION_TYPE, sectionId, questionId, questionType};
}

function changeQuestionRequired(sectionId, questionId, value) {
    return {type: surveyConstants.CHANGE_QUESTION_REQUIRED, sectionId, questionId, value};
}

function removeQuestion(sectionId, questionId) {
    return {type: surveyConstants.REMOVE_QUESTION, sectionId, questionId};
}

function addPossibility(sectionId, questionId) {
    return {type: surveyConstants.ADD_POSSIBILITY, sectionId, questionId};
}

function changePossibilityHeader(sectionId, questionId, possibilityId, possibilityTitle) {
    return {type: surveyConstants.CHANGE_POSSIBILITY_HEADER, sectionId, questionId, possibilityId, possibilityTitle};
}

function removePossibility(sectionId, questionId, possibilityId) {
    return {type: surveyConstants.REMOVE_POSSIBILITY, sectionId, questionId, possibilityId};
}

const userActions = {

    initializeSurvey,
    changeSurveyHeader,
    clearSurvey,
    addSection,
    changeSectionHeader,
    removeSection,
    addQuestion,
    changeQuestionHeader,
    changeQuestionRequired,
    changeQuestionType,
    removeQuestion,
    addPossibility,
    changePossibilityHeader,
    removePossibility

};

export default userActions;
