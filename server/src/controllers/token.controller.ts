import express from "express";
import jwt from "../utils/jwt/jwt";
import { globalConfig } from "../config";
import ClientModel from "../models/Client";
import { ApiResponse } from "../utils/http";

const { apiKeyHandle, jwtTokenHandle, cookieDomain } = globalConfig;

/**
 * Method to get Public API Key from request.
 * 
 * @param {express.Request} req Express Request.
 */
const getApiKey = (req: express.Request) => {
    
    if (req?.query[apiKeyHandle]) {
        return req.query[apiKeyHandle];
    } else if (req?.header[`x-${apiKeyHandle}`]) {
        return req.header[`x-${apiKeyHandle}`];
    } else if (req?.cookies[apiKeyHandle]) {
        return req.cookies[apiKeyHandle];
    } else if (req?.body[apiKeyHandle]) {
        return req.body[apiKeyHandle];
    }

    return null;
}

/**
 * Method to get JWT Token from Request.
 * 
 * @param {express.Request} req Express Request.
 */
const getToken = (req: express.Request) => {
    if (req?.query[jwtTokenHandle]) {
        return req.query[jwtTokenHandle];
    } else if (req?.headers?.authorization) {
        return req.headers.authorization.split(" ")[1];
    } else if (req?.cookies[jwtTokenHandle]) {
        return req.cookies[jwtTokenHandle];
    } else if (req?.body[jwtTokenHandle]) {
        return req.body[jwtTokenHandle];
    }

    return null;
}

/**
 * Controller Method to generate JWT Token
 * 
 * @route POST /api/token
 * @group Token - Token Controller
 * @param {express.Request} req Express Request
 * @param {express.Response} res Express Response
 * @returns {object} 200 - Returns a success object and JWT as Cookie.
 * @returns {object} 400 - Returns a UnAuthorized response statusCode on Error.
 */
export const genToken = async (req: express.Request, res: express.Response): Promise<express.Response> => {
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

    const jwtToken = jwt.create(algoName, payload, secret);

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
 * @group Token - Token Controller
 * @param {express.Request} req Express Request
 * @param {express.Response} res Express Response
 * @returns {object} 200 - Returns a success object.
 * @returns {object} 400 - Returns a UnAuthorized response statusCode on Error.
 */
export const verifyToken = async (req: express.Request, res: express.Response): Promise<express.Response> => {
    const token = getToken(req);

    if (!token) {
        return res.status(ApiResponse.BAD.statusCode).json(ApiResponse.BAD);
    }

    const apiPublicKey = jwt.getClaimsUnsafe(token)?.[apiKeyHandle];

    const client = await ClientModel.findOne({ apiPublicKey });
    if (!client) {
        return res.status(ApiResponse.BAD.statusCode).json(ApiResponse.BAD);
    }

    const secret = client.secret;

    const isVerified = jwt.verify(token, secret);
    if (isVerified) {
        return res.status(ApiResponse.OK.statusCode).json(ApiResponse.OK);
    } else {
        return res.status(ApiResponse.UNAUTH.statusCode).json(ApiResponse.UNAUTH);
    }
};

