import React, { Component } from 'react'; 
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import userActions from '../../actions/userActions';
import notificationActions from '../../actions/notificationActions';
import userService from '../../services/userService';
import userValidator from '../../validators/userValidator';

import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'

class LoginPageBase extends Component {

    constructor(props) {
        super(props);
        this.state = {formData: {}}

        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
    }

    handleOnChange(e) {
        const name = e.target.name;
        const value = e.target.value;
        let formData = this.state.formData;
        formData[name] = value;
        this.setState(formData);
    }

    handleOnSubmit(e) {
        e.preventDefault();
        const dispatch = this.props.dispatch;
        
        let error = userValidator.validateLogin(this.state.formData);
        if (error) {
            dispatch(notificationActions.error(error));
            return;
        }

        userService.login(this.state.formData)
        .then(res => {
            res = JSON.parse(res);
            if (res.error) {
                dispatch(notificationActions.error(res.error));
            } else {
                let action = userActions.login();
                action.authtoken = res.authtoken;
                action.username = res.username; 
                action.userId = res.userId;
                dispatch(action);
                dispatch(notificationActions.info(res.success));
            }
        }).catch(err => console.log(err.statusText));
    }

    render() {
        return (
            this.props.user.authtoken
            ? <Redirect to="/" />  
            : (<form method="POST">
            <h1>Login ...</h1>
            <div className="form-group">
                <label for="username">Username:</label>
                <input name="username" type="text" className="form-control" id="username" onChange={this.handleOnChange} />
            </div>
            <div className="form-group">
                <label for="password">Password:</label>
                <input name="password" type="password" className="form-control" id="password" onChange={this.handleOnChange} />
            </div>
            <button type="submit" className="btn btn-default" onClick={this.handleOnSubmit} >Submit</button>
            </form>)
        );
    }
}

function mapStateToProps(state) {
    return {user: state.user};
}
 
const LoginPage = connect(mapStateToProps)(LoginPageBase);
export default LoginPage;
