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
        	{this.state.ready 
        		? this.state.surveys.map(x=> <div key={x.surveyId}>{x.title} <Link to={'/fill-survey/' + x.surveyId}>FILL</Link></div>)
        		: 'LOADING ...'
        	}
        </div>
        );
    }
}
function mapStateToProps(state) {
    return {notification: state.notification};
}
 
const Home = connect(mapStateToProps)(HomeBase);
export default Home;
        
