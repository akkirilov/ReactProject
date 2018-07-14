import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import '../../../node_modules/jquery/dist/jquery.min.js';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';

class NavigationBase extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            loggedView: (<Nav className="ml-auto" navbar>
					        <NavItem>
					            <NavLink tag={Link} to="/all-surveys">All surveys</NavLink>
					        </NavItem>
                            <NavItem>
                                <NavLink tag={Link} to="/add-new-survey">Add survey</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} to="/myProfile">Profile</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} to="/logout">Logout</NavLink>
                            </NavItem>
                        </Nav>),
            notLoggedView: (<Nav className="ml-auto" navbar>
						        <NavItem>
						            <NavLink tag={Link} to="/all-surveys">All surveys</NavLink>
						        </NavItem>
						        <NavItem>
						        	<NavLink tag={Link} to="/login">Login</NavLink>
	                            </NavItem>
	                            <NavItem>
	                                <NavLink tag={Link} to="/register">Register</NavLink>
	                            </NavItem>
                            </Nav>),
            adminView: (<Nav className="ml-auto" navbar>
								<NavItem>
						           	<NavLink tag={Link} to="/all-users">All users</NavLink>
						        </NavItem>
						        <NavItem>
						            <NavLink tag={Link} to="/all-surveys">All surveys</NavLink>
						        </NavItem>
						        <NavItem>
						        	<NavLink tag={Link} to="/myProfile">Profile</NavLink>
	                            </NavItem>
	                            <NavItem>
	                                <NavLink tag={Link} to="/logout">Logout</NavLink>
	                            </NavItem>
					        </Nav>)
        }
        
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        return (
        <div>
            <Navbar color="dark" className="navbar-dark bg-dark" light expand="md">
            <NavbarBrand tag={Link} to="/">SurveyFill</NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
                {this.props.user.authtoken 
                ? this.props.user.role !== 'admin'
                	? this.state.loggedView
                	: this.state.adminView
                : this.state.notLoggedView}
            </Collapse>
            </Navbar>
        </div>
        );
    }
}
function mapStateToProps(state) {
    return {user: state.user};
}
 
const Navigation = connect(mapStateToProps)(NavigationBase);
export default Navigation;
        
