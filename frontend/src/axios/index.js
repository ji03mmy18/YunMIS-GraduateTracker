import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.64.2:3000/api',
    timeout: 3000,
    headers: { 'Content-Type': 'application/json' }
});

export default api;
