import React, { Component } from 'react'; 
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import surveyService from '../../services/surveyService';
import notificationActions from '../../actions/notificationActions';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'

class ProfileBase extends Component {

	constructor(props) {
	    super(props);

	    this.state = {
	      activeTab: '1',
	      ready: false
	    };
	    
	    this.toggle = this.toggle.bind(this);
	}
	
	 componentDidMount() {
	    	surveyService.getSurveysByUserId(this.props.user)
	    	.then(res => {
	    		res = JSON.parse(res);
	    		console.log(res)
	    		this.setState({surveys:res.surveys, ready: true});
	    	})
	    }
	
	toggle(tab) {
	   if (this.state.activeTab !== tab) {
		   this.setState({
		        activeTab: tab
		   });
	   }
	}
    
	render() {
	    return (!this.props.user.authtoken
	    ?<Redirect to="/" />
	    :!this.state.ready
	    ? ''
	    :( <div>
	        <Nav tabs>
	          <NavItem>
	            <NavLink
	              className={classnames({ active: this.state.activeTab === '1' })}
	              onClick={() => { this.toggle('1'); }}
	            >
	              My surveys
	            </NavLink>
	          </NavItem>
	          <NavItem>
	            <NavLink
	              className={classnames({ active: this.state.activeTab === '2' })}
	              onClick={() => { this.toggle('2'); }}
	            >
	              Moar Tabs
	            </NavLink>
	          </NavItem>
	        </Nav>
	        <TabContent activeTab={this.state.activeTab}>
	          <TabPane tabId="1">
	            <Row>
	              <Col sm="12">
	              {this.state.surveys.map(x=> <div key={x.surveyId}>{x.title} <Link to={'/survey-result/' + x.surveyId}>RESULTS </Link> <Link to={'/fill-survey/' + x.surveyId}>FILL </Link> <Link to={'/edit-survey/' + x.surveyId}>EDIT </Link> <Link to={'/delete-survey/' + x.surveyId}>DELETE </Link></div>)}
	              </Col>
	            </Row>
	          </TabPane>
	          <TabPane tabId="2">
	            <Row>
	              <Col sm="6">
	                <Card body>
	                  <CardTitle>Special Title Treatment</CardTitle>
	                  <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
	                  <Button>Go somewhere</Button>
	                </Card>
	              </Col>
	              <Col sm="6">
	                <Card body>
	                  <CardTitle>Special Title Treatment</CardTitle>
	                  <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
	                  <Button>Go somewhere</Button>
	                </Card>
	              </Col>
	            </Row>
	          </TabPane>
	        </TabContent>
	      </div>
	    ));
	  }
}

function mapStateToProps(state) {
    return {user: state.user};
}

const Profile = connect(mapStateToProps)(ProfileBase);
export default Profile;
        
