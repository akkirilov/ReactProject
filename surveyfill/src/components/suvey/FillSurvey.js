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
        this.state = {};
        this.handleSubmit = this.handleSubmit.bind(this);
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
        }).catch(err => console.log(err.statusText));
    }

    handleSubmit(e) {
        e.preventDefault();
        const dispatch = this.props.dispatch;
        let error = surveyValidator.validateNewSurvey(this.props.survey);
        let survey = Object.assign({}, this.props.survey, {authtoken: this.props.user.authtoken, userId: this.props.user.userId});
        console.log(survey)
        // if (error) {
        //     this.props.dispatch(notificationActions.error(error));
        // } else {
        //     surveyService.addSurvey(survey)
        //     .then(res => {
        //         res = JSON.parse(res);
        //         if (res.error) {
        //             dispatch(notificationActions.error(res.error));
        //         } else {
        //             dispatch(notificationActions.info("Successfully added new survey!"));
        //             dispatch(surveyActions.clearSurvey());
        //             this.setState({redirect: <Redirect to='/' />});
        //         }
        //     }).catch(err => console.log(err.statusText));
        // }
    }

    handleCancel() {
        this.props.dispatch(surveyActions.clearSurvey());
        this.setState({redirect: <Redirect to='/' />});
    }

    render() {
        return (
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
        
