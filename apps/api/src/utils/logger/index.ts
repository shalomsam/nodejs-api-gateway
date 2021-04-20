import { Console } from 'console';
import { globalConfig } from '@node-api-gateway/config';

const { debug } = globalConfig;

class Logger extends Console {
  debug(...args: any) {
    if (debug) {
      this.log(...args);
    }
  }
}

const logger = new Logger(process.stdout, process.stderr);

export default logger;
