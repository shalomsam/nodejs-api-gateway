import { ApiResponse } from '@node-api-gateway/api-interfaces';
import { Request, Response, NextFunction } from 'express';
import { getApiKey, isValidAdminApiKey } from '../utils/helpers';

const apiKeyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const apiKey = getApiKey(req);

  console.log('apiKey >', apiKey);

  if (!isValidAdminApiKey(apiKey)) {
    return res.status(ApiResponse.UNAUTH.statusCode).json(ApiResponse.UNAUTH);
  }

  next();
}

export default apiKeyMiddleware;
