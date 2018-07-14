import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import surveyService from '../../services/surveyService';
import notificationActions from '../../actions/notificationActions';

import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

class AllSurveysBase extends Component {

    constructor(props) {
        super(props);
        this.state = {ready: false}
    }
    
    componentDidMount() {
    	surveyService.getAllSurveys()
    	.then(res => {
    		res = JSON.parse(res);
    		console.log(res)
    		this.setState({surveys:res.surveys, ready: true});
    	})
    	console.log(this.props.user)
    }

    render() {
        return (
        <div>
        	{this.state.ready 
        		? this.state.surveys.map(x=> <div key={x.surveyId}>{x.title} <Link to={'/survey-result/' + x.surveyId}>RESULTS </Link> <Link to={'/fill-survey/' + x.surveyId}>FILL </Link>{this.props.user.role=='admin'?<span><Link to={'/edit-survey/' + x.surveyId}>EDIT </Link> <Link to={'/delete-survey/' + x.surveyId}>DELETE </Link></span> :''}</div>)
        		: 'LOADING ...'
        	}
        </div>
        );
    }
}
function mapStateToProps(state) {
    return {user: state.user};
}
 
const AllSurveys = connect(mapStateToProps)(AllSurveysBase);
export default AllSurveys;
        
