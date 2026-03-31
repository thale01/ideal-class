// Centralized API URL — uses environment variable in production, localhost in development
const API_BASE = import.meta.env.VITE_API_URL || 'https://ideal-class-production.up.railway.app';

export const API_URL = `${API_BASE}/api`;
export default API_URL;
