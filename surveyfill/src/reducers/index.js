import { combineReducers } from 'redux';

import { user } from './userReducer';
import { notification } from './notificationReducer';
import { survey } from './surveyReducer';

const rootReducer = combineReducers({
  survey,
  user,
  notification
});

export default rootReducer;