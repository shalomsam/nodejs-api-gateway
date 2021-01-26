import express from "express";
import bcrypt from "bcrypt";
import { globalConfig } from "../config";
import { ApiResponse } from "../utils/http";
import jwt from '../utils/jwt/jwt';
import UserModel, { User } from "../models/User";
import { JwtLocals } from "../middleware/jwt.middleware";
import Roles from "../models/Roles";
import crypto from "crypto";
import { isValidObjectId } from "mongoose";

const {
  algoName,
  clientKeys,
  clientApiKey,
  jwtTtl,
  jwtTokenHandle,
  cryptoSaltRounds,
} = globalConfig;

/**
 * Controller Method to authenticate user.
 * The request must have a valid token with a ClientApiKey.
 * 
 * @route POST /api/v1/user/authenticate
 * @group Users
 * @param {express.Request} req Express Request
 * @param {express.Response} res Express Response
 * @returns {object} 200 - Returns a success object with access token.
 * @returns {object} 401 - Returns a UnAuthorized response statusCode on Error.
 */
export const authenticate = async (req: express.Request, res: express.Response): Promise<any> => {
    const { password, email } = req.body;
    const { jwtPayload } = (res.locals as JwtLocals);
    const user = await UserModel.findOne({ email });

    const isValid = user.comparePassword(password) && jwtPayload.clientApiKey === clientApiKey;

    if (isValid) {
        const token = jwt.create(algoName as any, { email: user.email, clientApiKey }, clientKeys[clientApiKey]);
        return res.status(ApiResponse.OK.statusCode)
            .cookie(jwtTokenHandle, token)
            .json({
                ...ApiResponse.OK,
                accessToken: token,
            });
    }
    
    return res.status(ApiResponse.UNAUTH.statusCode).json(ApiResponse.UNAUTH);
}

/**
 * Controller method to add a new User.
 * The request must have a valid token with an Admin UserId & ClientApiKey.
 * 
 * @route POST /api/v1/user
 * @group Users
 * @param {express.Request} req Express Request
 * @param {express.Response} res Express Response
 * @requires jwtMiddleware Token must contain valid user with admin role + valid ClientApiKey.
 * @returns {object} 200 - Returns a success object with reset token.
 * @returns {object} 401 - Returns a UnAuthorized response statusCode on Error.
 */
export const addNewUser = async (req: express.Request, res: express.Response): Promise<any> => {
    const newUser = req.params as Partial<User>;
    const { user, jwtPayload } = (res.locals as JwtLocals);

    // Requesting user must be an Admin & must have a valid clientApi
    const isValid = user?.role === Roles.Admin && jwtPayload.clientApiKey === clientApiKey && newUser.email;

    if (isValid) {
        if (!newUser.password) {
            const token = crypto.randomBytes(50).toString('hex');
            const tokenExp = (new Date()).getTime() + parseInt(jwtTtl);
            // prevent unwanted login
            newUser.password = token;
            newUser.resetToken = token;
            newUser.resetTokenExpires = tokenExp;
        }
        
        let _newUser = new UserModel(newUser);
        _newUser = await _newUser.save();
        const { password, ...rest } = _newUser.toJSON();

        return res.status(ApiResponse.OK.statusCode).json({
            ...ApiResponse.OK,
            user: rest
        });
    }

    return res.status(ApiResponse.UNAUTH.statusCode).json(ApiResponse.UNAUTH);
}

/**
 * Controller method to update user.
 * The request must have a valid token with a valid UserId & ClientApiKey.
 * 
 * @route PUT /api/v1/user/:id
 * @group Users
 * @param {express.Request} req Express Request
 * @param {express.Response} res Express Response
 * @returns {object} 200 - Returns a success object with updated User.
 * @returns {object} 401 - Returns a UnAuthorized response statusCode on Error.
 */
export const updateUser = async (req: express.Request, res: express.Response): Promise<any> => {
    let updateObj = req.body as Pick<User, "email" | "firstName" | "password" | "lastName">;
    const { user, jwtPayload } = (res.locals as JwtLocals);

    if (isValidObjectId(req.params.id)) throw new Error('Invalid ObjectId');

    const validUser = await UserModel.findById(req.params.id);
    const isValid = user?.email === validUser.email && jwtPayload.clientApiKey === clientApiKey;

    if (isValid) {
        let updatedUser = await validUser.update(updateObj).exec() as User;
        const { password, ...rest } = updatedUser
        return res.status(ApiResponse.OK.statusCode).json({
            ...ApiResponse.OK,
            user: rest
        });
    }

    return res.status(ApiResponse.UNAUTH.statusCode).json(ApiResponse.UNAUTH);
}
