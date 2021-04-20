import { Client } from './client.interface';
import { User } from './user.interface';

export enum ResponseStatus {
  success = 'success',
  failed = 'failed',
}

export const ApiResponse = {
  OK: {
    statusCode: 200,
    status: ResponseStatus.success,
    message: 'Ok',
  },
  BAD: {
    statusCode: 400,
    status: ResponseStatus.failed,
    message: 'Bad Request',
  },
  UNAUTH: {
    statusCode: 401,
    status: ResponseStatus.failed,
    message: 'Unauthorized',
  },
  NOTFOUND: {
    statusCode: 404,
    status: ResponseStatus.failed,
    message: 'Not Found',
  },
};

export type ApiResponse = typeof ApiResponse.OK;

export type ApiSuccess<T extends Record<string, any>> = typeof ApiResponse.OK & T;
export type ApiError = typeof ApiResponse.BAD & {
  status: ResponseStatus.failed;
  client: never;
  clients: never;
  user: never;
  users: never;
  accessToken: never;
};

export type ClientSuccess = ApiSuccess<
  | {
      client: Client;
      clients: never;
    }
  | {
      client: never;
      clients: Client[];
    }
>;

export type AuthSuccess = ApiSuccess<{
  accessToken: string;
  user: Partial<User>;
}>;

export type UserSuccess = ApiSuccess<
  (
    | {
        user: Partial<User>;
        users: never;
      }
    | {
        user: never;
        users: Partial<User>[];
      }
  ) & {
    accessToken: string;
  }
>;

export type UserResetPasswordSuccess = ApiSuccess<{
  resetToken: string;
  expires: number;
}>;
