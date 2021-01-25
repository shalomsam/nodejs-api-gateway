import mongoose, { Schema, Document } from "mongoose";
import { Algorithms } from "../utils/jwt/jwt";

export interface Client extends Document {
    name: string;
    algoName: Algorithms;
    secret: string;
    apiPublicKey: string;
    redirectUrl: string;
    dailyLimit: Number;
    monthlyLimit: Number;
    yearlyLimit: Number;
    createdOn: Date;
    updatedOn: Date;
}

export const ClientSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    algoName: { type: String, required: true, default: 'HS256' },
    secret: { type: String, required: true, unique: true },
    apiPublicKey: { type: String, required: true, unique: true },
    redirectUrl: { type: String, required: false },
    dailyLimit: { type: Number, required: false, default: 0 },
    monthlyLimit: { type: Number, required: false, default: 0 },
    yearlyLimit: { type: Number, required: false, default: 0 },
    createdOn: { type: Date, required: true },
    updatedOn: { type: Date, required: false },
});

const ClientModel = mongoose.model<Client>('Clients', ClientSchema);

export default ClientModel;