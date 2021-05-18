import { ApiResponse, ResponseStatus } from "@node-api-gateway/api-interfaces";
import { toast } from 'react-hot-toast';

const toastOptionsDefault = {
  success: 'Success!',
  loading: 'Loading...',
  error: 'Error!',
};

export const responseHelper = async <T extends ApiResponse>(
  fn: () => Promise<T>,
  thunkAPI,
  toastOptions: Partial<typeof toastOptionsDefault> = toastOptionsDefault
): Promise<T> => {
  const promise = fn();

  toast.promise(promise, { ...toastOptionsDefault, ...toastOptions });

  const response = await promise;

  if (response.status !== ResponseStatus.success) {
    return thunkAPI.rejectWithValue(response);
  }

  return response;
};