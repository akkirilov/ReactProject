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
        if (this.props.typeId == '5bffb10273796c52838e644f' || this.props.typeId == 2) {
            type = 'checkbox';
        } else if (this.props.typeId == '5bffb10c88903d3936e0a0da' || this.props.typeId == 3) {
            type = 'number';
            labelSize = 'sm-2';
        } else if (this.props.typeId == '5bffb11788903d3936e0a10b' || this.props.typeId == 4) {
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
        		 this.state.type == "number" || this.state.type == "textarea"
                 ? (<FormGroup>
                     <Label for={this.props.possibilityId}>{this.props.questionTitle}</Label>
                     <Input onChange={this.changeFilledValue} type={this.state.type} name={this.props.questionId} />
                     <br />
                 </FormGroup>)
                 : (<FormGroup check horizontal>
                     <Label check >
                     <Input onChange={this.changeFilledValue} type={this.state.type} name={this.props.questionId} />
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
