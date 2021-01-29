import React from 'react';
import { store } from '../helpers';
import { Provider } from 'react-redux';
import { App } from '.';

export const WrappedApp = () => (
    <Provider store={store}>
        <App />
    </Provider>
);

export default WrappedApp;