import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import Roles from "./Roles";
import { globalConfig } from "../config";
import { voidFn } from "types";

const {
    cryptoSaltRounds
} = globalConfig;

export interface User {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    resetToken: string;
    resetTokenExpires: number;
    providerId: string,
    provider: string,
    role: Roles
}

export interface UserDoc extends User, Document {
    createdOn: Date,
    updatedOn: Date,
    comparePassword: (givenPass: string, cb?: voidFn) => void | boolean;
}

export const UserSchema = new Schema({
    email: { type: String, required: true, unique: true, immutable: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    resetToken: { type: String, required: false },
    resetTokenExpires: { type: Date, required: false },
    providerId: { type: String, required: false },
    provider: { type: String, required: false },
    role: { type: String, required: true },
    createdOn: { type: Date, required: true },
    updatedOn: { type: Date, required: false },
});

UserSchema.pre<UserDoc>('save', (next) => {
    const user = this as UserDoc;
    if (!user?.isModified('password')) return next();

    const salt = bcrypt.genSaltSync(cryptoSaltRounds);
    user.password = bcrypt.hashSync(user.password, salt);
});

UserSchema.methods.comparePassword = (givenPass: string, cb?: voidFn) => {
    const user = this as UserDoc;
    const isValid = bcrypt.compareSync(givenPass, user.password);
    if (cb) cb(isValid);
    return isValid;
}

const UserModel = mongoose.model<UserDoc>('Users', UserSchema);

export default UserModel;