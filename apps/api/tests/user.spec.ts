import App from '../src/app';
import * as supertest from 'supertest';
import { beforeAllHelper, afterAllHelper } from './testUtil';
import UserModel, { UserDoc } from '../src/models/User';
import { ApiResponse, Roles, User } from '@node-api-gateway/api-interfaces';
import { NodeJwt } from '@node-api-gateway/node-jwt';

// Extend the default timeout so MongoDB binaries can download when first run
jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

let mockAdminUserModel: UserDoc;
let mockUserModel: UserDoc;
let token: string;
let adminClientKey: string;
let adminClientSecret: string;

const mockAdmin = {
  firstName: 'firstnameAdmin',
  lastName: 'lastnameAdmin',
  email: 'admin@test.com',
  password: 'testAdmin',
  role: Roles.Admin,
};

const mockUser = {
  firstName: 'firstname',
  lastName: 'lastname',
  email: 'test@test.com',
  password: 'test',
  role: Roles.User,
};

const algoName = 'HS256';

beforeAll(async () => {
  await beforeAllHelper();

  mockAdminUserModel = await UserModel.create(mockAdmin);

  mockUserModel = await UserModel.create(mockUser);

  adminClientKey = process.env.ADMIN_CLIENT_API_KEY;
  adminClientSecret = process.env.ADMIN_CLIENT_API_SECRET;

  token = NodeJwt.create(algoName, { adminClientKey }, adminClientSecret);
});

afterAll((done) => afterAllHelper(done));

// afterEach((done) => cleanUp(done));

