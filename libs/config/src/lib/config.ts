import type { Config as IConfig, Setting } from "@node-api-gateway/api-interfaces";

export type ConfigObject = IConfig & Setting;

const scheme = process.env?.SCHEME || 'http';
const domain = process.env?.DOMAIN || '127.0.0.1';
const port = parseInt(process.env?.PORT || "3001");
const baseUrl = (process.env?.URL || `${scheme}://${domain}:${port}`).trim();

export const baseConfig: ConfigObject = {
  port,
  domain,
  scheme,
  baseUrl,
  appEnv: process.env?.NODE_ENV || 'development',
  debug: !!process.env?.DEBUG,
  mongoConnectionString:
    process.env?.MONGO_CONNECTION_STRING ||
    'mongodb://127.0.0.1:27017/tokenmanager',
  jwtTtl: parseInt(process.env?.JWL_TTL) || 10 * 60 * 1000, //10 mins in milliseconds
  algoName: process.env?.ALGO_NAME || 'HS256',
  apiKeyHandle: process.env.NX_REACT_APP_API_KEY_HANDLE || 'X-API-key',
  jwtTokenHandle: process.env.NX_REACT_APP_ACCESS_TOKEN_HANDLE || 'ACCESS_TOKEN',
  cookieDomain: process.env?.COOKIE_DOMAIN || '',
  adminClientKey: process.env?.ADMIN_CLIENT_API_KEY || '',
  adminClientSecret: process.env?.ADMIN_CLIENT_API_SECRET || '',
  cryptoSaltRounds: parseInt(process.env?.CRYPTO_SALT_ROUNDS || '10'),
  passwordMinLength: parseInt(process.env?.PASSWORD_MIN_LENTH || '6'),
  passwordMaxLength: parseInt(process.env?.PASSWORD_MAX_LENTH || '16'),
  cacheTtl: parseInt(process.env?.CACHE_TTL || '0'),
};

export class Config {
    private config: ConfigObject = baseConfig;
    static instance: Config;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {}

    public static getInstance() {
        if (!Config.instance) {
            Config.instance = new Config();
        }

        return Config.instance;
    }

    public get(key?: keyof ConfigObject): ConfigObject | any {
        return this.config?.[key] || this.config;
    }

    public put(key: keyof ConfigObject, val: any): boolean | ConfigObject {
        if (!key || !val) {
            return false;
        }
        this.config = {
            ...this.config,
            [key]: val
        };

        return this.config;
    }

    public update(val: Record<keyof ConfigObject | string, unknown>) {
        return this.config = {
            ...this.config,
            ...val
        };
    }
}

export const config = Config.getInstance();
export const globalConfig: ConfigObject = config.get();
export default globalConfig;
