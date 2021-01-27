require('dotenv').config();

let clientKeys = {};
const clientApiKey = process.env.CLIENT_API_KEY;
const clientSecret = process.env.CLIENT_PRIV_KEY;

const scheme = process.env.SCHEME || 'http';
const domain = process.env.DOMAIN || '127.0.0.1';
const port = parseInt(process.env.PORT || "3001");
const baseUrl = (process.env.URL || `${scheme}://${domain}:${port}`).trim();

if (clientApiKey && clientSecret) {
    clientKeys = {
        [clientApiKey]: clientSecret
    };
}

export const globalConfig = {
    port,
    domain,
    scheme,
    baseUrl,
    mongoUrl: process.env.MONGO_CONNECTION_STRING || 'mongodb://127.0.0.1:27017/tokenmanager',
    debug: !!process.env.DEBUG,
    jwtTtl: process.env.JWL_TTL,
    algoName: process.env.ALGO_NAME,
    apiKeyHandle: "tmAK",
    jwtTokenHandle: "tmJWT",
    cookieDomain: process.env.COOKIE_DOMAIN,
    clientKeys,
    clientApiKey,
    cryptoSaltRounds: parseInt(process.env.CRYPTO_SALT_ROUNDS || "10"),
    passwordMinLength: parseInt(process.env.PASSWORD_MIN_LENTH || "6"),
    passwordMaxLength: parseInt(process.env.PASSWORD_MAX_LENTH || "16"),
};
