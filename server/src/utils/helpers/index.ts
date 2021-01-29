import express from "express";
import { globalConfig } from "../../config";

const { apiKeyHandle, jwtTokenHandle } = globalConfig;

/**
 * Method to get Public API Key from request.
 * 
 * @param {express.Request} req Express Request.
 */
export const getApiKey = (req: express.Request) => {
    if (req?.query?.[apiKeyHandle]) {
        return req.query[apiKeyHandle];
    } else if (req?.headers?.[`x-${apiKeyHandle}`]) {
        return req.headers[`x-${apiKeyHandle}`];
    } else if (req?.cookies?.[apiKeyHandle]) {
        return req.cookies[apiKeyHandle];
    } else if (req?.body?.[apiKeyHandle]) {
        return req.body[apiKeyHandle];
    }

    return null;
}

/**
 * Method to get JWT Token from Request.
 * 
 * @param {express.Request} req Express Request.
 */
export const getToken = (req: express.Request) => {
    if (req?.query?.[jwtTokenHandle]) {
        return req.query[jwtTokenHandle];
    } else if (req?.headers?.authorization) {
        return req.headers.authorization.split(" ")[1];
    } else if (req?.cookies?.[jwtTokenHandle]) {
        return req.cookies[jwtTokenHandle];
    } else if (req?.body?.[jwtTokenHandle]) {
        return req.body[jwtTokenHandle];
    }

    return null;
}

export const isSSR: boolean = ((): boolean => {
    return typeof window === 'undefined';
})();