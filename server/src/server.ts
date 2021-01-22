import errorHandler from "errorhandler";
import mongoose from "mongoose";
import app from "./app";

const PORT = process.env.PORT || 3001;
const DOMAIN = process.env.DOMAIN || '127.0.0.1'
const BASE_URL = process.env.URL || `http://${DOMAIN}:${PORT}`;

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

app.set("domain", DOMAIN);
app.set("port", PORT);
app.set("baseUrl", BASE_URL);

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
const server = app.listen(app.get("port"), () => {
    console.log(
        "  App is running at http://localhost:%d in %s mode",
        app.get("port"),
        app.get("env")
    );
    console.log(" Press CTRL-C to stop\n");
});

export default server;