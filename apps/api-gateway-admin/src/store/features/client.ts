import {
  Client,
  ApiError,
  ClientSuccess,
  HttpStatus,
} from '@node-api-gateway/api-interfaces';
import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  PayloadAction,
} from '@reduxjs/toolkit';
import { responseHelper } from '../../helpers';
import clientServices from '../../services/client.services';
import { RootState } from '../store';

export const getClients = createAsyncThunk(
  'clients/get',
  async (_, thunkAPI) => {
    return await responseHelper(async () => {
      return await clientServices.getAll();
    }, thunkAPI);
  }
);

export const addClient = createAsyncThunk(
  'client/add',
  async (client: Partial<Client>, thunkAPI) => {
    return await responseHelper(async () => {
      return await clientServices.add(client);
    }, thunkAPI);
  }
);

export const updateClient = createAsyncThunk(
  'client/update',
  async (client: Client, thunkAPI) => {
    const { _id, ...clientObj } = client;
    return await responseHelper(async () => {
      return await clientServices.update(_id, clientObj);
    }, thunkAPI);
  }
);

const clientsAdapter = createEntityAdapter({
  selectId: (client: Client) => client._id,
});

export const clientInitialState = clientsAdapter.getInitialState({
  error: undefined,
  status: HttpStatus.initial,
});

export type clientInitialState = typeof clientInitialState;

const clientsSlice = createSlice({
  name: 'clients',
  initialState: clientInitialState,
  reducers: {},
  extraReducers: {
    [`${getClients.pending}`]: (state) => {
      state.status = HttpStatus.loading;
    },
    [`${getClients.rejected}`]: (
      state,
      { payload }: PayloadAction<ApiError>
    ) => {
      state.status = HttpStatus.error;
      state.error = payload;
    },
    [`${getClients.fulfilled}`]: (
      state,
      { payload }: PayloadAction<ClientSuccess>
    ) => {
      state.status = HttpStatus.success;
      clientsAdapter.setAll(state, payload.clients);
    },
    [`${addClient.pending}`]: (state) => {
      state.status = HttpStatus.loading;
    },
    [`${addClient.rejected}`]: (
      state,
      { payload }: PayloadAction<ApiError>
    ) => {
      state.status = HttpStatus.error;
      state.error = payload;
    },
    [`${addClient.fulfilled}`]: (
      state,
      { payload }: PayloadAction<ClientSuccess>
    ) => {
      state.status = HttpStatus.success;
      clientsAdapter.addOne(state, payload.client);
    },
    [`${updateClient.pending}`]: (state) => {
      state.status = HttpStatus.loading;
    },
    [`${updateClient.rejected}`]: (
      state,
      { payload }: PayloadAction<ApiError>
    ) => {
      state.status = HttpStatus.error;
      state.error = payload;
    },
    [`${updateClient.fulfilled}`]: (
      state,
      { payload }: PayloadAction<ClientSuccess>
    ) => {
      const { _id, ...changes } = payload.client;
      state.status = HttpStatus.success;
      clientsAdapter.updateOne(state, { id: _id, changes });
    },
  },
});

export const clientsReducer = clientsSlice.reducer;
export const clientSelectors = clientsAdapter.getSelectors(
  (state: RootState) => state.clients
);

export default clientsReducer;
