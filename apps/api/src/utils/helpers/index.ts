import type { Request } from 'express';
import { ApiResponse } from '@node-api-gateway/api-interfaces';
import { globalConfig } from '@node-api-gateway/config';
import logger from '../logger';

let { apiKeyHandle, jwtTokenHandle } = globalConfig;
const { adminClientKey } = globalConfig;

/**
 * Method to get Public API Key from request.
 *
 * @param {Request} req Express Request.
 */
export const getApiKey = (req: Request) => {
  apiKeyHandle = apiKeyHandle.toLocaleLowerCase();
  if (req?.query?.[apiKeyHandle]) {
    return req.query[apiKeyHandle];
  } else if (req?.headers?.[apiKeyHandle]) {
    return req.headers[apiKeyHandle];
  } else if (req?.cookies?.[apiKeyHandle]) {
    return req.cookies[apiKeyHandle];
  } else if (req?.body?.[apiKeyHandle]) {
    return req.body[apiKeyHandle];
  }

  return null;
};

/**
 * Method to get JWT Token from Request.
 *
 * @param {Request} req Express Request.
 */
export const getToken = (req: Request) => {
  jwtTokenHandle = jwtTokenHandle.toLocaleLowerCase();
  if (req?.query?.[jwtTokenHandle]) {
    return req.query[jwtTokenHandle];
  } else if (req?.headers?.authorization) {
    return req.headers.authorization.split(' ')[1];
  } else if (req?.cookies?.[jwtTokenHandle]) {
    return req.cookies[jwtTokenHandle];
  } else if (req?.body?.[jwtTokenHandle]) {
    return req.body[jwtTokenHandle];
  }

  return null;
};

export const apiNotFoundHandler = function (req, res) {
  res.status(404);

  // respond with html page
  if (req?.headers['content-type']?.indexOf('html') > -1) {
    return res.type('txt').send('Not found');
  }

  // respond with json
  if (req?.headers['content-type']?.indexOf('json') > -1) {
    return res.send(ApiResponse.NOTFOUND);
  }

  // default to plain-text. send()
  return res.type('txt').send('Not found');
};

export const isValidAdminApiKey = (apiKey: string) => {
  logger.debug('adminClientKey >> ', adminClientKey, ' >> Given >> ', apiKey);
  return adminClientKey === apiKey;
};
