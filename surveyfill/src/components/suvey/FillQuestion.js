import React, { Component } from 'react'; 
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

import FillPossibility from './FillPossibility';
import notificationActions from '../../actions/notificationActions';
import surveyActions from '../../actions/surveyActions';

import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'

class FillQuestionBase extends Component {
	
    render() {
        return (
            <div className="row">
            <div className="col-sm-12">
            <h4>Question {this.props.sectionCount}.{this.props.questionCount}. {this.props.questionTitle}</h4>
                
                {this.props.survey.possibilities
                    .filter(x => x.sectionId === this.props.sectionId && x.questionId === this.props.questionId)
                    .map(x => (
                        <FillPossibility 
                            key={x.possibilityId} 
                            possibilityName={'s' + x.sectionId + 'q' + x.questionId + 'p' + x.possibilityId}
                            edit={this.props.edit}
                            sectionId={x.sectionId}
                            typeId={this.props.typeId}
                        	qtypeId={x.typeId}
                        	questionTitle={this.props.questionTitle}
                            questionId={x.questionId}
                            possibilityId={x.possibilityId}
                            possibilityTitle={x.possibilityTitle} />)
                    )
                }
                <br />
            </div><br /><br />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {survey: state.survey};
}

const FillQuestion = connect(mapStateToProps)(FillQuestionBase);
export default FillQuestion;
