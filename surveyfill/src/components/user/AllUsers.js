import React, { Component } from 'react'; 
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import userService from '../../services/userService';
import notificationActions from '../../actions/notificationActions';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import { Table } from 'reactstrap';
import classnames from 'classnames';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'

class AllUsersBase extends Component {

	constructor(props) {
	    super(props);

	    this.state = {
	      loading: true,
	      users:[{}]
	    };
	    
	    this.deleteUser = this.deleteUser.bind(this);
	}
	
	 componentDidMount() {
    	userService.getAllUsers({authtoken:this.props.user.authtoken})
    	.then(res => {
    		res = JSON.parse(res);
    		console.log('allusers ', res)
    		this.setState({users:res.users, loading: false});
    	}).catch(res=>console.log(res.statusText));
    }
	 
	 deleteUser(e, id){
		 e.preventDefault();
		 let data = {userId:id, authtoken:this.props.user.authtoken};
		 const dispatch = this.props.dispatch;
		 userService.deleteUser(data)
		 .then(res => {
    		res = JSON.parse(res);
    		console.log('delete user ', res)
    		let users = this.state.users.filter(x=> x.userId != id);
    		this.setState({users});
    		dispatch(notificationActions.info("Delete user success!"));
    	});
	 }
	
	render() {
	    return (this.props.user.role != 'admin'
	    ?<Redirect to="/" />
	    :this.state.loading
	    ? <div>Loading ... </div>
	    :( <div className="row">
	    <Table>
        <thead>
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>USERNAME</th>
            <th>E-MAIL</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
        	{this.state.users.map((x, i)=> (<tr>
            <th scope="row">{i + 1}</th>
            <td>{x.userId}</td>
            <td>{x.username}</td>
            <td>{x.email}</td>
            <td><a href="/delete" onClick={(e) => this.deleteUser(e, x.userId)}>[DELETE]</a></td>
          </tr>))}
        </tbody>
      </Table>
	      </div>
	    ));
	  }
}

function mapStateToProps(state) {
    return {user: state.user};
}

const AllUsers = connect(mapStateToProps)(AllUsersBase);
export default AllUsers;
        
