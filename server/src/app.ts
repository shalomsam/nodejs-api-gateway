import express from "express";
import bodyParser from "body-parser";
import mongoose, { Schema, Document } from "mongoose";
import short from 'short-uuid';

const PORT = process.env.PORT || 3001;
const DOMAIN = process.env.DOMAIN || '127.0.0.1'
const BASE_URL = process.env.URL || `http://${DOMAIN}:${PORT}`;
const defaultRedireUrl = `${BASE_URL}/r`;
const urlShortnerBaseUrl = process.env.BASE_URL && `${process.env.BASE_URL}/r` || defaultRedireUrl;

const mongoUrl = process.env.MONGO_CONNECTION_STRING || 'mongodb://mongo/tokenmanager';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true } ).then(
    () => { 
        /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
        console.log(`MongoDB connected`);
    },
).catch(err => {
    console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
    // process.exit();
});

export interface RegisteredApp extends Document {
    name: String;
    secret: String;
    apiKey: String;
    redirectUrls: String[];
    createdOn: Date;
    startDate: Date;
    endDate: Date;
}

const RegisteredAppSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    secret: { type: String, required: true, unique: true },
    apiKey: { type: String, required: true, unique: true },
    redirectUrls: { type: Array, required: true, unique: true },
    createdOn: { type: Date, required: true },
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
});

const RegisteredAppModel = mongoose.model<RegisteredApp>('ShortUrl', RegisteredAppSchema);

const app = express();

app.set("domain", DOMAIN);
app.set("port", PORT);
app.set("baseUrl", BASE_URL);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ===============
// Token

const apiKeyHandle = "tmApiKey";
const notFoundJson = {
    status: 'error',
    statusCode: 400,
    message: 'Not Found'
};

interface tokenPayload {
    name?: string;
    userId?: string;
    csrfToken?: string;
    iss?: string,
    sub?: string,
    jti?: string,
    iat?: number,
    exp?: number
}

const getApiKey = (req: express.Request) => {
    if (req?.query[apiKeyHandle]) {
        return req.query[apiKeyHandle];
    } else if (req?.header[`x-${apiKeyHandle}`]) {
        return req.header[`x-${apiKeyHandle}`];
    } else if (req?.cookies[apiKeyHandle]) {
        return req.cookies[apiKeyHandle];
    }

    return null;
}

/**
 * Get JWT Token
 * ==============
 * @param {tokenPayload} payload - payload as body.
 * @param {string} apiKey - api key
 */
app.post('/api/token', async (req: express.Request, res: express.Response) => {
    const apiKey = getApiKey(req);
    if (!apiKey) {
        return res.status(notFoundJson.statusCode).json(notFoundJson);
    }

    const registeredApp = await RegisteredAppModel.findOne({ apiKey });
    if (!registeredApp) {
        return res.status(notFoundJson.statusCode).json(notFoundJson);
    }

    const s = registeredApp.secret;

    const payload = req.body as tokenPayload;
    const header = { "alg": "custom", "typ": "JWT" };
    const signature = ""
});

/**
 * Validate JWT token
 */
app.post('/api/token/validate', async (req: express.Request, res: express.Response) => {
    
});

export default app;
