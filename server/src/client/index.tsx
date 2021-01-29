import React from 'react';
// import './index.css';
import reportWebVitals from './reportWebVitals';

import { hydrate, render } from 'react-dom';
import { isSSR } from '../utils/helpers';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { getStore } from './helpers';
import { App } from './App';

// const renderMethod = module?.hot && !isSSR ? render : hydrate;
const store = getStore();

hydrate(
    <BrowserRouter>
        <Provider store={store}>
            <App />
        </Provider>
    </BrowserRouter>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
