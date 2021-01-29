import short from 'short-uuid';
import crypto from 'crypto';
import fs from 'fs';
import { globalConfig, config } from '../../config';
let { clientApiKey, clientKeys, appEnv } = globalConfig;

export default function setup() {
    if (!clientApiKey) {
        console.warn('Auto Generating Client API Key and Secret. Ideally this needs to be set via ENV variables.');

        clientApiKey = short.generate();
        const apiSecret = crypto.randomBytes(256).toString('base64');
        clientKeys = {
            [clientApiKey]: apiSecret
        }

        // config.update({ clientKeys, clientApiKey });
        // console.log('config >> ', config)

        const envFile = `.env.${appEnv}`;
        const exists = fs.existsSync(envFile);

        if (exists) {
            fs.writeFileSync(
                envFile,
                `
                CLIENT_API_KEY=${clientApiKey}
                CLIENT_PRIV_KEY=${apiSecret}
                `
            )
        }
    }
}