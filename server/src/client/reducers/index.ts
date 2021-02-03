import { combineReducers } from 'redux';

import { authentication } from './auth.reducer';
import { registration } from './registration.reducer';
import { users } from './users.reducer';
import { alert } from './alert.reducer';
import { clients } from './client.reducer';

const rootReducer = combineReducers({
    authentication,
    registration,
    users,
    alert,
    clients
});

export default rootReducer;