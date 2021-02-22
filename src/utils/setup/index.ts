import short from 'short-uuid';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { globalConfig } from '../../config';
let { clientApiKey, clientKeys, appEnv } = globalConfig;

export default function setup() {
    if (!clientApiKey) {
        console.warn('Auto Generating Client API Key and Secret. Ideally this needs to be set via ENV variables.');

        clientApiKey = short.generate();
        const apiSecret = crypto.randomBytes(256).toString('base64');
        clientKeys = {
            [clientApiKey]: apiSecret
        }

        const envFile = path.relative(__dirname, `/.env.${appEnv}`);
        const exists = fs.existsSync(envFile);

        if (!exists) {
            console.log(`writing ${envFile}....`);
            fs.writeFileSync(
                envFile,
                `CLIENT_API_KEY="${clientApiKey}" \nCLIENT_PRIV_KEY="${apiSecret}"`
            );
        } else {
            console.log(`Appending ${envFile}....`);
            fs.appendFileSync(
                envFile,
                `CLIENT_API_KEY="${clientApiKey}" \nCLIENT_PRIV_KEY="${apiSecret}"`
            )
        }
    }
}