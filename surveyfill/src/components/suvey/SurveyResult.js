import React, { Component } from 'react'; 
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import FillSection from './FillSection';
import notificationActions from '../../actions/notificationActions';
import surveyService from '../../services/surveyService';

import { Button, Form, FormGroup, Label, Input, FormText, Card, CardHeader, CardBody } from 'reactstrap';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'

class SurveyResultBase extends Component {

    constructor(props) {
        super(props);
        this.state = { ready: false, survey:{}};
    }

    componentDidMount() {
    	if (!this.props.user.authtoken) {
			this.setState({redirect:<Redirect to='/login' />});
			this.props.dispatch(notificationActions.error('You need to be logged to view survey results!'));
		}
    	const dispatch = this.props.dispatch;
        let surveyId = this.props.match.params.id;
        surveyService.getByIdWithAnswers(surveyId, this.props.user.authtoken)
        .then(res => {
        	let survey = res[0];
        	survey.questions = [];
        	survey.possibilities = [];
        	
        	surveyService.getSectionBySurveyId(survey._id,this.props.user.authtoken,false)
        	.then(res => {
        		survey.sections = res;
        		let sectionNumber = 1;
        		let sectionCount = res.length;
        		for(let s of res){
        			sectionCount--;
        			s.sectionCount = sectionNumber++;
        			s.sectionId = s._id;
        			surveyService.getQuestionBySectionId(s._id,this.props.user.authtoken,false)
	    	    	.then(res=>{
	    	    		survey.questions = survey.questions.concat(res);
	    	    		let questionCount = res.length;
	    	    		let questionNumber = 1;
		    	    	for(let q of res){
		    	    		q.questionCount = questionNumber++;
		    	    		q.questionId = q._id
		    	    		questionCount--;
		    	    		surveyService.getPossibilitiesByQuestionId(q._id,this.props.user.authtoken,false)
		    	    		.then(res => {
		    	    			let possibilitiesCount = res.length;
		    	    			for(let p of res){
    	    						p.possibilityId = p._id;
    	    						p.questionId = p.questionId;
    	    						p.sectionId = p.sectionId;
    	    						surveyService.getAnswersByPossibilityId(p._id,this.props.user.authtoken,false)
    	    						.then(res => {
    	    							p.answers = '';
    	    							let i = 1;
    	    							for(let a of res){
    	    								if(q.typeId == '1' || q.typeId == '5bffb0ec682ae23931c642e8'){
        	    								p.answers = i;
            	    						} else if(q.typeId == '2' || q.typeId == '5bffb10273796c52838e644f'){
            	    							p.answers = i;
                	    					} else {
                	    						p.answers += a.text + ', ';
                	    					}
    	    								i++;
    	    							}
    	    							
    	    						})
    	    						possibilitiesCount--;
    	    						console.log('sectionCount',sectionCount)
    	    						console.log('questionCount',questionCount)
    	    						console.log('possibilitiesCount',possibilitiesCount)
    	    					}
//		    	    			console.log('survey.possibilities',res);
		    	    			
		    	    			survey.possibilities = survey.possibilities.concat(res);
		    	    			if(questionCount == 0 && possibilitiesCount == 0 && sectionCount == 0){
		    	    				this.setState({
		    	    					ready: true, 
		    	    					survey: {
		    	    						survey:[survey],
		    	    						sections:survey.sections,
		    	    						questions:survey.questions,
		    	    						possibilities:survey.possibilities,
			    	    					title:survey.title, 
			    	    					notes:survey.notes 
			    	    				}
		    	    				});
		    	    			}
		    	    		})
		    	    		.catch(err => {
		    	            	dispatch(notificationActions.error(err.responseJSON.description));
		    	            });
	    	    		}
	    	    	})
	    	    	.catch(err => {
	    	        	dispatch(notificationActions.error(err.responseJSON.description));
	    	        });
        		}
        	})
        	.catch(err => {
            	dispatch(notificationActions.error(err.responseJSON.description));
            });
        })
        .catch(err => {
        	dispatch(notificationActions.error(err.responseJSON.description));
        });
        
//        .then(res => {
//            //res = JSON.parse(res);
//            console.log("res from survey with answers",res)
//            console.log(res)
//            if (res.error) {
//                dispatch(notificationActions.error(res.error));
//            } else {
//                res.title = res.survey[0].title;
//                res.notes = res.survey[0].notes;
//                res.sections.forEach((s, si) => {
//                    s.sectionCount = si + 1;
//                    res.questions.filter(q => q.sectionId === s.sectionId).forEach((q, qi) => {
//                        q.sectionCount = si + 1;
//                        q.questionCount = qi + 1;
//                        q.typeId = Number(q.typeId);
//                        res.possibilities.filter(p => p.questionId === q.questionId && p.sectionId === s.sectionId)
//                            .forEach((p, pi) => {
//                                p.sectionCount = s.sectionCount;
//                                p.questionCount = q.questionCount;
//                                p.possibilityCount = pi + 1;
//                                p.typeId = q.typeId;
//                                let answers = [];
//								res.answers
//									.filter(a => a.possibilityId == p.possibilityId)
//									.forEach(a => {
//										if(q.typeId == 1 && a.text == 'true'){
//											answers.push(a.text);
//		                            	} else if(q.typeId > 1) {
//		                            		answers.push(a.text);
//		                            	}
//									})
//                            	if (p.typeId > 2) {
//										p.possibilityTitle = 'Answers';
//										p.answers = answers.join(', ');
//                                } else {
//                                	p.answers = answers.length;
//                                }
//                        })
//                    })
//                })
//                this.setState({loading: false, survey: res});
//            }
//        }).catch(err => console.log(err.statusText));
    }
    
    render() {
        return (
              	!this.props.user.authtoken
                ? <Redirect to="/login" />  
                :
            	(!this.state || !this.state.ready) ?
                	'Loading ...'
            	:
                this.state.redirect
                ? this.state.redirect
                : (<div className="row">
                    <div className="col-sm-12">
                        <h1 className="text-center">{this.state.survey.title}</h1>
                        <h3 className="text-center">{this.state.survey.notes}</h3>
                        <br />
                        <br />
                        {this.state.survey.sections.map(s=> <div key={s._id}><h2>{s.sectionTitle}</h2>{
                        	this.state.survey.questions.filter(q => q.sectionId === s.sectionId).map(q => <div key={q._id}><h4>{q.questionTitle}</h4>{
                        		this.state.survey.possibilities.filter(p => p.questionId === q.questionId).map(p => <div key={p._id}><h6>{p.possibilityTitle}: {p.answers}</h6></div>)
                        	}<br /><br /></div>)
                        }</div>)}
                        
                      
                    </div>
                </div>)
        );
    }
}

function mapStateToProps(state) {
    return {survey: state.survey, user: state.user};
}

const SurveyResult = connect(mapStateToProps)(SurveyResultBase);
export default SurveyResult;
        
