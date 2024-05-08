import axios from 'axios';

const instance = axios.create({
    //baseURL: 'https://messagenode-server-production.up.railway.app',
    baseURL: 'http://localhost:8080',
});

export default instance;
