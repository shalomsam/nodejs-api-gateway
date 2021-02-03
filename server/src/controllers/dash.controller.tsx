import React from 'react';
import express from 'express';
import { renderToString } from "react-dom/server";
import { globalConfig } from "../config";
import jwt from '../utils/jwt/jwt';
import { ApiResponse } from '../utils/http';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { getStore } from '../client/helpers';
import { App } from '../client/App';
// import IndexFile from '../template/index.hbs';

const IndexFile = require('../template/index.hbs');

const { clientKeys, clientApiKey, algoName, jwtTokenHandle } = globalConfig;

/**
 * Controller Method to get list on Clients
 * 
 * @route POST /api/clients
 * @group Clients
 * @param {express.Request} req Express Request
 * @param {express.Response} res Express Response
 * @returns {object} 200 - Returns a success object and a list of Clients.
 * @returns {object} 401 - Returns a UnAuthorized response statusCode on Error.
 */
export const showDashboard = async (req: express.Request, res: express.Response): Promise<express.Response> => {
    const tokenExists = req.cookies[jwtTokenHandle];
    
    const context = {};
    const store = getStore();
    const initialState = JSON.stringify(store.getState());

    const reactApp = renderToString(
        <StaticRouter location={req.url} context={context}>
            <Provider store={store}>
                <App />
            </Provider>
        </StaticRouter>
    );

    const html = IndexFile({ app: reactApp, initialState });

    // NOTE: Fresh JWT Token is set on every request (to Server).
    let _res = res.status(ApiResponse.OK.statusCode)

    if (!tokenExists) {
        const token = jwt.create(algoName as any, { clientApiKey }, clientKeys[clientApiKey]);
        _res = _res.cookie(jwtTokenHandle, token);
    }
        
    return _res.send(html);
}
