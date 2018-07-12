import React, { Component } from 'react'; 
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

import notificationActions from '../../actions/notificationActions';
import surveyActions from '../../actions/surveyActions';

import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'

class NewPossibilityBase extends Component {

    constructor(props) {
        super(props);

        this.handleRemovePossibility = this.handleRemovePossibility.bind(this);
        this.changePossibilityHeader = this.changePossibilityHeader.bind(this);
    }

    handleRemovePossibility() {
        if (this.props.survey.possibilities.filter(x => x.sectionId === this.props.sectionId && x.questionId === this.props.questionId).length <= 1) {
            this.props.dispatch(notificationActions.error('Question must has at least one possibility!'));
        } else {
            this.props.dispatch(surveyActions.removePossibility(this.props.sectionId, this.props.questionId, this.props.possibilityId));
        }
    }

    changePossibilityHeader(e) {
        this.props.dispatch(surveyActions.changePossibilityHeader(this.props.sectionId, this.props.questionId, this.props.possibilityId, e.target.value));
    }

    render() {
        return (
            <FormGroup row>
                <Label for={this.props.possibilityName} sm={1}>{this.props.sectionCount}.{this.props.questionCount}.{this.props.possibilityCount}.</Label>
                <Col sm={10}>
                    <Input type="text"
                            name={this.props.possibilityName} 
                            onChange={this.changePossibilityHeader}
                            value={this.props.possibilityTitle} 
                            id={this.props.possibilityName} 
                            placeholder="Enter possibility ..." />
                </Col>
                <Col sm={1}>
                    {this.props.edit ? '' : <Button size="sm" color="danger" onClick={this.handleRemovePossibility} >Remove</Button>}
                </Col>
            </FormGroup>
        );
    }
}

function mapStateToProps(state) {
    return {survey: state.survey};
}

const NewPossibility = connect(mapStateToProps)(NewPossibilityBase);
export default NewPossibility;
