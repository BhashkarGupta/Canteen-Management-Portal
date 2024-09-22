import axios from 'axios';

const API_URL = 'http://localhost:2100/api/menu';

export const getMenuItems = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};
