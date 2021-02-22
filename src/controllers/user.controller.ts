import express from "express";
import { globalConfig } from "../config";
import { ApiResponse } from "../utils/http";
import jwt from '../utils/jwt/jwt';
import UserModel, { User, UserDoc } from "../models/User";
import { JwtLocals } from "../middleware/jwt.middleware";
import Roles from "../models/Roles";
import crypto from "crypto";
import short from "short-uuid";

const {
    algoName,
    clientKeys,
    clientApiKey,
    jwtTtl,
    jwtTokenHandle,
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
export const authenticate = async (req: express.Request, res: express.Response): Promise<express.Response> => {
    const { password, email } = req.body as Pick<User, "email" | "password">;
    const { jwtPayload } = (res.locals as JwtLocals);
    const user: UserDoc = await UserModel.findOne({ email });

    let isValid = user?.comparePassword(password);
    isValid = isValid && jwtPayload.clientApiKey === clientApiKey;

    if (isValid) {
        const { password, ..._user } = user.toJSON();
        const jwtPayload = { userId: user._id, clientApiKey };
        const token = jwt.create(algoName as any, jwtPayload, clientKeys[clientApiKey]);

        return res.status(ApiResponse.OK.statusCode)
            .cookie(jwtTokenHandle, token)
            .json({
                ...ApiResponse.OK,
                accessToken: token,
                user: _user
            });
    }

    let responseJson = ApiResponse.UNAUTH;

    if (!user) {
        responseJson = {
            ...responseJson,
            message: "User does not exist"
        }
    }
    
    return res.status(ApiResponse.UNAUTH.statusCode).json(responseJson);
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
export const addNewUser = async (req: express.Request, res: express.Response): Promise<express.Response> => {
    const newUser = req.body as Pick<User, "email" | "firstName" | "password" | "lastName" | "role">;
    const { user, jwtPayload } = (res.locals as JwtLocals);
    newUser.role = newUser?.role || Roles.User;

    const newUserObj = await UserModel.findOne({ email: newUser.email });
    const adminUsers = await UserModel.findOne({ role: Roles.Admin });

    
    let isValid = true;
    let errMessage = ApiResponse.UNAUTH.message;

    // Requesting user must be an Admin
    if (user?.role === Roles.Admin) 
        isValid = false;
        errMessage = "New users additions can only be requested from an Admin.";
        
    if (jwtPayload.clientApiKey === clientApiKey) // must have a valid clientApi
        isValid = false;
        errMessage = "Invalid or missing client API Key.";
        
    if (!newUserObj)    // New User must not already exist
        isValid = false;
        errMessage = "User already exists.";

    // If no admin user exists. Assume first user registration.
    if (!adminUsers) {
        newUser.role = Roles.Admin;
        isValid = jwtPayload.clientApiKey === clientApiKey;
    }

    if (isValid) {
        let _newUser = new UserModel(newUser);
        _newUser = await _newUser.save();
        const { password, ...rest } = _newUser.toJSON();

        return res.status(ApiResponse.OK.statusCode).json({
            ...ApiResponse.OK,
            user: rest
        });
    }

    return res.status(ApiResponse.UNAUTH.statusCode).json({
        ...ApiResponse.UNAUTH,
        message: errMessage,
    });
}

/**
 * Controller method to update user.
 * The request must have a valid token with a valid UserId & ClientApiKey.
 * 
 * @route PUT /api/v1/user/:id
 * @group Users
 * @param {express.Request} req Express Request
 * @param {express.Response} res Express Response
 * @requires jwtMiddleware Token must contain a valid ClientApiKey.
 * @returns {object} 200 - Returns a success object with updated User.
 * @returns {object} 401 - Returns a UnAuthorized response statusCode on Error.
 */
export const updateUser = async (req: express.Request, res: express.Response): Promise<express.Response> => {
    let updateObj = req.body as Pick<User, "firstName" | "password" | "lastName"> & { resetToken?: string };
    const { user, jwtPayload } = (res.locals as JwtLocals);

    // TODO: Determine if the below check is needed.
    // if (isValidObjectId(req.params.id)) throw new Error('Invalid ObjectId');

    const validUser = await UserModel.findById(req.params.id);

    // Check if password is updated, it can only be update by the same user else with supported resetToken
    const isValidUpdate = updateObj?.password && (user._id === req.params.id);
    const hasValidResetToken = validUser?.resetToken === updateObj?.resetToken && !((new Date()) > new Date(validUser?.resetTokenExpires));
    const isValidClient = jwtPayload?.clientApiKey === clientApiKey;

    const isValid = (isValidUpdate && isValidClient) || (!isValidUpdate && hasValidResetToken && isValidClient);

    if (isValid) {
        if (hasValidResetToken) {
            updateObj.resetToken = undefined;
            (updateObj as any).resetTokenExpires = undefined;
        }
        let updatedUser = await validUser.update(updateObj).exec() as User;
        const { password, ...rest } = updatedUser
        return res.status(ApiResponse.OK.statusCode).json({
            ...ApiResponse.OK,
            user: rest
        });
    }

    return res.status(ApiResponse.UNAUTH.statusCode).json(ApiResponse.UNAUTH);
}

/**
 * Controller method to reset user password.
 * The request must have a valid token with a valid UserId & ClientApiKey.
 * 
 * @route POST /api/v1/user/resetpassword
 * @group Users
 * @param {express.Request} req Express Request
 * @param {express.Response} res Express Response
 * @requires jwtMiddleware Token must contain a valid ClientApiKey.
 * @returns {object} 200 - Returns a success object with updated User.
 * @returns {object} 401 - Returns a UnAuthorized response statusCode on Error.
 */
export const resetPassword = async (req: express.Request, res: express.Response): Promise<express.Response> => {
    let { email } = req.body as Pick<User, "email">;
    const { user, jwtPayload } = (res.locals as JwtLocals);

    const userFromEmail = await UserModel.findOne({ email });

    // Check if req has valid ClientApiKey + requesting user (jwt) email should match given email or requesting user must be an Admin
    const isValid = jwtPayload?.clientApiKey === clientApiKey && userFromEmail && (user.email === email || user.role === Roles.Admin);

    if (isValid) {
        const token = crypto.randomBytes(50).toString('hex');
        const tokenExp = (new Date()).getTime() + jwtTtl;

        userFromEmail.resetToken = token;
        userFromEmail.resetTokenExpires = tokenExp;

        await userFromEmail.save();

        return res.status(ApiResponse.UNAUTH.statusCode).json({
            ...ApiResponse.OK,
            resetToken: token,
            expires: tokenExp,
        });
    }

    return res.status(ApiResponse.UNAUTH.statusCode).json(ApiResponse.UNAUTH);
}
