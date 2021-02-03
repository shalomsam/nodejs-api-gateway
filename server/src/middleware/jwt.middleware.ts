import express from 'express';
import { getToken } from "../utils/helpers";
import jwt, { IClaims } from "../utils/jwt/jwt";
import { ApiResponse } from "../utils/http";
import { globalConfig } from "../config";
import UserModel, { User, UserDoc } from '../models/User';

const { clientKeys } = globalConfig;

export interface JwtPayload extends IClaims {
    email: string;
    password: string;
    issuerid: string;
    clientApiKey: string;
};
export interface JwtLocals {
    token: string;
    jwtPayload: JwtPayload;
    user: Partial<UserDoc>;
}

const jwtMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = getToken(req);

    if (!token) {
        return res.status(ApiResponse.UNAUTH.statusCode).json(ApiResponse.UNAUTH);
    }

    const payload = jwt.getClaimsUnsafe(token);
    let userId = payload?.userId;
    let user: UserDoc;

    console.log('original pyload >', payload);

    // short UUID key
    const { clientApiKey } = payload;
    const clientSecret = clientKeys?.[clientApiKey];

    if (userId) {
        user = await UserModel.findOne({ _id: userId });
    }

    if (!clientApiKey && !clientSecret && jwt.verify(token, clientSecret)) {
        return res.status(ApiResponse.UNAUTH.statusCode).json(ApiResponse.UNAUTH);
    }

    res.locals as JwtLocals;
    res.locals.token = token;
    res.locals.jwtPayload = payload;
    res.locals.user = user;

    next();
}

export default jwtMiddleware;