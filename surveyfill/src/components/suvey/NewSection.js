import React, { Component } from 'react'; 
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

import NewQuestion from './NewQuestion';
import notificationActions from '../../actions/notificationActions';
import surveyActions from '../../actions/surveyActions';
import userService from '../../services/userService';
import userValidator from '../../validators/userValidator';

import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'

class NewSectionBase extends Component {

    constructor(props) {
        super(props);

        this.handleRemoveSection = this.handleRemoveSection.bind(this);
        this.handleAddQuestion = this.handleAddQuestion.bind(this);
        this.changeSectionHeader = this.changeSectionHeader.bind(this);
    }

    handleRemoveSection() {
        if (this.props.sectionId <= 1) {
            this.props.dispatch(notificationActions.error('Survey must has at least one section!'));
            return;
        }
        this.props.dispatch(surveyActions.removeSection(this.props.sectionId));
    }

    handleAddQuestion() {
        this.props.dispatch(surveyActions.addQuestion(this.props.sectionId));
    }

    changeSectionHeader(e) {
        this.props.dispatch(surveyActions.changeSectionHeader(this.props.sectionId, e.target.value));
    }

    render() {
        return (
            <div className="row">
            <h3>Section {this.props.sectionCount} {this.props.edit ? '' : <Button size="sm" color="danger" onClick={this.handleRemoveSection} >Remove section</Button>}</h3>
                <div className="col-sm-12">
                    <FormGroup>
                        <Label for={this.props.sectionName}>Title</Label>
                        <Input type="text" 
                            onChange={this.changeSectionHeader} 
                            sectionId={this.props.sectionId} 
                            value={this.props.sectionTitle} 
                            name={this.props.sectionId} 
                            id={this.props.sectionName} 
                            placeholder="Enter section name ..." />
                    </FormGroup>
                    {this.props.survey.questions
                        .filter(x => x.sectionId === this.props.sectionId)
                        .map((x, i) => (<NewQuestion 
                            key={x.questionId} 
                            questionName={'s' + x.sectionId + 'q' + x.questionId}
                            sectionId={x.sectionId}
                            edit={this.props.edit}
                            sectionCount={this.props.sectionCount}
                        	typeId={x.typeId}
                            questionCount={x.questionCount}  
                            questionId={x.questionId} 
                            questionTitle={x.questionTitle} />)
                        )
                    }
                    <br />
                    <div className="row">
                        <div className="col-sm-12">
                            {this.props.edit ? '' : <Button className="float-sm-right" color="primary" size="sm" onClick={this.handleAddQuestion} >Add new question</Button>}
                        </div>
                        <br />
                    </div>
                    <br />
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {survey: state.survey};
}

const NewSection = connect(mapStateToProps)(NewSectionBase);
export default NewSection;