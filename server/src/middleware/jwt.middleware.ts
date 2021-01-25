import express from 'express';
import { getToken } from "../utils/helpers";
import jwt from "../utils/jwt/jwt";
import { ApiResponse } from "../utils/http";
import { globalConfig } from "../config";
import UserModel, { User } from '../models/User';

const { clientKeys, clientUserKey } = globalConfig;

const jwtMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = getToken(req);
    const payload = jwt.getClaimsUnsafe(token);
    let clientUserId = payload?.[clientUserKey];
    let clientUser: User;

    // short UUID key
    const { clientApiKey } = payload;
    const clientSecret = clientKeys?.[clientApiKey];

    if (clientUserId) {
        clientUser = await UserModel.findOne({_id: clientUserId });
    }

    if (!clientApiKey && !clientSecret && jwt.verify(token, clientSecret)) {
        return res.status(ApiResponse.UNAUTH.statusCode).json(ApiResponse.UNAUTH);
    }

    res.locals.token = token;
    res.locals.jwtPayload = payload;
    res.locals[clientUserKey] = clientUser?.toObject();

    next();
}

export default jwtMiddleware;