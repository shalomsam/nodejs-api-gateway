import jwt from './jwt';
import crypto from 'crypto';

describe('jwt', () => {
    let jwtToken: string;
    let secret: string = crypto.randomBytes(32).toString('base64');
    it('Should Generate a JWT token', () => {
        jwtToken = jwt.create('HS256', { userId: 1111 }, secret);
        expect(typeof jwtToken).toBe('string');
        expect(jwtToken.split('.')).toHaveLength(3);
    });

    it('Generated Token should contain expired and issueAt claims by default.', () => {
        const claims = jwt.getClaimsUnsafe(jwtToken);
        expect(claims).toHaveProperty('exp');
        expect(claims).toHaveProperty('iat');
    })

    it('Should be able to verify given token', () => {
        const isVerified = jwt.verify(jwtToken, secret);
        expect(isVerified).toBeTruthy();
    });

    it('Should throw an error for expired token.', (done) => {
        setTimeout( () => {
            try {
                jwt.verify(jwtToken);
            } catch (e) {
                expect(e.message).toMatch(/Token Expired:/);
            }
            done();
        }, 1500);
    });

    it('Should throw and error for token used before specified time.', (done) => {
        const token = jwt.create('HS256', { name: "test", nbf: 100 }, secret);
        try {
            jwt.verify(token, secret);
        } catch (e) {
            expect(e.message).toMatch(/Token is used before valid time:/);
        }
        done();
    });
});