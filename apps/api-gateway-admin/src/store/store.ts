import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import clientsReducer from './features/client';
import { authReducer } from './features/user';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    clients: clientsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDisatch = () => useDispatch<AppDispatch>();
export const AppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
