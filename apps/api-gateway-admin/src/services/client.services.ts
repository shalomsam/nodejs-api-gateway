import axios from 'axios';
import { getHeaders } from '../helpers';
import { apiBase } from '../constants';
import { ApiError, ClientSuccess } from '@node-api-gateway/api-interfaces';

class ClientServices {
  public async getAll(): Promise<ClientSuccess | ApiError> {
    const response = await axios
      .get(`${apiBase}/clients`, {
        headers: getHeaders(),
      })
      .catch((e) => {
        return { data: e };
      });
    return response.data;
  }

  public async add(
    data: Record<string, any>
  ): Promise<ClientSuccess | ApiError> {
    const response = await axios
      .post(`${apiBase}/client`, data, {
        headers: getHeaders(),
      })
      .catch((e) => {
        return { data: e };
      });
    return response.data;
  }

  public async update(
    id: string,
    data: Record<string, any>
  ): Promise<ClientSuccess | ApiError> {
    const response = await axios
      .post(`${apiBase}/client/${id}`, data, {
        headers: getHeaders(),
      })
      .catch((e) => {
        return { data: e };
      });
    return response.data;
  }
}

const clientServices = new ClientServices();

export default clientServices;
