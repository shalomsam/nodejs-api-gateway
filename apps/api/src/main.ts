import errorHandler from 'errorhandler';
import type { Server } from 'http';
import { connect } from 'mongoose';
import app from './app';
import logger from './utils/logger';
import { globalConfig } from '@node-api-gateway/config';

const { port, domain, baseUrl, mongoConnectionString } = globalConfig;

const PORT = port;
const DOMAIN = domain;
const BASE_URL = baseUrl;

let server: Server;

logger.log('Mongo Connection String > ', mongoConnectionString);

app.set('domain', DOMAIN);
app.set('port', PORT);
app.set('baseUrl', BASE_URL);

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

connect(mongoConnectionString, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
})
  .then(() => {
    /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
    console.log(`MongoDB connected`);

    /**
     * Start Express server.
     */
    server = app.listen(app.get('port'), () => {
      console.log(
        ' App is running at http://localhost:%d in %s mode',
        app.get('port'),
        app.get('env')
      );
      console.log(' Press CTRL-C to stop\n');
    });
  })
  .catch((err) => {
    console.log(
      `MongoDB connection error. Please make sure MongoDB is running. ${err}`
    );
    // process.exit();
  });

export default server;
