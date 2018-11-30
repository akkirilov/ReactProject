import React, { Component } from 'react'; 
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import FillSection from './FillSection';
import notificationActions from '../../actions/notificationActions';
import surveyActions from '../../actions/surveyActions';
import surveyService from '../../services/surveyService';
import surveyValidator from '../../validators/surveyValidator';

import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'

class FillSurveyBase extends Component {

    constructor(props) {
        super(props);
        this.state = {ready: false}
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const dispatch = this.props.dispatch;
        let surveyId = this.props.match.params.id;
        surveyService.getById(surveyId, this.props.user.authtoken)
        .then(res => {
        	let survey = res[0];
        	survey.questions = [];
        	survey.possibilities = [];
        	
        	surveyService.getSectionBySurveyId(survey._id,this.props.user.authtoken,false)
        	.then(res => {
        		survey.sections = res;
        		for(let s of survey.sections){
        			s.sectionCount = survey.sections.length;
        			s.sectionId = s._id;
        			surveyService.getQuestionBySectionId(s._id,this.props.user.authtoken,false)
	    	    	.then(res=>{
	    	    		survey.questions = survey.questions.concat(res);
	    	    		let questionCount = survey.questions.length;
		    	    	for(let q of survey.questions){
		    	    		q.questionCount = survey.questions.length;
		    	    		q.questionId = q._id
		    	    		surveyService.getPossibilitiesByQuestionId(q._id,q.sectionId,this.props.user.authtoken,false)
		    	    		.then(res => {
		    	    			for(let p of res){
    	    						p.possibilityId = p._id;
    	    					}
		    	    			questionCount--;
		    	    			survey.possibilities = survey.possibilities.concat(res);
		    	    			if(questionCount == 0){
		    	    				surveyService.getTypesOfQuestions(this.props.user.authtoken,false)
		    	    				.then(res => {
		    	    					survey.typesOfQuestions = res;
		    	    					this.setState({surveys:res, ready: true});
		    	    					console.log('kinvey survey',survey)
		    	    					dispatch(surveyActions.initializeSurvey(survey));
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
        		}
        	})
        	.catch(err => {
            	dispatch(notificationActions.error(err.responseJSON.description));
            });
        })
        .catch(err => {
        	dispatch(notificationActions.error(err.responseJSON.description));
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const dispatch = this.props.dispatch;
        let error = surveyValidator.validateFillSurvey(this.props.survey);
        let survey = Object.assign({}, this.props.survey, {authtoken: this.props.user.authtoken, userId: this.props.user.userId || 0});
         if (error) {
             this.props.dispatch(notificationActions.error(error));
         } else {
             surveyService.fillSurvey(survey)
             .then(res => {
                 //res = JSON.parse(res);
                 console.log("fill survey res ", res)
                 if (res.error) {
                     dispatch(notificationActions.error(res.error));
                 } else {
                     dispatch(notificationActions.info("Successfully filled survey!"));
                     dispatch(surveyActions.clearSurvey());
                     this.setState({redirect: <Redirect to='/' />});
                 }
             }).catch(err => console.log(err.statusText));
         }
    }

    handleCancel() {
        this.props.dispatch(surveyActions.clearSurvey());
        this.setState({redirect: <Redirect to='/' />});
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
                    <h1 className="text-center">{this.props.survey.title}</h1>
                    <h3 className="text-center">{this.props.survey.notes}</h3>
                    <br /><br />
                    <Form>
                    <div className="row">
                        <div className="col-sm-12">
                            {this.props.survey.sections
                                .map((x, i) => (<FillSection 
                                sectionName={'s' + x.sectionId} 
                                key={x.sectionId} 
                                counter={i + 1}
                                sectionId={x.sectionId}
                                sectionCount={x.sectionCount}  
                                sectionTitle={x.sectionTitle}/>))}
                        </div>
                    </div>
                    <br />
                    <div className="row">
                        <div className="col-sm-3 offset-3">
                            <Button className="center" color="success" onClick={this.handleSubmit} >Submit</Button>
                        </div>
                        <div className="col-sm-3">
                            <Button className="center" color="danger" onClick={this.handleCancel} >Cancel</Button>
                        </div>
                    </div>
                    </Form>
                </div>
            </div>)
        );
    }
}

function mapStateToProps(state) {
    return {survey: state.survey, user: state.user};
}

const FillSurvey = connect(mapStateToProps)(FillSurveyBase);
export default FillSurvey;
        
