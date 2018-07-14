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
    	this.props.survey.possibilities.forEach(x => console.log("pTypeId: "+x.typeId))
    	console.log(this.props.survey)
        let type = 'radio';
        let labelSize = 'sm-10';
        if (this.props.typeId == 2) {
            type = 'checkbox';
        } else if (this.props.typeId == 3) {
            type = 'number';
            labelSize = 'sm-2';
        } else if (this.props.typeId == 4) {
        	type = 'textarea';
            labelSize = 'sm-2';
        }
        this.setState({type, labelSize});
    }

    changeFilledValue(e) {
    	
        this.props.dispatch(surveyActions.changeFilledValue(this.props.sectionId, this.props.questionId, this.props.possibilityId, this.props.typeId, e.target.value));
    }

    render() {
        return (
            this.props.typeId == 3 || this.props.typeId == 4
            ? (<FormGroup>
                <Label for={this.props.possibilityId}>{this.props.questionTitle}</Label>
                <Input onChange={this.changeFilledValue} type={this.props.typeId == 3?"number":"textarea"} name={this.props.questionId} />
                
                <br />
            </FormGroup>)
            : (<FormGroup check horizontal>
                <Label check >
                <Input onChange={this.changeFilledValue} type={this.props.typeId == 1?"radio":"checkbox"} name={this.props.questionId} />
                {this.props.possibilityTitle}
                </Label>
                <br />
            </FormGroup>)
        );
    }
}

function mapStateToProps(state) {
    return {survey: state.survey};
}

const FillPossibility = connect(mapStateToProps)(FillPossibilityBase);
export default FillPossibility;
