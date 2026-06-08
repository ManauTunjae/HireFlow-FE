import { createContext, useState, useEffect } from "react";
import api from "../api/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kontrollera om det finns en sparad användare när appen startar
  useEffect(() => {
    const savedUser = localStorage.getItem("recruiter_user");
    const token = localStorage.getItem("recruiter_token");

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
      // Sätt standard-header för axios
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const register = async (username, email, password, role, company) => {
    try {
      const endpoint =
        role === "recruiter"
          ? "api/auth/register-recruiter"
          : "api/auth/register-candidate";

      const bodyData = { username, email, password, role };
      if (role === "recruiter") {
        bodyData.company = company;
      }

      const response = await api.post(endpoint, bodyData);
      const userData = response.data.user;
      const token = userData?.token;
      if (!token) {
        return {
          success: false,
          message: "Account created, but no token recived",
        };
      }

      localStorage.setItem("recruiter_token", token);
      localStorage.setItem("recruiter_user", JSON.stringify(userData));

      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data?.message || error.message,
      );
      return {
        success: false,
        message: error.response?.data?.message || "Registration unsuccessful",
      };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post("api/auth/login", { email, password });

      const userData = response.data.user;
      const token = userData?.token;

      if (!token) {
        return { success: false, message: "No token returned from server" };
      }

      // Spara i localStorage så man slipper logga in igen vid refresh
      localStorage.setItem("recruiter_token", token);
      localStorage.setItem("recruiter_user", JSON.stringify(userData));

      // Uppdatera axios headers och state
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(userData);

      return { success: true };
    } catch (error) {
      console.error(
        "Login error:",
        error.response?.data?.message || error.message,
      );
      return {
        success: false,
        message: error.response?.data?.message || "Login unsuccessful",
      };
    }
  };

  const logout = (navigate) => {
    localStorage.removeItem("recruiter_token");
    localStorage.removeItem("recruiter_user");

    delete api.defaults.headers.common["Authorization"];
    
    setUser(null);

    if (navigate) {
      navigate("/");
    }
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
