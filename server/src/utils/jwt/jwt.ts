import crypto from 'crypto';

class JwtProvider {
    private algoKey = 'ES256';
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
    
    private head = {
        alg: process.env.ALGO || this.algCryptoMap[this.algoKey],
        typ: 'JWT'
    };

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

    private getAlgoFunction(algo: string = this.head.alg): string {
        return this.algTypeMap[algo];
    }

    public sign(head: string, body: string, secret: string = process.env.secret, base64encodeSecret: boolean = true): string {
        const toSign = `${head}.${body}`;
        secret = base64encodeSecret ? this.base64urlencode(secret) : secret;

        const hash = crypto.createHmac(process.env.ALGO || 'sha256', secret);
        return hash.update(toSign).digest('base64').toString();
    }

    public jwt(payload: object, secret: string = process.env.secret, base64encodeSecret: boolean = true): string {
        const head64 = this.base64urlencode(JSON.stringify(this.head));
        const payload64 = this.base64urlencode(JSON.stringify(payload));
        let jwt = `${head64}.${payload64}`;
        jwt += `.${this.base64urlencode(this.sign(head64, payload64, secret, base64encodeSecret))}`;

        return jwt;
    }

    public verify(jwtStr: string, secret: string = process.env.secret, base64encodeSecret: boolean = true): boolean {
        const jwtArr = jwtStr.split('.');
        const givenSign = jwtArr[2];

        const sign = this.sign(jwtArr[0], jwtArr[1], secret, base64encodeSecret);

        return givenSign === sign;
    }
}

export default new JwtProvider();