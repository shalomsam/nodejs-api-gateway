import { Request, Response, NextFunction } from "express";
import { NodeJwt, IClaims } from "@node-api-gateway/node-jwt";
import { ApiResponse } from "@node-api-gateway/api-interfaces";
import { getToken } from "../utils/helpers";
import { globalConfig } from "@node-api-gateway/config";
import UserModel, { UserDoc } from '../models/User';

const { adminClientKey: adminClientKeyOrg, adminClientSecret } = globalConfig;

// TODO: move to api-interface?
export interface JwtPayload extends IClaims {
    email: string;
    password: string;
    issuerid: string;
    adminClientKey: string;
};
export interface JwtLocals {
    token: string;
    jwtPayload: JwtPayload;
    user: Partial<UserDoc>;
}

const jwtMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // TODO: extract as util?
    const token = getToken(req);

    if (!token) {
        return res.status(ApiResponse.UNAUTH.statusCode).json(ApiResponse.UNAUTH);
    }

    const payload = NodeJwt.getClaimsUnsafe(token);
    const { userId, adminClientKey } = payload;
    let user: UserDoc;

    console.log('original payload >', payload);
    
    if (!userId && !adminClientKey && adminClientKey !== adminClientKeyOrg && NodeJwt.verify(token, adminClientSecret)) {
        return res.status(ApiResponse.UNAUTH.statusCode).json(ApiResponse.UNAUTH);
    }

    if (userId) {
        user = await UserModel.findOne({ _id: userId });
    }

    res.locals as JwtLocals;
    res.locals.token = token;
    res.locals.jwtPayload = payload;
    res.locals.user = user;

    next();
}

export default jwtMiddleware;