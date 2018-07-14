import React, { Component } from 'react'; 
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

import FillQuestion from './FillQuestion';
import notificationActions from '../../actions/notificationActions';
import surveyActions from '../../actions/surveyActions';
import userService from '../../services/userService';
import userValidator from '../../validators/userValidator';

import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'

class FillSectionBase extends Component {

    render() {
        return (
            <div className="row">
                <div className="col-sm-12">
                    <h2>Section {this.props.sectionCount}. {this.props.sectionTitle}</h2>
                    {this.props.survey.questions
                        .filter(x => x.sectionId === this.props.sectionId)
                        .map((x, i) => (<FillQuestion 
                            key={x.questionId} 
                            questionName={'s' + x.sectionId + 'q' + x.questionId}
                            sectionId={x.sectionId}
                            sectionCount={this.props.sectionCount}
                            questionCount={x.questionCount}  
                            questionId={x.questionId} 
                            questionTitle={x.questionTitle} />)
                        )
                    }
                    <br /><br />
                </div>
                <br />
                <br />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {survey: state.survey};
}

const FillSection = connect(mapStateToProps)(FillSectionBase);
export default FillSection;