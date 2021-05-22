import { ApiResponse } from '@node-api-gateway/api-interfaces';
import { Request, Response, NextFunction } from 'express';
import { getApiKey, isValidAdminApiKey } from '../utils/helpers';

const apiKeyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const apiKey = getApiKey(req);

  if (!isValidAdminApiKey(apiKey)) {
    return res.status(ApiResponse.BAD.statusCode).json(ApiResponse.BAD);
  }

  next();
}

export default apiKeyMiddleware;
