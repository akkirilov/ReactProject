import surveyConstants from '../constants/surveyConstants';

function generateSection(sectionId) {
    return {sectionCount:sectionId, sectionId, sectionTitle: ''};
}

function generateQuestion(sectionId, questionId) {
    return {questionCount: questionId, questionId, sectionId, questionTitle: '', typeId: 1, isRequired: 0};
}

function generatePossibility(sectionId, questionId, possibilityId) {
    return {possibilityCount: possibilityId, questionId, sectionId, possibilityId, possibilityTitle: ''};
}

let initialState = {
	answers: [{}],
    title: '',
    notes: '',
    typesOfQuestions:[{}],
    sections: [{sectionCount:1, sectionId:1, sectionTitle: ''}],
    questions: [{questionCount:1, questionId:1, sectionId:1, questionTitle: '', typeId: 1, isRequired: 0}],
    possibilities: [{possibilityCount:1, possibilityId:1, sectionId:1, questionId:1, possibilityTitle: ''}],
}

let newState;
let questionCount;
let possibilityCount;
let newQuestions;

export function survey(state = initialState, action) {
    switch (action.type) {
        case surveyConstants.INITIALIZE_SURVEY:
            return Object.assign({}, action.survey);
        case surveyConstants.CHANGE_SURVEY_HEADER:
            return Object.assign({}, state, action.subState);
        case surveyConstants.CLEAR_SURVEY:
            return Object.assign({}, state, {
                title: '',
                notes: '',
                sections: [{sectionCount:1, sectionId:1, sectionTitle: ''}],
                questions: [{questionCount:1, questionId:1, sectionId:1, questionTitle: '', typeId: 1, isRequired: 0}],
                possibilities: [{possibilityCount:1, possibilityId:1, sectionId:1, questionId:1, possibilityTitle: ''}],
            });
        case surveyConstants.ADD_SECTION:
            newState = Object.assign({}, state);
            newState.sections.push(generateSection(state.sections.length + 1));
            newState.questions.push(generateQuestion(state.sections.length, 1)); 
            newState.possibilities.push(generatePossibility(state.sections.length, 1, 1)); 
            return newState;
        case surveyConstants.CHANGE_SECTION_HEADER:
            newState = Object.assign({}, state);
            newState.sections.filter(x => x.sectionId === action.sectionId)[0]['sectionTitle'] = action.sectionTitle; 
            return newState; 
        case surveyConstants.REMOVE_SECTION:
            newState = Object.assign({}, state);
            newState.sections = newState.sections.filter(x => x.sectionId !== action.sectionId);
            newState.questions = newState.questions.filter(x => x.sectionId !== action.sectionId);
            newState.possibilities = newState.possibilities.filter(x => x.sectionId !== action.sectionId);
            for(let i = 0; i < newState.sections.length; i++) {
                let oldId = newState.sections[i].sectionId;
                let newId = i + 1;
                newState.sections[i].sectionId = newId;
                newState.sections[i].sectionCount = newId;
                newState.questions.filter(x => x.sectionId === oldId).forEach(x => x.sectionId = newId);
                newState.possibilities.filter(x => x.sectionId === oldId).forEach(x => x.sectionId = newId);
            }
            return newState;
        case surveyConstants.ADD_QUESTION:
            newState = Object.assign({}, state);
            questionCount = state.questions.filter(x => x.sectionId === action.sectionId).length;
            newState.questions.push(generateQuestion(action.sectionId, questionCount + 1));
            newState.possibilities.push(generatePossibility(action.sectionId, questionCount + 1, 1)); 
            return newState;
        case surveyConstants.CHANGE_QUESTION_TYPE:
            newState = Object.assign({}, state);
            newState.questions
                .filter(x => x.sectionId === action.sectionId && x.questionId === action.questionId)[0]['typeId'] = action.questionType;
            return newState;
        case surveyConstants.CHANGE_QUESTION_HEADER:
            newState = Object.assign({}, state);
            newState.questions.filter(x => x.sectionId === action.sectionId && x.questionId === action.questionId)[0]['questionTitle'] = action.value; 
            return newState;
        case surveyConstants.CHANGE_QUESTION_REQUIRED:
            newState = Object.assign({}, state);
            newState.questions
                .filter(x => x.sectionId === action.sectionId && x.questionId === action.questionId)[0]['isRequired'] = Number(action.value);
            return newState;
        case surveyConstants.REMOVE_QUESTION:
            newState = Object.assign({}, state);
            newState.possibilities = newState.possibilities.filter(x => (x.sectionId !== action.sectionId) || (x.questionId !== action.questionId));
            newState.questions = state.questions.filter(x => x.sectionId !== action.sectionId);
            state.questions
                .filter(x => x.sectionId === action.sectionId)
                .filter(x => x.questionId !== action.questionId)
                .forEach((x, i) => {
                    let oldId = x.questionId;
                    let newId = i + 1;
                    x.questionId = newId;
                    x.questionCount = newId;
                    newState.questions.push(x);
                    newState.possibilities.forEach(p => {
                        if (p.sectionId === action.sectionId && p.questionId === oldId) {
                            p.questionId = newId;
                        }
                    });
                })
            return newState;
        case surveyConstants.ADD_POSSIBILITY:
            newState = Object.assign({}, state);
            possibilityCount = state.possibilities.filter(x => x.sectionId === action.sectionId && x.questionId === action.questionId).length;
            newState.possibilities.push(generatePossibility(action.sectionId, action.questionId, possibilityCount + 1)); 
            return newState;
        case surveyConstants.CHANGE_POSSIBILITY_HEADER:
            newState = Object.assign({}, state);
            newState.possibilities
            .filter(x => x.sectionId === action.sectionId 
            && x.questionId === action.questionId 
            && x.possibilityId === action.possibilityId)[0]['possibilityTitle'] = action.possibilityTitle; 
            return newState; 
        case surveyConstants.REMOVE_POSSIBILITY:
            newState = Object.assign({}, state);
            newState.possibilities = state.possibilities
                .filter(x => (x.sectionId !== action.sectionId) || (x.questionId !== action.questionId) || (x.possibilityId !== action.possibilityId));
            newState.possibilities
                .filter(x => x.sectionId === action.sectionId)
                .filter(x => x.questionId === action.questionId)
                .forEach((x, i) => {
                    let oldId = x.possibilityId;
                    let newId = i + 1;
                    x.possibilityId = newId;
                    x.possibilityCount = newId;
                })
            return newState;
        case surveyConstants.ANSWER:
        	newState = Object.assign({}, state);
        	let possibiltyValue = action.value;
        	let possibilityId = action.possibilityId;
        	let questionId = action.questionId;
        	let typeId = action.typeId;
        	if (typeId == '5bffb0ec682ae23931c642e8' || typeId == 1) {
				newState.possibilities
				.filter(x=> x.questionId == questionId)
				.forEach(x=> x.marked = false)
				newState.possibilities
				.filter(x => x.possibilityId == possibilityId)
				.forEach(x=> x.marked = true);
        	} else if(typeId == '5bffb10273796c52838e644f') {
        		newState.possibilities
				.filter(x=> x.possibilityId == possibilityId)
				.forEach(x=> {
					if (x.marked) {
						x.marked = false
					} else {
						x.marked = true
					}
				})
        	} else {
        		newState.possibilities
				.filter(x=> x.possibilityId === possibilityId)
				.forEach(x=> x.marked = possibiltyValue)
        	}
            return newState;
        default:
            return state;
    }
}
