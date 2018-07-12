import React, { Component } from 'react'; 
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

import notificationActions from '../../actions/notificationActions';
import surveyActions from '../../actions/surveyActions';

import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'

class FillPossibilityBase extends Component {

    constructor(props) {
        super(props);
        this.state = {}
        this.changeFilledValue = this.changeFilledValue.bind(this);
    }

    componentDidMount() {
        let type = 'radio';
        let labelSize = 'sm-10';
        if (this.props.typeId == 2) {
            type = 'checkbox';
        } else if (this.props.typeId > 2) {
            type = 'checkbox';
            let labelSize = 'sm-2';
        } 
        this.setState({type, labelSize});
    }

    changeFilledValue(e) {
        this.props.dispatch(surveyActions.changeFilledValue(this.props.sectionId, this.props.questionId, this.props.possibilityId, e.target.value));
    }

    render() {
        return (
            this.state.type == "textarea"
            ? <FormGroup check>
                <Label for={this.props.possibilityId} sm={2}>{this.props.possibilityTitle}</Label>
                <Col sm={10}>
                    <Input type="textarea" name={this.props.possibilityId} id={this.props.possibilityId} />
                </Col>
                <br />
            </FormGroup>
            : <FormGroup check horizontal>
                <Label check >
                <Input type={this.state.type} name={this.props.questionId} />
                {this.props.possibilityTitle}
                </Label>
                <br />
            </FormGroup>
        );
    }
}

function mapStateToProps(state) {
    return {survey: state.survey};
}

const FillPossibility = connect(mapStateToProps)(FillPossibilityBase);
export default FillPossibility;
