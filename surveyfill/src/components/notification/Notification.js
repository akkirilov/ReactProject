import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import notificationActions from '../../actions/notificationActions';

import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

class NotificationBase extends Component {

    constructor(props) {
        super(props);
        this.getInfo = this.getInfo.bind(this);
        this.getError = this.getError.bind(this);
        this.handleOnClick = this.handleOnClick.bind(this);
    }

    handleOnClick() {
        this.props.dispatch(notificationActions.clearAll());
    }

    getInfo() {
        setTimeout(()=> this.props.dispatch(notificationActions.clearAll()), 5000);
        return (<div className="alert alert-info text-center" onClick={this.handleOnClick}>
                   {this.props.notification.infoMessage}
                </div>);
    }

    getError() {
        setTimeout(()=> this.props.dispatch(notificationActions.clearAll()), 5000);
        return (<div className="alert alert-danger text-center" onClick={this.handleOnClick}>
                    {this.props.notification.errorMessage}
                </div>);
    }

    render() {
        return (
        <div>
            {this.props.notification.errorMessage ? this.getError() : ''}
            {this.props.notification.infoMessage ? this.getInfo() : ''}
        </div>
        );
    }
}
function mapStateToProps(state) {
    return {notification: state.notification};
}
 
const Notification = connect(mapStateToProps)(NotificationBase);
export default Notification;
        
