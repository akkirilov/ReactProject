import React, { Component } from 'react'; 
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import NewSection from './NewSection';
import notificationActions from '../../actions/notificationActions';
import surveyActions from '../../actions/surveyActions';
import surveyService from '../../services/surveyService';
import surveyValidator from '../../validators/surveyValidator';

import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'

class EditSurveyBase extends Component {

    constructor(props) {
        super(props);
        this.state = {edit: true};
        this.handleAddSection = this.handleAddSection.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.changeSurveyHeader = this.changeSurveyHeader.bind(this);
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
 
    handleAddSection() {
        this.props.dispatch(surveyActions.addSection());
    }

    handleSubmit(e) {
        e.preventDefault();
        console.log(this.props.survey)
        const dispatch = this.props.dispatch;
        let error = surveyValidator.validateNewSurvey(this.props.survey);
        let survey = Object.assign({}, this.props.survey, {authtoken: this.props.user.authtoken, userId: this.props.user.userId});
        if (error) {
            this.props.dispatch(notificationActions.error(error));
        } else {
            surveyService.editSurvey(survey)
            .then(res => {
                res = JSON.parse(res);
                console.log('edit survey ', res)
                if (res.error) {
                    dispatch(notificationActions.error(res.error));
                } else {
                    dispatch(notificationActions.info("Successfully edited survey!"));
                    dispatch(surveyActions.clearSurvey());
                    this.setState({redirect:<Redirect to="/" />})
                }
            }).catch(err => console.log(err.statusText));
        }
    }

    changeSurveyHeader(e) {
        this.props.dispatch(surveyActions.changeSurveyHeader({[e.target.name]:e.target.value}));
    }

    render() {
        return (
            (this.state.redirect 
            ? this.state.redirect
            : (<div className="row">
                <div className="col-sm-12">
                    <h1 className="text-center">Add new survey ...</h1>
                    <Form>
                    <FormGroup>
                        <Label for="title" >Survey title</Label>
                        <Input type="text" onChange={this.changeSurveyHeader} value={this.props.survey.title} name="title" id="title" placeholder="with a placeholder" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="notes">Survey notes</Label>
                        <Input type="textarea" onChange={this.changeSurveyHeader} value={this.props.survey.notes} name="notes" id="notes" />
                    </FormGroup>
                    <div className="row">
                        <div className="col-sm-12">
                            {this.props.survey.sections
                                .map((x, i) => (<NewSection 
                                sectionName={'s' + x.sectionId} 
                                key={x.sectionId}
                                edit={this.state.edit} 
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
                    </div>
                    </Form>
                </div>
            </div>))
        );
    }
}

function mapStateToProps(state) {
    return {survey: state.survey, user: state.user};
}

const EditSurvey = connect(mapStateToProps)(EditSurveyBase);
export default EditSurvey;
        
