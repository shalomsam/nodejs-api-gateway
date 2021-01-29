import React from 'react';
import express from 'express';
import { renderToString } from "react-dom/server";
import { globalConfig } from "../config";
import jwt from '../utils/jwt/jwt';
import WrappedApp from '../client/App/WrappedApp'
import { ApiResponse } from '../utils/http';
import { StaticRouter } from 'react-router';
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
    const token = jwt.create(algoName as any, { clientApiKey }, clientKeys[clientApiKey]);
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

    return res.status(ApiResponse.OK.statusCode)
        .cookie(jwtTokenHandle, token)
        .send(html);
}
