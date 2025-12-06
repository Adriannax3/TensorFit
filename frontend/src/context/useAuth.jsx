import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "../axios.jsx";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = async ({ email, username, password }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/users", { email, username, password });
      const { user, token } = response.data;
      localStorage.setItem("token", token);
      setUser(user);
      return user;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Błąd rejestracji");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const login = async ({ email, password }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/users/login", { email, password });

      const { user, token } = response.data;

      localStorage.setItem("token", token);

      setUser(user);

      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || "Błąd logowania");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        setLoading(true);
        const response = await axios.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (err) {
        console.error("Nie udało się odzyskać usera:", err);
        setUser(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
