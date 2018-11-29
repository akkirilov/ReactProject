import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import surveyService from '../../services/surveyService';
import notificationActions from '../../actions/notificationActions';

import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

class HomeBase extends Component {

    constructor(props) {
        super(props);
        this.state = {ready: false}
    }
    
    componentDidMount() {
    	let authtoken = this.props.user.authtoken;
    	surveyService.getRecentSurveys(authtoken)
    	.then(res => {
    		console.log(res)
//    		res = JSON.parse(res);
    		this.setState({surveys:res, ready: true});
    	})
    }

    render() {
        return (
        		!this.props.user.authtoken
                ? <Redirect to="/login" />  
                : <div>
        	<h1>Recent surveys:</h1>
        	{(this.state && this.state.ready)
        		? this.state.surveys.map(x=> <div key={x.surveyId}>{x.title} <Link to={'/fill-survey/' + x._id}> FILL </Link> {this.props.user.authtoken?<Link to={'/survey-result/' + x._id}> RESULTS </Link>:''} </div>)
        		: 'Loading ...'
        	}
        </div>
        );
    }
}
function mapStateToProps(state) {
    return {user: state.user};
}
 
const Home = connect(mapStateToProps)(HomeBase);
export default Home;
        
