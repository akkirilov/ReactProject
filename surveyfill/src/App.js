import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Navigation from './components/common/Navigation';
import Footer from './components/common/Footer';
import RegisterPage from './components/auth/RegisterPage';
import NewSurvey from './components/suvey/NewSurvey';
import FillSurvey from './components/suvey/FillSurvey';
import EditSurvey from './components/suvey/EditSurvey';
import Notification from './components/notification/Notification';
import LoginPage from './components/auth/LoginPage';
import LogoutPage from './components/auth/LogoutPage';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css'

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null
        }
    }

    render() {
        return (
            <div className="App">
                <Navigation />
                <br />
                <div className="container">
                    <div className="row">
                        <div className="col-sm-1"></div> 
                        <div className="col-sm-10 well">
                            <div className="row center">
                                <div className="col-sm-12 center">
                                    <Notification />
                                </div>
                            </div>
                            <Switch>
                                <Route exact path="/add-new-survey" component={NewSurvey}/>
                                <Route exact path="/fill-survey/:id" component={FillSurvey}/>
                                <Route exact path="/edit-survey/:id" component={EditSurvey}/>
                                <Route exact path="/register" component={RegisterPage}/>
                                <Route exact path="/login" component={LoginPage}/>
                                <Route exact path="/logout" component={LogoutPage}/>
                            </Switch>
                        </div>
                        <div className="col-sm-1"></div>
                    </div>
                </div>
                <div className="fixed-bottom">
                <Footer />
                </div>
            </div>
        );
    }
}

export default App;
