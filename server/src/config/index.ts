require('dotenv').config();

let clientKeys = {};
const clientApiKey = process.env.CLIENT_API_KEY;
const clientSecret = process.env.CLIENT_PRIV_KEY;

if (clientApiKey && clientSecret) {
    clientKeys = {
        [clientApiKey]: clientSecret
    };
}

export const globalConfig = {
    debug: !!process.env.DEBUG,
    jwtTtl: process.env.JWL_TTL,
    algoName: process.env.ALGO_NAME,
    apiKeyHandle: "tmAK",
    jwtTokenHandle: "tmJWT",
    cookieDomain: process.env.COOKIE_DOMAIN,
    clientKeys,
    clientApiKey,
    cryptoSaltRounds: process.env.CRYPTO_SALT_ROUNDS || "10",
};
