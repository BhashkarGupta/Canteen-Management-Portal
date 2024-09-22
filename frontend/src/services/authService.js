import axios from 'axios';

const API_URL = 'http://localhost:2100/api/users/login';  // Update URL if needed

export const login = async (email, password) => {
  const response = await axios.post(API_URL, { email, password });
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};
