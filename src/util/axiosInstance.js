import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://messagenode-server-production.up.railway.app',
});

export default instance;
