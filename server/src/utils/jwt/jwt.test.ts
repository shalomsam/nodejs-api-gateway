import jwt from './jwt';
import crypto from 'crypto';

describe('jwt', () => {
    let jwtToken: string;
    let secret: string = crypto.randomBytes(32).toString('base64');
    it('Should Generate a JWT token', () => {
        jwtToken = jwt.create('HS256', { userId: 1111 }, secret);
        console.log('JWT Token is ', jwtToken);
        expect(typeof jwtToken).toBe('string');
        expect(jwtToken.split('.')).toHaveLength(3);
    });

    it('Generated Token should contian expired and notBefore claims by default.')

    it('Should be able to verify given token', () => {
        const isVerified = jwt.verify(jwtToken, secret);
        expect(isVerified).toBeTruthy();
    });

    it('Should throw and error for expired token.');

    it('Should throw and error for token used before specified time.');
});