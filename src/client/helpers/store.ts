import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from '../reducers';
import { AuthState, initialAuthState } from '../reducers/auth.reducer';
import { ClientState, initialState as clientInitialState } from '../reducers/client.reducer';

const loggerMiddleware = createLogger();

export interface RootState {
    authentication: AuthState;
    registration: any;
    users: any;
    alert: any;
    clients: ClientState;
}

export const defaultState: RootState = {
    authentication: initialAuthState,
    registration: {},
    users: {},
    alert: {},
    clients: clientInitialState,
}

export const store = createStore(
    rootReducer,
    applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
    )
);

export const getStore = (initialState: RootState = defaultState) => {
    return createStore(
        rootReducer,
        initialState,
        applyMiddleware(
            thunkMiddleware,
            loggerMiddleware
        )
    )
}
