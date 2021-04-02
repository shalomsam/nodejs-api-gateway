export interface Config {
    scheme: string;
    domain: string;
    port: number;
    baseUrl: string;
    appEnv: string;
    debug: boolean;
    mongoConnectionString: string;
    adminClientKey: string;
    adminClientSecret: string;
    cryptoSaltRounds: number;
}