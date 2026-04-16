import { createContext, useContext, useEffect, useState } from "react";

import api from "../api/axios";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("caixacerto_token"));
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [loading, setLoading] = useState(true);

  async function fetchCurrentUser() {
    try {
      const response = await api.get("/users/me");
      setUser(response.data);
      setIsAuthenticated(true);
    } catch {
      localStorage.removeItem("caixacerto_token");
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const accessToken = response.data.access_token;

    localStorage.setItem("caixacerto_token", accessToken);
    setToken(accessToken);
    setIsAuthenticated(true);

    const userResponse = await api.get("/users/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    setUser(userResponse.data);
  }

  function logout() {
    localStorage.removeItem("caixacerto_token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  }

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

export { AuthProvider, useAuth };