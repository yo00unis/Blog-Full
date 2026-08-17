// apiEndpoints.js

const BASE_URL = import.meta.env.MODE === 'production' 
  ? 'https://api.yourdomain.com/api'  
  : 'https://localhost:7034/api';  

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
    CHANGE_PASSWORD: `${BASE_URL}/auth/change-password`,
    FORGOT_PASSWORD: `${BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${BASE_URL}/auth/reset-password`,
  },
};

export default API_ENDPOINTS;