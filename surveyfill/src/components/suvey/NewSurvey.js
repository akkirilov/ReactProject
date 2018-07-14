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

class NewSurveyBase extends Component {

    constructor(props) {
        super(props);

        this.handleAddSection = this.handleAddSection.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleResetSurvey = this.handleResetSurvey.bind(this);
        this.changeSurveyHeader = this.changeSurveyHeader.bind(this);
    }

    componentDidMount() {
        const dispatch = this.props.dispatch;
        surveyService.getTypesOfQuestions()
        .then(res => {
            res = JSON.parse(res);
            console.log(res)
            if (res.error) {
                dispatch(notificationActions.error(res.error));
            } else {
                dispatch(surveyActions.changeSurveyHeader({typesOfQuestions:res}));
            }
        }).catch(err => console.log(err.statusText));
    }

    handleResetSurvey() {
        this.props.dispatch(surveyActions.clearSurvey());
    }

    handleAddSection() {
        this.props.dispatch(surveyActions.addSection());
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.dispatch(surveyActions.changeSurveyHeader({userId: this.props.user.userId}));
        const dispatch = this.props.dispatch;
        let error = surveyValidator.validateNewSurvey(this.props.survey);
        let survey = Object.assign({}, this.props.survey, {authtoken: this.props.user.authtoken, userId: this.props.user.userId});
        console.log("new survey")
        console.log(survey)
        if (error) {
            this.props.dispatch(notificationActions.error(error));
        } else {
            surveyService.addSurvey(survey)
            .then(res => {
                res = JSON.parse(res);
                if (res.error) {
                    dispatch(notificationActions.error(res.error));
                } else {
                    dispatch(notificationActions.info("Successfully added new survey!"));
                    dispatch(surveyActions.clearSurvey());
                }
            }).catch(err => console.log(err.statusText));
        }
    }

    changeSurveyHeader(e) {
        this.props.dispatch(surveyActions.changeSurveyHeader({[e.target.name]:e.target.value}));
    }

    render() {
        return (!this.props.user.authtoken
            ? <Redirect to="/login" />  
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
                                sectionCount={x.sectionCount} 
                                counter={i + 1}
                                sectionId={x.sectionId} 
                                sectionTitle={x.sectionTitle}/>))}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <Button className="float-sm-right" size="sm" color="primary" onClick={this.handleAddSection} >Add new section</Button>
                        </div>
                    </div>
                    <br />
                    <div className="row">
                        <div className="col-sm-3 offset-3">
                            <Button className="center" color="success" onClick={this.handleSubmit} >Submit</Button>
                        </div>
                        <div className="col-sm-3">
                            <Button className="center" color="danger" onClick={this.handleResetSurvey} >Reset</Button>
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

const NewSurvey = connect(mapStateToProps)(NewSurveyBase);
export default NewSurvey;
        
