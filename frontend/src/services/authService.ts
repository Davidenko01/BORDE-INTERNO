import axios from 'axios';
import { DIR_IP_LOGIN } from '@env';  

export const login = async (email: string, password: string) => {
  const response = await axios.post(`http://${DIR_IP_LOGIN}/auth/login`, { email, password });
  return response.data;
};

export const register = async (email: string, password: string) => {
  const response = await axios.post(`http://${DIR_IP_LOGIN}/auth/register`, { email, password });
  return response.data;
};