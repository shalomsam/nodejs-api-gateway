import NodeJwt from './node-jwt';
import * as crypto from 'crypto';

describe('jwt', () => {
    let jwtToken: string;
    const secret: string = crypto.randomBytes(32).toString('base64');
    it('Should Generate a JWT token', () => {
        jwtToken = NodeJwt.create('HS256', { userId: 1111 }, secret);
        expect(typeof jwtToken).toBe('string');
        expect(jwtToken.split('.')).toHaveLength(3);
    });

    it('Generated Token should contain expired and issueAt claims by default.', () => {
        const claims = NodeJwt.getClaimsUnsafe(jwtToken);
        expect(claims).toHaveProperty('exp');
        expect(claims).toHaveProperty('iat');
    })

    it('Should be able to verify given token', () => {
        const isVerified = NodeJwt.verify(jwtToken, secret);
        expect(isVerified).toBeTruthy();
    });

    it('Should throw an error for expired token.', (done) => {
        setTimeout( () => {
            try {
                NodeJwt.verify(jwtToken);
            } catch (e) {
                expect(e.message).toMatch(/Token Expired:/);
            }
            done();
        }, 1500);
    });

    it('Should throw and error for token used before specified time.', (done) => {
        const token = NodeJwt.create('HS256', { name: "test", nbf: 100 }, secret);
        try {
            NodeJwt.verify(token, secret);
        } catch (e) {
            expect(e.message).toMatch(/Token is used before valid time:/);
        }
        done();
    });
});