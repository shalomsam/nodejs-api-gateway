import { Schema, Document, model } from "mongoose";
import { compareSync, genSaltSync, hashSync } from "bcrypt";
import { Roles, voidFn } from "@node-api-gateway/api-interfaces";
import { globalConfig } from "@node-api-gateway/config";

const {
    cryptoSaltRounds
} = globalConfig;

export interface User {
    _id?: any;
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
    createdAt: Date,
    updatedAt: Date,
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
    role: { type: String, required: true }
}, {
    timestamps: true
});

UserSchema.pre<UserDoc>('save', function (this, next) {
    const user = this as UserDoc;

    if (user?.isModified('password')) {
        const salt = genSaltSync(cryptoSaltRounds);
        user.password = hashSync(user.password, salt);
    }

    return next();
});

UserSchema.methods.comparePassword = function(givenPass: string, cb?: voidFn) {
    const user = this as UserDoc;

    const isValid = compareSync(givenPass, user.password);
    if (cb) cb(isValid);
    return isValid;
}

const UserModel = model<UserDoc>('Users', UserSchema);

export default UserModel;