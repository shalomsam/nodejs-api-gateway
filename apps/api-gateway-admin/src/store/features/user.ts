import { User, UserSuccess, ApiError } from '@node-api-gateway/api-interfaces';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ACCESS_TOKEN } from '../../constants';
import { responseHelper } from '../../helpers';
import { userService } from '../../services/user.services';
import { RootState } from '../store';

export interface AuthState {
  status: AuthStatus;
  identity?: User;
  error?: ApiError;
}

export enum AuthStatus {
  initial = 'initial',
  loading = 'pending',
  loggedIn = 'loggedIn',
  loggedOut = 'loggedOut',
  authFailed = 'authFailed',
  registerFailed = 'registerFailed',
}

export const signup = createAsyncThunk(
  'user/signup',
  async (user: Partial<User>, thunkAPI) => {
    return await responseHelper(async () => {
      const res = await userService.register(user);
      // localStorage.setItem(ACCESS_TOKEN, res.accessToken);
      return res;
    }, thunkAPI);
  }
);

export const login = createAsyncThunk(
  'user/login',
  async (
    {
      email,
      password,
      rememberMe = false,
    }: Pick<User, 'email' | 'password'> & { rememberMe?: boolean },
    thunkAPI
  ) => {
    return await responseHelper(async () => {
      const res = await userService.login(email, password);
      if (rememberMe) {
        localStorage.setItem(ACCESS_TOKEN, res.accessToken);
      } else {
        sessionStorage.setItem(ACCESS_TOKEN, res.accessToken);
      }

      return res;
    }, thunkAPI);
  }
);

export const checkAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, thunkAPI) => {
    return await responseHelper(async () => {
      const res = await userService.getUser();
      return res;
    }, thunkAPI, {
      loading: 'Authenicating...',
      error: 'Auth Failed.'
    });
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    status: AuthStatus.initial,
    identity: undefined,
    error: undefined,
  } as AuthState,
  reducers: {},
  extraReducers: {
    [`${signup.fulfilled}`]: (
      state,
      { payload }: PayloadAction<UserSuccess>
    ) => {
      state.identity = payload.user;
      state.status = AuthStatus.loggedIn;
    },
    [`${signup.pending}`]: (state) => {
      state.status = AuthStatus.loading;
    },
    [`${signup.rejected}`]: (state, { payload }: PayloadAction<ApiError>) => {
      state.status = AuthStatus.registerFailed;
      state.error = payload;
    },
    [`${login.fulfilled}`]: (
      state,
      { payload }: PayloadAction<UserSuccess>
    ) => {
      state.identity = payload.user;
      state.status = AuthStatus.loggedIn;
    },
    [`${login.pending}`]: (state) => {
      state.status = AuthStatus.loading;
    },
    [`${login.rejected}`]: (state, { payload }: PayloadAction<ApiError>) => {
      state.status = AuthStatus.authFailed;
      state.error = payload;
    },
    [`${checkAuth.pending}`]: (state) => {
      state.status = AuthStatus.loading;
    },
    [`${checkAuth.fulfilled}`]: (
      state,
      { payload }: PayloadAction<UserSuccess>
    ) => {
      state.identity = payload.user;
      state.status = AuthStatus.loggedIn;
    },
    [`${checkAuth.rejected}`]: (state, { payload }: PayloadAction<ApiError>) => {
      state.status = AuthStatus.authFailed;
      state.error = payload;
    },
  },
});

export const authReducer = authSlice.reducer;
export const selectAuth = (state: RootState) => state.auth;

export default authReducer;
