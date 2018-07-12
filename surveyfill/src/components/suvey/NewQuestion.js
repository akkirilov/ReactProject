import React, { Component } from 'react'; 
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

import NewPossibility from './NewPossibility';
import notificationActions from '../../actions/notificationActions';
import surveyActions from '../../actions/surveyActions';

import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'

class NewQuestionBase extends Component {

    constructor(props) {
        super(props);

        this.handleRemoveQuestion = this.handleRemoveQuestion.bind(this);
        this.changeQuestionHeader = this.changeQuestionHeader.bind(this);
        this.handleQuestionRequired = this.handleQuestionRequired.bind(this);
        this.handleQuestionType = this.handleQuestionType.bind(this);
        this.handleAddPossibility = this.handleAddPossibility.bind(this);
    }

    handleAddPossibility(e) {
        this.props.dispatch(surveyActions.addPossibility(this.props.sectionId, this.props.questionId));
    }

    handleRemoveQuestion() {
        if (this.props.survey.questions.filter(x => x.sectionId == this.props.sectionId).length <= 1) {
            this.props.dispatch(notificationActions.error('Section must has at least one question!'));
        } else {
            this.props.dispatch(surveyActions.removeQuestion(this.props.sectionId, this.props.questionId));
        }
    }

    changeQuestionHeader(e) {
        this.props.dispatch(surveyActions.changeQuestionHeader(this.props.sectionId, this.props.questionId, e.target.value));
    }

    handleQuestionType(e) {
        this.props.dispatch(surveyActions.changeQuestionType(this.props.sectionId, this.props.questionId, e.target.value));
    }

    handleQuestionRequired(e) {
        this.props.dispatch(surveyActions.changeQuestionRequired(this.props.sectionId, this.props.questionId, e.target.value));
    }

    render() {
        return (
            <div className="row">
            <h3>Question {this.props.sectionCount}.{this.props.questionCount} {this.props.edit ? '' : <Button size="sm" color="danger" onClick={this.handleRemoveQuestion} >Remove question</Button>}</h3>
                <div className="col-sm-12">
                    <Input type="text" 
                            onChange={this.changeQuestionHeader} 
                            sectionId={this.props.sectionId} 
                            questionId={this.props.questionId}
                            value={this.props.questionTitle} 
                            name={this.props.questionId} 
                            id={this.props.questionName} 
                            placeholder="Enter question ..." />
                    <br />
                    <div className="row">
                        <Label sm={1} for={this.props.questionName + 'r'}>Required?</Label>
                        <Col sm={2}>
                        <Input onChange={this.handleQuestionRequired} type="select" name={this.props.questionName + 'r'} id={this.props.questionName + 'r'}>
                            <option value="1">Yes</option>
                            <option value="0" selected>No</option>
                        </Input>
                        </Col>
                        <Label sm={1} for={this.props.questionName + 't'}>Type: </Label>
                        <Col sm={3}>
                        <Input onChange={this.handleQuestionType} type="select" name={this.props.questionName + 't'} id={this.props.questionName + 'r'}>
                            {this.props.survey.typesOfQuestions.map(x => (<option key={x.value} value={x.value}>{x.name}</option>))}
                        </Input>
                        </Col>
                    <br />
                    </div>
                    <br />
                    <div className="row">
                        <div className="col-sm-12">
                        {this.props.survey.possibilities
                            .filter(x => x.sectionId === this.props.sectionId && x.questionId === this.props.questionId)
                            .map(x => (
                            <NewPossibility 
                                key={x.possibilityId} 
                                possibilityName={'s' + x.sectionId + 'q' + x.questionId + 'p' + x.possibilityId}
                                edit={this.props.edit}
                                sectionId={x.sectionId}
                                sectionCount={this.props.sectionCount}
                                questionCount={this.props.questionCount}  
                                possibilityCount={x.possibilityCount}
                                questionId={x.questionId}
                                possibilityId={x.possibilityId}
                                possibilityTitle={x.possibilityTitle} />)
                            )
                        }
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            {this.props.edit ? '' : <Button className="float-sm-right" color="primary" size="sm" onClick={this.handleAddPossibility} >Add new possibility</Button>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {survey: state.survey};
}

const NewQuestion = connect(mapStateToProps)(NewQuestionBase);
export default NewQuestion;
