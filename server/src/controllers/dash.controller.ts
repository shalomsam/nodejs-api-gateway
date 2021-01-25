import express from 'express';
import { globalConfig } from "../config";
const { clientKeys } = globalConfig;

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
    return res.status(400).send();
}
