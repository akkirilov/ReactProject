import React, { Component } from 'react'; 
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import userActions from '../../actions/userActions';
import notificationActions from '../../actions/notificationActions';
import userService from '../../services/userService';

import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'

class LogoutPageBase extends Component {

    componentDidMount() {
        if (this.props.reduxState.authtoken) {
            userService.logout(this.props.reduxState.authtoken)
                .then(res => {
                res = JSON.parse(res);
                if (res.error) {
                    this.props.dispatch(notificationActions.error(res.error));
                } else {
                    this.props.dispatch(userActions.logout());
                    this.props.dispatch(notificationActions.info(res.success));
                }
            }).catch(err => console.log(err.statusText));
        } else {
            this.props.dispatch(notificationActions.error("Login before logout!"));
        }
    }

    render() {
        return (
            <Redirect to="/" />
        );
    }
}

function mapStateToProps(state) {
    return {reduxState: state};
}
 
const LogoutPage = connect(mapStateToProps)(LogoutPageBase);
export default LogoutPage;
