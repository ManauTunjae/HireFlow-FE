import { createContext, useState, useEffect } from "react";
import api from "../api/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kontrollera om det finns en sparad användare när appen startar
  useEffect(() => {
    const savedUser = localStorage.getItem("recruiter");
    const token = localStorage.getItem("recruiter_token");

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
      // Sätt standard-header för axios
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
        const response = await api.post('/auth/login', {email, password});
        const { token, user: userData } = response.data;

        // Spara i localStorage så man slipper logga in igen vid refresh
        localStorage.setItem('recruiter_token', token);
        localStorage.setItem('recruiter', JSON.stringify(userData));

        // Uppdatera axios headersoch state
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);

        return { success: true };
    } catch (error) {
        console.error("Login error:", error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || "Login unsuccessfully" };
    }
  };


};
