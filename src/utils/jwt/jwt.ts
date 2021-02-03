import crypto from 'crypto';

export const urlUnescape =(str: string): string => {
    str += new Array(5 - str.length % 4).join('=');
    return str.replace(/\-/g, '+').replace(/_/g, '/');
}

export const urlEscape =(str: string): string => {
    return str.replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
}

export const base64urlencode = (str: string): string => {
    return urlEscape(Buffer.from(str, 'utf-8').toString('base64'));
};

export const base64urldecode = (str: string): string => {
    return Buffer.from(urlUnescape(str), 'base64').toString('utf-8');
}

export interface IJwtHead {
    typ: string;
    alg: string;
}

export interface IJwtHeader extends IJwtHead {
    setAlgorithm(algo: string): void;
    setType(type: string): void;
    getAlgoType(): string;
    getCryptoAlgoName(): string;
    toJson(): object;
    toString(): string;
}

export interface IClaims {
    name?: string;
    userId?: string;
    csrfToken?: string;
    iss?: string;
    sub?: object | string;
    jti?: string;
    iat?: number;
    exp?: number;
    nbf?: number;
    [key:string]: any;
}

export interface IJwtClaims extends IClaims {
    setExpiry(ttl: number): this;
    setNotBefore(date?: Date | string): this;
    setIssuedAt(date?: Date | string): this;
    isNotBefore(): boolean;
    isExpired(): boolean;
    toString(): string;
}

export type Algorithms = keyof JwtHeader['algCryptoMap'];

export class JwtHeader implements IJwtHeader {
    public algCryptoMap = {
        HS256: 'SHA256',
        HS384: 'SHA384',
        HS512: 'SHA512',
        RS256: 'RSA-SHA256',
        RS384: 'RSA-SHA384',
        RS512: 'RSA-SHA512',
        ES256: 'RSA-SHA256',
        ES384: 'RSA-SHA384',
        ES512: 'RSA-SHA512',
    };
      
    public algTypeMap = {
        HS256: 'hmac',
        HS384: 'hmac',
        HS512: 'hmac',
        RS256: 'sign',
        RS384: 'sign',
        RS512: 'sign',
        ES256: 'sign',
        ES384: 'sign',
        ES512: 'sign'
    };

    public alg: string;
    public typ: string;

    constructor(algo?: Algorithms | IClaims | any, type?: string) {
        if (arguments.length === 1) {
            this.alg = algo?.alg || algo?.algo || process.env.ALGO || 'HS256';
            this.typ = algo?.typ || algo?.type || 'JWT';
        } else {
            algo = algo || process.env.ALGO_NAME || 'HS256';
            if (!this.algCryptoMap[algo]) {
                throw new Error('Unsupported Algorithm: ' + algo);
            }
            this.alg = algo;
            this.typ = type || 'JWT';
        }

        return this;
    }

    public setAlgorithm(algo: string): this {
        this.alg = algo;

        return this;
    }

    public setType(type: string): this {
        this.typ = type;

        return this;
    }

    public getAlgoType(): string {
        return this.algTypeMap[this.alg];
    }

    public getCryptoAlgoName(): string {
        return this.algCryptoMap[this.alg];
    }

    public toJson(): object {
        return {
            alg: this.alg,
            typ: this.typ
        };
    }

    public toString(): string {
        return JSON.stringify(this.toJson());
    }
}

export class JwtClaims implements IJwtClaims {

    public userId?: string;
    public csrfToken?: string;
    public iss?: string;
    public sub?: string;
    public jti?: string;
    public iat?: number;
    public exp?: number;
    public nbf?: number;

    constructor(claims: object) {
        for (var k in claims) {
            this[k] = claims[k];
        }
        if (!this.exp) {
            const exp = parseInt(process.env.JWL_TTL) || 10 * 60 * 1000
            this.setExpiry(exp);
        }
        if (!this.iat) {
            this.setIssuedAt();
        }
        return this;
    }

    private safeDate(date: string | Date) {
        let _date: Date;
        if (!date) {
            _date = new Date();
        } else if (date !instanceof Date) {
            _date = new Date(date);
        }
        return _date;
    }

    public setExpiry(ttl: number): this {
        this.exp = ((new Date()).getTime() + ttl) / 1000;
        return this;
    }

