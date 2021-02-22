import axios from 'axios';
import { authHeader } from '../../client/helpers';
import { apiBase } from '.';

class ClientServices {
    
    public async getAll() {
        const response = await axios.get(`${apiBase}/clients`, {
            headers: authHeader(),
        }).catch(e => {
            return { data: e }
        });;
        return response.data;
    }

    public async add(data: object) {
        const response = await axios.post(`${apiBase}/client`, data, {
            headers: authHeader(),
        }).catch(e => {
            return { data: e }
        });;
        return response.data;
    }

    public async update(id: string, data: object) {
        const response = await axios.post(`${apiBase}/client/${id}`, data, {
            headers: authHeader(),
        }).catch(e => {
            return { data: e }
        });
        return response.data;
    }
}

const clientServices = new ClientServices();

export default clientServices;
