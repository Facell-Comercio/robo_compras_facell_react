import axios from 'axios';
import { useAuthStore } from '../context/auth-store';

export const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL_API,
  });
  
  // Interceptador de requisição, para inclusão do token
  api.interceptors.request.use((config) => {
    // Obtenha o token do localStorage
    const storageToken = useAuthStore.getState().token
    const token = storageToken || null;
    // Se o token existir, adicione-o ao cabeçalho "Authorization"
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  
    return config;
  });