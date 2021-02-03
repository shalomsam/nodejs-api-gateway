import axios from 'axios';
import { authHeader } from '../../client/helpers';
import { apiBase } from '.';

class ClientServices {
    
    public async getAll() {
        const response = await axios.get(`${apiBase}/clients`, {
            headers: authHeader(),
        });
        return response.data;
    }
}

const clientServices = new ClientServices();

export default clientServices;
