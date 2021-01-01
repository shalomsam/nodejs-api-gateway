import express from "express";
import bodyParser from "body-parser";
import mongoose, { Schema, Document } from "mongoose";
import short from 'short-uuid';

const PORT = process.env.PORT || 3001;
const DOMAIN = process.env.DOMAIN || '127.0.0.1'
const BASE_URL = process.env.URL || `http://${DOMAIN}:${PORT}`;
const defaultRedireUrl = `${BASE_URL}/r`;
const urlShortnerBaseUrl = process.env.BASE_URL && `${process.env.BASE_URL}/r` || defaultRedireUrl;

const mongoUrl = process.env.MONGO_CONNECTION_STRING || 'mongodb://mongo/test2';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true } ).then(
    () => { 
        /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
        console.log(`MongoDB connected`);
    },
).catch(err => {
    console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
    // process.exit();
});

export interface IShortUrl extends Document {
    httpCode: number;
    longUrl: string;
    shortPath: string;
    createdOn: Date;
    startDate: Date;
    endDate: Date;
}

const ShortUrlSchema: Schema = new Schema({
    httpCode: { type: Number, required: false, default: 301 },
    longUrl: { type: String, required: true },
    shortPath: { type: String, required: true, unique: true },
    createdOn: { type: Date, required: true },
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
});

const ShortUrlModel = mongoose.model<IShortUrl>('ShortUrl', ShortUrlSchema);

const app = express();

app.set("domain", DOMAIN);
app.set("port", PORT);
app.set("baseUrl", BASE_URL);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Todo: add auth

app.get('/r/:shortPath', async (req: express.Request, res: express.Response) => {
    const response = await ShortUrlModel.findOne({ shortPath: req.params.shortPath });
    const redirectCode = response.httpCode;
    const redirectUrl = response.longUrl;
    // Todo: sendAnalytics(req, response)
    // Todo: checkExpired()
    return res.redirect(redirectCode, redirectUrl);
});

// Todo: configurations in DB?
app.get('/api/config', async (req: express.Request, res: express.Response) => {
    return res.json({
        baseUrl: BASE_URL,
        urlShortnerBaseUrl
    });
});

// Todo: move to controller files
app.get('/api/shorturl', async (req: express.Request, res: express.Response) => {
    let list: object;
    try {
        list = await ShortUrlModel.find();
    } catch (e) {
        list = e;
    }

    return res.json(list);
});

app.get('/api/shorturl/:id', async (req: express.Request, res: express.Response) => {
    let list: object;
    try {
        list = await ShortUrlModel.findById(req.params.id);
    } catch (e) {
        list = e;
    }
    return res.json(list);
});

app.post('/api/shorturl', async (req: express.Request, res: express.Response) => {
    let response = {};
    const id = short.generate();
    const createdOn = Date.now();
    let shortUrlData = {
        ...req.body,
        createdOn,
    };

    if (!req.body.shortPath) {
        const shortPath = id;
        shortUrlData = {
            ...shortUrlData,
            shortPath,
        };
    } else if (req.body.shortPath) {
        let shortPath = req.body.shortPath.trim('/');
        shortUrlData = {
            ...shortUrlData,
            shortPath,
        };
    }

    try {
        const shortUrl = new ShortUrlModel(shortUrlData);
        response = await shortUrl.save();
        response = {...shortUrl.toObject(), status: 'success'};
    } catch (e) {
        res.status(500);
        response = e;
    }

    return res.json(response);
});

app.put('/api/shorturl/:id', async (req: express.Request, res: express.Response) => {
    let response: any = {};
    try {
        response = await ShortUrlModel.findByIdAndUpdate(req.params.id, req.body, { upsert: true });

        if(!response && !response._id) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.id
            });
        }
    } catch (e) {
        res.status(404);
        response = e;
    }

    return res.json(response);
});

app.delete('/api/shorturl/:id', async (req: express.Request, res: express.Response) => {
    let response = {};
    try {
        response = await ShortUrlModel.findByIdAndDelete(req.params.id);
        if(!response) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.id
            });
        }
    } catch (e) {
        res.status(500);
        response = e;
    }

    return res.json(response);
});

export default app;
