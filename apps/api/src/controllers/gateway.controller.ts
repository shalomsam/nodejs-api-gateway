import * as express from 'express';
import axios from 'axios';
import * as md5 from 'md5';
import { Client, ApiResponse } from '@node-api-gateway/api-interfaces';
import { globalConfig } from '@node-api-gateway/config';
import ClientModel from '../models/Client';
import { getApiKey } from '../utils/helpers';

// TODO: Probably move this into a cacheing package or util.
const calleeCache = {};
const responseCache = {};

export const gatewayController = async (
  req: express.Request,
  res: express.Response
): Promise<express.Response> => {
  const method = req.method;
  const data = req.body;
  const headers = req.headers;
  const basePath = req.params?.basePath;
  const apiPath = req.params?.apiPath;

  const cacheKey = md5(`${req.method}:${req.url}:${JSON.stringify(req.body)}`);

  const cachedRes = responseCache?.[cacheKey];
  if (cachedRes) {
    return res.status(cachedRes.status).json(cachedRes.data);
  }

  const apiPublicKey = getApiKey(req);
  if (!apiPublicKey || !basePath || !apiPath) {
    return res.status(ApiResponse.BAD.statusCode).json(ApiResponse.BAD);
  }

  const caller = await ClientModel.findOne({ apiPublicKey });
  if (!caller) {
    return res.status(ApiResponse.BAD.statusCode).json(ApiResponse.BAD);
  }

  let callee: Client = calleeCache?.[basePath];

  if (!callee) {
    callee = await ClientModel.findOne({ basePath });
    calleeCache[basePath] = callee;
  }

  let url = `${callee.clientEndpoint}/${apiPath}`;
  const queryStr = req.originalUrl.split('?')[1];
  url += `?${queryStr}`;

  // TODO: + track req analytics

  const response = await axios.request({
    method: method as any,
    url,
    headers,
    data,
  });

  const contentType: string = response.headers.contentType;
  const redirectUrl: string = response?.data?.location;

  if ((contentType == 'application/json' || req.xhr) && !redirectUrl) {
    const { cacheTtl } = globalConfig;

    if (cacheTtl > 0) {
      responseCache[cacheKey] = response;
    }

    return res.status(response.status).json(response.data);
  } else {
    res.redirect(redirectUrl);
  }
};
