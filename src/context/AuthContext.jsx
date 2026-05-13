import { createContext, useState, useEffect } from "react";
import api from "../api/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kontrollera om det finns en sparad användare när appen startar
  useEffect(() => {
    const savedUser = localStorage.getItem('hireflow_user');
    const token = localStorage.getItem('hireflow_token');

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
      // Sätt standard-header för axios
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);