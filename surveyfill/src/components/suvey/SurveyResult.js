import React, { Component } from 'react'; 
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import FillSection from './FillSection';
import notificationActions from '../../actions/notificationActions';
import surveyService from '../../services/surveyService';

import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'

class SurveyResultBase extends Component {

    constructor(props) {
        super(props);
        this.state = { loading: true, survey:{}};
    }

    componentDidMount() {
    	if (!this.props.user.authtoken) {
			this.setState({redirect:<Redirect to='/login' />});
			this.props.dispatch(notificationActions.error('You need to be logged to view survey results!'));
		}
    	const dispatch = this.props.dispatch;
        let surveyId = this.props.match.params.id;
        surveyService.getByIdWithAnswers(surveyId)
        .then(res => {
            res = JSON.parse(res);
            console.log("res from survey with answers")
            console.log(res)
            if (res.error) {
                dispatch(notificationActions.error(res.error));
            } else {
                res.title = res.survey[0].title;
                res.notes = res.survey[0].notes;
                res.sections.forEach((s, si) => {
                    s.sectionCount = si + 1;
                    res.questions.filter(q => q.sectionId === s.sectionId).forEach((q, qi) => {
                        q.sectionCount = si + 1;
                        q.questionCount = qi + 1;
                        q.typeId = Number(q.typeId);
                        res.possibilities.filter(p => p.questionId === q.questionId && p.sectionId === s.sectionId)
                            .forEach((p, pi) => {
                                p.sectionCount = s.sectionCount;
                                p.questionCount = q.questionCount;
                                p.possibilityCount = pi + 1;
                                p.typeId = q.typeId;
                                let answers = [];
								res.answers
									.filter(a => a.possibilityId == p.possibilityId)
									.forEach(a => {
										if(q.typeId == 1 && a.text == 'true'){
											answers.push(a.text);
		                            	} else if(q.typeId > 1) {
		                            		answers.push(a.text);
		                            	}
									})
                            	if (p.typeId > 2) {
										p.possibilityTitle = 'Answers';
										p.answers = answers.join(', ');
                                } else {
                                	p.answers = answers.length;
                                }
                        })
                    })
                })
                this.setState({loading: false, survey: res});
            }
        }).catch(err => console.log(err.statusText));
    }
    
    render() {
        return (
            this.state.loading
            ? <h2>Loading ...</h2>
            : this.state.redirect 
            	? this.state.redirect
            	:(<div className="row">
                <div className="col-sm-12">
                    <h1 className="text-center">{this.state.survey.title}</h1>
                    <br />
                    <h3 className="text-center">{this.state.survey.notes} <Link to={'/fill-survey/'+this.props.survey.surveyId}></Link><br /></h3>
                    <br />
                    <h3 className="text-center">Respondents: {this.state.survey.survey[0].respondents} </h3>
                    <br />{"state survey for fill", console.log(this.state.survey)}
                    <br />
                    {this.state.survey.sections.map(s=> <div><h2>{s.sectionTitle}</h2>{
                    	this.state.survey.questions.filter(q => q.sectionId === s.sectionId).map(q => <div><h3>{q.questionTitle}</h3>{
                    		this.state.survey.possibilities.filter(p => p.questionId === q.questionId).map(p => <div><h4>{p.possibilityTitle}: {p.answers}</h4></div>)
                    	}<br /></div>)
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
        
