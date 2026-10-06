// Centralized configuration for API and Real-time Socket connections
// Automatically trims any accidental trailing slashes

const rawApi = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_BASE_URL = rawApi.replace(/\/+$/, '');

const rawSocket = import.meta.env.VITE_SOCKET_URL || API_BASE_URL;
const SOCKET_BASE_URL = rawSocket.replace(/\/+$/, '');

export { API_BASE_URL, SOCKET_BASE_URL };
