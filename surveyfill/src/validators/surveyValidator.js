function validateNewSurvey(survey) { 
    if (survey.title.length < 5) {
        return "Survey title must has at least 5 symbols!";
    } else if (survey.userId === 0) {
        return "Anonimous users can't add surveys! Please, loggin!";
    }
    let sectionsLength = survey.sections.length;
    if (sectionsLength < 1) {
        return "Survey must has at least 1 section!";
    }
    for (let i = 0; i < sectionsLength; i++) {
        if (survey.sections[i].sectionTitle.length < 3) {
            return "Section title must has at least 3 symbols!";
        }
        let questions = survey.questions.filter(x => x.sectionId === survey.sections[i].sectionId);
        let questionsLength = questions.length;
        if (questionsLength < 1) {
            return "Section must has at least 1 question!";
        }
        for (let j = 0; j < questionsLength; j++) {
            if (questions[j].questionTitle.length < 3) {
                return "Question title must has at least 3 symbols!";
            }
            let possibilities = survey.possibilities.filter(x => (x.sectionId === survey.sections[i].sectionId && x.questionId == questions[j].questionId));
            let possibilitiesLength = possibilities.length;
            if (possibilitiesLength < 1) {
                return "Question " + survey.questions[j].questionId + "must has at least 1 possibility!";
            }
            for (let k = 0; k < possibilitiesLength; k++) {
                if (questions[j].typeId <= 2 && possibilities[k].possibilityTitle.length < 3) {
                    return "Possibility title must has at least 3 symbols!";
                }
            }
        }
    }
    return false;
}

function validateFillSurvey(survey) { 
    let error;
    for(let q of survey.questions){
    	if(q.isRequired == 1){
    		let ok = false;
    		for(let p of survey.possibilities){
    			if(p.questionId == q.questionId && p.marked){
    				ok = true;
    				break;
    			}
    		}
    		if(!ok){
    			error = 'Question '+q.questionTitle+' is required!';
    			break;
    		}
    	}
    }
    return error;
}

let surveyValidator = {
    validateNewSurvey,
    validateFillSurvey
}

export default surveyValidator;
