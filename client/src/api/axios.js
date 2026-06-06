import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  withCredentials: true, // send httpOnly cookies automatically with every request
});

export default instance;
