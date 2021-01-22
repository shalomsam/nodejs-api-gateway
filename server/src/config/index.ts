
export const globalConfig = {
    debug: !!process.env.DEBUG,
    jwtTtl: process.env.JWL_TTL,
    algoName: process.env.ALGO_NAME,
    apiKeyHandle: "tmAK",
    jwtTokenHandle: "tmJWT",
    cookieDomain: process.env.COOKIE_DOMAIN
};
