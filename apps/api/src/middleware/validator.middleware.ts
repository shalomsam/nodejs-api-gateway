import { ApiResponse } from '@node-api-gateway/api-interfaces';
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

const validatorMiddleware = (schema) => async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const body = req.body;

  try {
    await schema.validate(body);
    return next();
  } catch (e) {
    console.log('Validator Error: ', e);
    return res.status(ApiResponse.BAD.statusCode).json({
      ...ApiResponse.BAD,
      error: e
    });
  }
}

export default validatorMiddleware;