import crypto from 'crypto';

export interface IJwtHeader {
    setAlgorithm(algo: string): void;
    setType(type: string): void;
    getAlgoType(): string;
    toJson(): object;
    toString(): string;
}

export interface Claims {
    name?: string;
    userId?: string;
    csrfToken?: string;
    iss?: string;
    sub?: object | string;
    jti?: string;
    iat?: number;
    exp?: number;
    [key:string]: any;
}

export interface IJwtClaims extends Claims {
    setExpiry(ttl: number): this;
    setNotBefore(date?: Date | string): this;
    setIssuedAt(date?: Date | string): this;
}

export class JwtHeader implements IJwtHeader {
    private algCryptoMap = {
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
      
    private algTypeMap = {
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

    constructor(algo?: string, type?: string) {
        algo = algo || process.env.ALGO || 'ES256';

        if (!this.algCryptoMap[algo]) {
            throw new Error('Unsupported Algorithm: ' + algo);
        }

        this.alg = algo;
        this.typ = type || 'JWT';

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

export class JwtClaim {

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
            this.setExpiry(parseInt(process.env.TOKEN_TTL) || 1000);
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

    public setIssuedAt(date?: Date | string): this {
        this.iat = this.safeDate(date).getTime() / 1000;
        return this;
    }
}

class JwtProvider {

    private header: IJwtHeader;
    private claim: IJwtClaims;
    private signature: string;
    
    constructor(segments?: any[]) {
        this.header = new JwtHeader(segments[0]);
        this.claim = new JwtClaim(segments[1]);
        this.signature = segments[2];
    }

    public base64urlencode(str: string): string {
        return this.urlEscape(Buffer.from(str, 'utf-8').toString('base64'));
    };

    public base64urldecode(str: string): string {
        return this.urlUnescape(Buffer.from(str, 'base64').toString('utf-8'))
    }

    private urlUnescape(str: string): string {
        str += new Array(5 - str.length % 4).join('=');
        return str.replace(/\-/g, '+').replace(/_/g, '/');
    }

    private urlEscape(str: string): string {
        return str.replace(/=/g, "")
            .replace(/\+/g, "-")
            .replace(/\//g, "_");
    }

    public sign(head: string, body: string, secret: string = process.env.secret, base64encodeSecret: boolean = true): string {
        const payload = `${head}.${body}`;
        secret = base64encodeSecret ? this.base64urlencode(secret) : secret;

        if (this.getAlgoFn() === 'hmac') {
            const hash = crypto.createHmac(this.algCryptoMap[this.algoKey], secret);
            return hash.update(payload).digest('base64').toString();
        } else {
            const hash = crypto.createSign(this.algCryptoMap[this.algoKey]);
            return hash.update(payload).sign(secret).toString('base64');
        }
    }

    public jwt(payload: object, secret: string = process.env.secret, base64encodeSecret: boolean = true): string {
        const head64 = this.base64urlencode(JSON.stringify(this.head));
        const payload64 = this.base64urlencode(JSON.stringify(payload));
        let jwt = `${head64}.${payload64}`;
        jwt += `.${this.base64urlencode(this.sign(head64, payload64, secret, base64encodeSecret))}`;

        return jwt;
    }

    public verify(jwtStr: string, secret: string = process.env.secret, base64encodeSecret: boolean = true): boolean {
        try {
            const jwtArr = jwtStr.split('.');
            const givenSign = jwtArr[2];
            const head = jwtArr[0];

            const sign = this.sign(jwtArr[0], jwtArr[1], secret, base64encodeSecret);

            return givenSign === sign;

        } catch (e) {
            console.error('Token Verification Error: ', e);
            return false;
        }
    }
}

export default new JwtProvider();