    public setNotBefore(date?: Date | string): this {
        this.nbf = this.safeDate(date).getTime() / 1000;
        return this;
    }

    public isNotBefore() {
        return new Date(this.nbf * 1000) >= new Date();
    }

    public isExpired() {
        return new Date(this.exp * 1000) < new Date();
    }

    public setIssuedAt(date?: Date | string): this {
        this.iat = this.safeDate(date).getTime() / 1000;
        return this;
    }

    public addClaim(key: string, value: string) {
        this[key] = value;
    }

    public toString() {
        return JSON.stringify(this);
    }
}

export default class JwtProvider {

    private header: IJwtHeader;
    private claims: IJwtClaims;
    private signature: string;
    private jwt: string;
    private secretKey: string;
    
    constructor(header?: IJwtHeader | object | string, claims?: IJwtClaims | object | string, secretKey?: string ) {
        this.secretKey = process.env.JWT_SECRET || secretKey || '';
        this.setHeader(header)
            .setClaims(claims)
            .setSignature();
    }

    public setHeader(header?: IJwtHeader | object | string): this {
        if (!header) {
            this.header = new JwtHeader();
        }
        if (typeof header === 'string') {
            let jwtHead = base64urldecode(header);
            jwtHead = JSON.parse(jwtHead);
            this.header = new JwtHeader(jwtHead);

        } else if (typeof header === 'object') {
            this.header = new JwtHeader((header as IJwtHead)?.alg, (header as IJwtHead)?.typ)
        } else if ((header as any) instanceof JwtHeader) {
            this.header = header;
        }
        return this;
    }

    public setClaims(claims?: IJwtClaims | object | string): this {
        if (!claims) {
            this.claims = new JwtClaims({});
        }
        if (typeof claims === 'string') {
            let jwtClaims: any = base64urldecode(claims);
            jwtClaims = JSON.parse(jwtClaims);
            this.claims = new JwtClaims(jwtClaims);
        } else if (typeof claims === 'object') {
            this.claims = new JwtClaims((claims as IClaims))
        } else if ((claims as any) instanceof JwtClaims) {
            this.claims = claims;
        }
        return this;
    }

    public setSignature() {
        const header = base64urlencode(this.header.toString());
        const claims = base64urlencode(this.claims.toString());
        const payload = `${header}.${claims}`;

        const cryptoHashName = this.header.getCryptoAlgoName();

        let hash: string;
        
        if (this.header.getAlgoType() === 'hmac') {
            hash = crypto.createHmac(cryptoHashName, this.secretKey)
                .update(payload).digest('base64').toString();
        } else {
            hash = crypto.createSign(cryptoHashName)
                .update(payload).sign(this.secretKey).toString('base64');
        }

        this.signature = base64urlencode(hash);
        this.jwt = `${header}.${claims}.${this.signature}`;

        return this;
    }

    public getSignature() {
        return this.signature;
    }

    public getClaims() {
        return this.claims;
    }

    public toJwtString() {
        return this.jwt;
    }

    public static create(algorithm?: Algorithms, payload?: IClaims | object, secretKey?: string) {
        const jwtProvider = new JwtProvider({alg: algorithm}, payload, secretKey);
        return jwtProvider.toJwtString();
    }

    public static verify(token: string, secretKey?: string): Error | boolean {
        const parts = token.split('.');

        if (parts.length > 3 || parts.length < 3) {
            throw new Error('Invalid Token: ' + token);
        }

        const givenSignature = parts.pop();

        const jwt = new JwtProvider(parts[0], parts[1], secretKey);

        if (jwt.claims.isNotBefore()) {
            throw new Error('Token is used before valid time: ' + token);
        }

        if (jwt.claims.isExpired()) {
            throw new Error('Token Expired: ' + token);
        }

        return givenSignature === jwt.getSignature();
    }

    public static getClaimsUnsafe(token: string): Partial<IClaims> {
        const parts = token.split('.');
        return JSON.parse(base64urldecode(parts[1]));
    }

    public static getJwtHeaderUnsafe(token: string): Partial<IJwtHead> {
        const parts = token.split('.');

        return JSON.parse(base64urldecode(parts[0]));
    }
}
