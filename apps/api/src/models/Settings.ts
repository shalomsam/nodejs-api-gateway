
enum ItokenLocation {
    headers = "headers",
    cookies = "cookies",
}

export interface Settings {
    // Whether API responses should be cached by default
    shouldCache: boolean;
    // The string to identify the API key
    apiKeyHandle: string;
    // The string to identify the JWT token
    jwtTokenHandle: string;
    // Method to transmit token
    tokenLocation: ItokenLocation;
    // The domain to bind the cookies to
    cookieDomain: string;
    // The cyrpto hash strength
    cryptoSaltRounds: number;
    // Min characters required for a valid password
    passwordMinLength: number,
    // Max characters required for a valid password
    passwordMaxLength: number,
    // How long to cache API responses. A value of 0 would mean the responses aren't cached.
    cacheTtl: number,
}

