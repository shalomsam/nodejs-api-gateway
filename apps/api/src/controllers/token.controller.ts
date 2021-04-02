import { Request, Response } from "express";
import { NodeJwt } from "@node-api-gateway/node-jwt";
import { ApiResponse } from "@node-api-gateway/api-interfaces";
import { globalConfig } from "@node-api-gateway/config";
import ClientModel from "../models/Client";
import { getApiKey, getToken } from "../utils/helpers";

const { apiKeyHandle, jwtTokenHandle, cookieDomain } = globalConfig;

/**
 * Controller Method to generate JWT Token
 * 
 * @route POST /api/token
 * @group Token
 * @param {express.Request} req Express Request
 * @param {express.Response} res Express Response
 * @returns {object} 200 - Returns a success object and JWT as Cookie.
 * @returns {object} 400 - Returns a Bad Request response statusCode on Error.
 */
export const genToken = async (req: Request, res: Response): Promise<Response> => {
    const payload = req.body;
    const apiPublicKey = getApiKey(req);

    if (!apiPublicKey) {
        return res.status(ApiResponse.BAD.statusCode).json(ApiResponse.BAD);
    }

    const client = await ClientModel.findOne({ apiPublicKey });
    if (!client) {
        return res.status(ApiResponse.BAD.statusCode).json(ApiResponse.BAD);
    }

    const secret = client.secret;
    const algoName = client.algoName;

    const jwtToken = NodeJwt.create((algoName as any), payload, secret);

    let domain = cookieDomain;
    if (!domain) {
        const d = req.hostname.split('.');
        d.shift();
        domain = d.join('.');
    }

    return res.status(ApiResponse.OK.statusCode)
        .cookie(jwtTokenHandle, jwtToken, {
            domain: domain,
            signed: true,
            httpOnly: true,
            secure: true,
        })
        .json(ApiResponse.OK);
}


/**
 * Controller Method to generate JWT Token
 * 
 * @route POST /token/validate
 * @group Token
 * @param {express.Request} req Express Request
 * @param {express.Response} res Express Response
 * @returns {object} 200 - Returns a success object.
 * @returns {object} 400 - Returns a Bad Request response statusCode on Error or Invalid Public Api Key.
 * @returns {object} 401 - Returns a UnAuthorized response statusCode on Invalid Signature.
 */
export const verifyToken = async (req: Request, res: Response): Promise<Response> => {
    const token = getToken(req);

    if (!token) {
        return res.status(ApiResponse.BAD.statusCode).json(ApiResponse.BAD);
    }

    const apiPublicKey = NodeJwt.getClaimsUnsafe(token)?.[apiKeyHandle];

    const client = await ClientModel.findOne({ apiPublicKey });
    if (!client) {
        return res.status(ApiResponse.BAD.statusCode).json(ApiResponse.BAD);
    }

    const secret = client.secret;

    const isVerified = NodeJwt.verify(token, secret);
    if (isVerified) {
        return res.status(ApiResponse.OK.statusCode).json(ApiResponse.OK);
    } else {
        return res.status(ApiResponse.UNAUTH.statusCode).json(ApiResponse.UNAUTH);
    }
};