describe('User', () => {
  describe('POST /user/authenticate', () => {
    it('Valid email password should return accessToken and User Object', async () => {
      const { firstName, lastName, email, id } = mockAdminUserModel;
      await supertest(App)
        .post('/api/v1/user/authenticate')
        .set('Authorization', 'bearer ' + token)
        .send({
          email: mockAdmin.email,
          password: mockAdmin.password,
        })
        .expect(200)
        .then(async (response) => {
          expect(response.body.accessToken).toBeTruthy();
          expect(response.body.user._id).toBe(id);
          expect(response.body.user.firstName).toBe(firstName);
          expect(response.body.user.lastName).toBe(lastName);
          expect(response.body.user.email).toBe(email);
        });
    });

    it('Invalid password (or email) should return an UnAuth response', async () => {
      await supertest(App)
        .post('/api/v1/user/authenticate')
        .set('Authorization', 'bearer ' + token)
        .send({
          email: 'test@test.com',
          password: 'invalidPassword',
        })
        .expect(401)
        .then(async (response) => {
          expect(response.body).toStrictEqual(ApiResponse.UNAUTH);
        });
    });

    it('Should fail when no token is provided', async () => {
      await supertest(App)
        .post('/api/v1/user/authenticate')
        .send({
          email: mockAdmin.email,
          password: mockAdmin.password,
        })
        .expect(400)
        .then(async (response) => {
          expect(response.body).toStrictEqual(ApiResponse.BAD);
        });
    });
  });

  describe('GET /user', () => {
    it('Should get current user from token', async () => {
      const userToken = NodeJwt.create(
        algoName,
        {
          userId: mockAdminUserModel.id,
          adminClientKey,
        },
        adminClientSecret
      );

      const { firstName, lastName, email, id } = mockAdminUserModel;

      await supertest(App)
        .get('/api/v1/user')
        .set('Authorization', 'bearer ' + userToken)
        .send()
        .expect(200)
        .then(async (response) => {
          expect(response.body.user._id).toBe(id);
          expect(response.body.user.firstName).toBe(firstName);
          expect(response.body.user.lastName).toBe(lastName);
          expect(response.body.user.email).toBe(email);
        });
    });

    it('Should fail with an UnAuth response for an invalid token (no valid userId)', async () => {
      const invalidToken = NodeJwt.create(
        algoName,
        {
          adminClientKey,
        },
        adminClientSecret
      );

      await supertest(App)
        .get('/api/v1/user')
        .set('Authorization', 'bearer ' + invalidToken)
        .send()
        .expect(401)
        .then(async (response) => {
          expect(response.body).toStrictEqual(ApiResponse.UNAUTH);
        });
    });
  });

  describe('POST /user', () => {
    it('Should allow adding new user when requesting Role is Admin', async () => {
      const userToken = NodeJwt.create(
        algoName,
        {
          userId: mockAdminUserModel.id,
          adminClientKey,
        },
        adminClientSecret
      );

      const mockUserInput: Partial<User> = {
        firstName: 'testFname',
        lastName: 'testLname',
        email: 'testuser@test.com',
        password: 'somePass',
      };

      await supertest(App)
        .post('/api/v1/user')
        .set('Authorization', 'bearer ' + userToken)
        .send(mockUserInput)
        .expect(200)
        .then(async (response) => {
          expect(response.body.user._id).toBeTruthy();
          expect(response.body.user.firstName).toEqual(mockUserInput.firstName);
          expect(response.body.user.lastName).toEqual(mockUserInput.lastName);
          expect(response.body.user.email).toEqual(mockUserInput.email);
          expect(response.body.user.role).toEqual(Roles.User);
        });
    });

    it('Should fail when adding new user and the requesting user is not an Admin', async () => {
      const userToken = NodeJwt.create(
        algoName,
        {
          userId: mockUserModel.id,
          adminClientKey,
        },
        adminClientSecret
      );

      const mockUserInput: Partial<User> = {
        firstName: 'testFname',
        lastName: 'testLname',
        email: 'testuser2@test.com',
        password: 'somePass',
      };

      await supertest(App)
        .post('/api/v1/user')
        .set('Authorization', 'bearer ' + userToken)
        .send(mockUserInput)
        .expect(401)
        .then(async (response) => {
          expect(response.body).toStrictEqual({
            ...ApiResponse.UNAUTH,
            message: 'New users additions can only be requested from an Admin.',
          });
        });
    });

    it('should fail when user email already exists', async () => {
      const userToken = NodeJwt.create(
        algoName,
        {
          userId: mockAdminUserModel.id,
          adminClientKey,
        },
        adminClientSecret
      );

      await supertest(App)
        .post('/api/v1/user')
        .set('Authorization', 'bearer ' + userToken)
        .send(mockUser)
        .expect(401)
        .then(async (response) => {
          expect(response.body).toStrictEqual({
            ...ApiResponse.UNAUTH,
            message: 'User already exists.',
          });
        });
    });
  });

  describe('PUT /user', () => {
    it('Should update user with same user token', async () => {
      const userToken = NodeJwt.create(
        algoName,
        {
          userId: mockUserModel.id,
          adminClientKey,
        },
        adminClientSecret
      );

      const updateUser: Partial<User> = {
        firstName: 'firstNameEdit',
      };

      await supertest(App)
        .put('/api/v1/user/' + mockUserModel.id)
        .set('Authorization', 'bearer ' + userToken)
        .send(updateUser)
        .expect(200)
        .then(async (response) => {
          expect(response.body.user.firstName).toEqual(updateUser.firstName);
        });
    });

    it('Should fail when user id in token does not match user id', async () => {
      const userToken = NodeJwt.create(
        algoName,
        {
          userId: mockAdminUserModel.id,
          adminClientKey,
        },
        adminClientSecret
      );

      const updateUser: Partial<User> = {
        firstName: 'firstNameEdit2',
      };

      await supertest(App)
        .put('/api/v1/user/' + mockUserModel.id)
        .set('Authorization', 'bearer ' + userToken)
        .send(updateUser)
        .expect(401)
        .then(async (response) => {
          expect(response.body).toStrictEqual(ApiResponse.UNAUTH);
        });
    });

    it('Should pass if userId in JWT does not match provided id, but resetToken matches and is valid', async () => {
      const adminUserToken = NodeJwt.create(
        algoName,
        {
          userId: mockAdminUserModel.id,
          adminClientKey,
        },
        adminClientSecret
      );

      const udpatableMockUser: Partial<User> = {
        firstName: 'firstname',
        lastName: 'lastname',
        email: 'udpatableMockUser@test.com',
        password: 'test',
        role: Roles.User,
        resetToken: 'resettoken',
        resetTokenExpires: new Date().getTime() + 5 * 60 * 100,
      };

      const updateUser: Partial<User> = {
        lastName: 'lastNameEdit',
        password: 'newPassword',
        resetToken: 'resettoken',
      };

      const udpatableMockUserModel = await UserModel.create(udpatableMockUser);

      await supertest(App)
        .put('/api/v1/user/' + udpatableMockUserModel.id)
        .set('Authorization', 'bearer ' + adminUserToken)
        .send(updateUser)
        .expect(200)
        .then(async (response) => {
          expect(response.body.user).toBeTruthy();
        });
    });

    xit('Should fail if reset token is expired', () => {
      // TODO: write test
    });

    xit('Should not allow password update when no reset-token is provided', () => {
      // TODO: write test
    });

    xit('Should update password as a hashed token', () => {
      // TODO: write test
    });
  });
});
