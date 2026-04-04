// Centralized API configuration for production sync
const BASE_URL = import.meta.env.VITE_API_URL || 'https://ideal-class-production.up.railway.app';
export const API = BASE_URL;
export const API_URL = `${BASE_URL}/api`;
export default API_URL;
