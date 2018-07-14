import React, { Component } from 'react';
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
    	surveyService.getRecentSurveys()
    	.then(res => {
    		res = JSON.parse(res);
    		console.log(res)
    		this.setState({surveys:res.surveys, ready: true});
    	})
    }

    render() {
        return (
        <div>
        	<h1>Recent surveys:</h1>
        	{this.state.ready 
        		? this.state.surveys.map(x=> <div key={x.surveyId}>{x.title} <Link to={'/fill-survey/' + x.surveyId}> FILL </Link> {this.props.user.authtoken?<Link to={'/survey-result/' + x.surveyId}> RESULTS </Link>:''} </div>)
        		: 'LOADING ...'
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
        
