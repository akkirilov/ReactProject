import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
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
    	surveyService.getAllSurveys(this.props.user.authtoken)
    	.then(res => {
//    		res = JSON.parse(res);
//    		console.log(res)
    		this.setState({surveys:res, ready: true});
    	})
    	console.log(this.props.user)
    }

    render() {
        return (!this.props.user.authtoken
                ? <Redirect to="/login" />  
                    : 
        <div>
        	{this.state.ready 
        		? this.state.surveys.map(x=> <div key={x._id}>{x.title} <Link to={'/survey-result/' + x._id}>RESULTS </Link> <Link to={'/fill-survey/' + x._id}>FILL </Link>{this.props.user.role=='admin'?<span><Link to={'/edit-survey/' + x._id}>EDIT </Link> <Link to={'/delete-survey/' + x._id}>DELETE </Link></span> :''}</div>)
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
        
