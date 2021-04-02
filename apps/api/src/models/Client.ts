import { Schema, Document, model } from "mongoose";
import { Client } from '@node-api-gateway/api-interfaces';

export interface ClientDoc extends Document, Client {
    _id?: string;
}

export const ClientSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    algoName: { type: String, required: true, default: 'HS256' },
    secret: { type: String, required: true, unique: true },
    apiPublicKey: { type: String, required: true, unique: true, immutable: true },
    basePath: { type: String, required: true },
    clientEndpoint: { type: String, required: true },
    dailyLimit: { type: Number, required: false, default: 0 },
    hitCount: { type: Number, required: false, default: 0 },
}, {
    timestamps: true
});

export const ClientModel = model<ClientDoc>('Clients', ClientSchema);

export default ClientModel;