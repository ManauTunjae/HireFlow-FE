import axios from "axios";

// Skapa en instans URL från .env
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// TODO: Lägger en interceptor senare som automatisk skickar med token
export default api;
