import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./Contexts";
import axios from "axios";

export const AuthProvider = ({ children }) => {
  const [userinfo, setUserinfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [token, setToken] = useState(null);
  

  useEffect(() => {
    const checkAuthStatus = () => {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("sessiontoken");
      setToken(token);
      setIsAuthenticated(!!token);
    };
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    axios
      .get("http://localhost:5000/home", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUserinfo(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setLoading(false);
      });
  }, [token]);

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token") ||
      sessionStorage.removeItem("sessiontoken");
    setUserinfo(null);
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        logout,
        userinfo,
        loading,
        isAuthenticated,
        setIsAuthenticated,
        setToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
