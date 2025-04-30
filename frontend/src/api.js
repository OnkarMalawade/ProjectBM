// src/api.js
const API_URL = 'http://localhost:3000';

export const fetchWithAuth = async (endpoint, method = 'GET', body = null) => {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : null,
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
};
