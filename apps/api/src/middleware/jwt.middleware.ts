import { Request, Response, NextFunction } from 'express';
import { NodeJwt, IClaims } from '@node-api-gateway/node-jwt';
import { ApiResponse } from '@node-api-gateway/api-interfaces';
import { getApiKey, getToken, isValidAdminApiKey } from '../utils/helpers';
import { globalConfig } from '@node-api-gateway/config';
import UserModel, { UserDoc } from '../models/User';

const { adminClientSecret } = globalConfig;

// TODO: move to api-interface?
export interface JwtPayload extends IClaims {
  email: string;
  password: string;
  issuerid: string;
  adminClientKey: string;
}

export type JwtLocals =
  | {
      hasOneUser: true;
      token: string;
      jwtPayload: JwtPayload;
      user: Partial<UserDoc>;
    }
  | {
      hasOneUser: false;
      token: never;
      jwtPayload: never;
      user: never;
    };

const jwtMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = getToken(req);
  const apiKey = getApiKey(req);
  // const cacheKey = 'hasOneUser';

  const hasOneUser = Boolean(await UserModel.findOne());
  res.locals.hasOneUser = hasOneUser;

  if (hasOneUser && !token) {
    return res.status(ApiResponse.BAD.statusCode).json(ApiResponse.BAD);
  } else if (!hasOneUser && !apiKey) {
    return res.status(ApiResponse.BAD.statusCode).json(ApiResponse.BAD);
  }

  if (!hasOneUser && !token) {
    next();
    return;
  }

  const payload = NodeJwt.getClaimsUnsafe(token);
  const { userId, adminClientKey } = payload;
  let user: UserDoc;

  if (
    !userId &&
    isValidAdminApiKey(adminClientKey) &&
    token &&
    NodeJwt.verify(token, adminClientSecret)
  ) {
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
};

export default jwtMiddleware;
