import { Roles } from "@node-api-gateway/api-interfaces";

export interface User {
    _id?: string;
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