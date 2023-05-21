import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    timeout: 3000,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
});

export default api;
