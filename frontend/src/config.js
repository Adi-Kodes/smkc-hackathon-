// Centralized configuration for API and Real-time Socket connections
// In local development, defaults to http://localhost:5000
// In production, overrides cleanly via VITE_API_URL and VITE_SOCKET_URL

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const SOCKET_BASE_URL = import.meta.env.VITE_SOCKET_URL || API_BASE_URL;

export { API_BASE_URL, SOCKET_BASE_URL };
