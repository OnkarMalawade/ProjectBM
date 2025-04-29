import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/auth', // your NestJS backend
});

// Attach token to each request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default API;
