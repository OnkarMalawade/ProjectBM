import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

export const login = async ({ email, password }) => {
  return api.post('/auth/login', { email, password }); // ✅ Only send email & password
};

export const register = async (data) => {
  return api.post('/auth/register', data);
};

export const updateProfile = (formData) =>
  axios.put("http://localhost:3000/auth/update", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });



export const getProfile = async () => {
  return api.get('/auth/profile', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};
