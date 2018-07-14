import React, { Component } from 'react'; 
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import NewSection from './NewSection';
import notificationActions from '../../actions/notificationActions';
import surveyActions from '../../actions/surveyActions';
import surveyService from '../../services/surveyService';
import surveyValidator from '../../validators/surveyValidator';

import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'

class DeleteSurveyBase extends Component {

    constructor(props) {
        super(props);
        this.state = {redirect: false };
        this.deleteSurvey = this.deleteSurvey.bind(this);
    }

    componentDidMount() {
        const dispatch = this.props.dispatch;
        let surveyId = this.props.match.params.id;
        surveyService.getById(surveyId)
        .then(res => {
            res = JSON.parse(res);
            console.log(res)
            if (res.error) {
                dispatch(notificationActions.error(res.error));
            } else {
                if (res.survey[0].respondents > 0) {
                    dispatch(notificationActions.error("Sorry, you can't edit survey, that is already filled!"));
                    this.setState({redirect:<Redirect to="/" />})
                } else {
                    res.title = res.survey[0].title;
                    res.notes = res.survey[0].notes;
                    res.sections.forEach((s, si) => {
                        s.sectionCount = si + 1;
                        res.questions.filter(q => q.sectionId === s.sectionId).forEach((q, qi) => {
                            q.sectionCount = si + 1;
                            q.questionCount = qi + 1;
                            res.possibilities.filter(p => p.questionId === q.questionId && p.sectionId === s.sectionId)
                                .forEach((p, pi) => {
                                    p.sectionCount = si + 1;
                                    p.questionCount = qi + 1;
                                    p.possibilityCount = pi + 1;
                            })
                        })
                    })
                    dispatch(surveyActions.initializeSurvey(res));
                }
            }
        }).catch(err => console.log(err.statusText));
    }
 
   deleteSurvey(e) {
       e.preventDefault();
       const dispatch = this.props.dispatch;
       let data = Object.assign({}, this.props.survey, {authtoken: this.props.user.authtoken, userId: this.props.user.userId});
       console.log('deleteSurvey ', data);
       surveyService.deleteSurvey(data)
	   .then(res => {
		   res = JSON.parse(res);
		   console.log('res delete ', res);
		   if (res.error) {
               dispatch(notificationActions.error(res.error));
           } else {
        	   this.props.dispatch(surveyActions.clearSurvey());
        	   dispatch(notificationActions.info(res.success));
        	   this.setState({redirect:<Redirect to='/' />})
           }
	   })
    }

    
    render() {
        return (
            (this.state.redirect 
            ? this.state.redirect
            : (<div className="row">
                <div className="col-sm-12">
                    <h1 className="text-center">Are you sure deleting {this.props.survey.title}?</h1>
                    
                    <p><Link to='/' onClick={this.deleteSurvey} >YES</Link> </p>
                    <p><Link to='/' >NO</Link></p>
                </div>
            </div>))
        );
    }
}

function mapStateToProps(state) {
    return {survey: state.survey, user: state.user};
}

const DeleteSurvey = connect(mapStateToProps)(DeleteSurveyBase);
export default DeleteSurvey;
        
