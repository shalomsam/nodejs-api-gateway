import jwt from './jwt';

describe('jwt', () => {
    it('Should Generate a JWT token', () => {
        const jwtToken = jwt.jwt({ userId: 1111 }, 'secretKey');
        console.log('JWT Token is ', jwtToken);
        expect(typeof jwtToken).toBe('string');
        expect(jwtToken.split('.')).toHaveLength(3);
    })
});