import { Response, Request } from "express";
import { v4 as uuid } from "uuid";
import { randomBytes } from "crypto";
import { Roles, Client, ApiResponse } from "@node-api-gateway/api-interfaces";
import ClientModel from "../models/Client";
import { JwtLocals } from "../middleware/jwt.middleware";
import logger from "../utils/logger";

/**
 * Controller Method to get list on Clients
 * 
 * @route GET /api/v1/clients
 * @group Clients
 * @param {express.Request} req Express Request
 * @param {express.Response} res Express Response
 * @returns {object} 200 - Returns a success object and a list of Clients.
 * @returns {object} 401 - Returns a UnAuthorized response statusCode on Error.
 */
export const getClient = async (req: Request, res: Response): Promise<Response> => {
    const user = (res.locals as JwtLocals).user;
    logger.debug('payload >> ', (res.locals as JwtLocals).jwtPayload);

    if (!user) {
        return res.status(ApiResponse.UNAUTH.statusCode).json(ApiResponse.UNAUTH);
    }

    const clientList = await ClientModel.find({});
    if (user.role !== Roles.Admin) {
        clientList.map((client) => {
            const obj = client.toObject();
            obj['secret'] = '***********';
            return obj;
        });
    }

    return res.status(ApiResponse.OK.statusCode).json({
        ...ApiResponse.OK,
        clients: clientList,
    });
}


/**
 * Controller Method to add new Client
 * 
 * @route POST /api/v1/client
 * @group Clients
 * @param {express.Request} req Express Request
 * @param {express.Response} res Express Response
 * @returns {object|Client} 200 - Returns a success object and a list of Clients.
 * @returns {object} 401 - Returns a UnAuthorized response statusCode on Error.
 */
export const addClient = async (req: Request, res: Response): Promise<Response> => {
    const user = (res.locals as JwtLocals).user;
    if (!user) {
        return res.status(ApiResponse.UNAUTH.statusCode).json(ApiResponse.UNAUTH);
    }
    const client = req.body as Partial<Client>;
    client.apiPublicKey = uuid();
    client.secret = randomBytes(256).toString('base64');
    const newClient = new ClientModel(client);
    const saved = await newClient.save();
    return res.status(ApiResponse.OK.statusCode).json({
        ...ApiResponse.OK,
        client: saved
    });
}
