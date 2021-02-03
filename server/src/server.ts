import errorHandler from "errorhandler";
import http from "http";
import mongoose from "mongoose";
import app from "./app";
import logger from './utils/logger';
import { globalConfig } from './config';
import setup from './utils/setup';

const {
    port,
    domain,
    baseUrl,
    mongoUrl,
} = globalConfig;

const PORT = port;
const DOMAIN = domain;
const BASE_URL = baseUrl;

let server: http.Server;

logger.log('Mongo Connection String > ', mongoUrl);

app.set("domain", DOMAIN);
app.set("port", PORT);
app.set("baseUrl", BASE_URL);

setup();

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

mongoose.connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true } ).then(
    () => { 
        /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
        console.log(`MongoDB connected`);

        /**
         * Start Express server.
         */
        server = app.listen(app.get("port"), () => {
            console.log(
                " App is running at http://localhost:%d in %s mode",
                app.get("port"),
                app.get("env")
            );
            console.log(" Press CTRL-C to stop\n");
        });
    },
).catch(err => {
    console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
    // process.exit();
});

export default server;