import mongoose, { Schema, Document } from "mongoose";
import Roles from "./Roles";

export interface User extends Document {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    resetToken: string;
    providerId: String,
    provider: String,
    role: Roles
}

export const UserSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    resetToken: { type: String, required: false },
    providerId: { type: String, required: false },
    provider: { type: String, required: false },
    role: { type: String, required: true },
    createdOn: { type: Date, required: true },
    updatedOn: { type: Date, required: false },
});

const UserModel = mongoose.model<User>('Users', UserSchema);

export default UserModel;