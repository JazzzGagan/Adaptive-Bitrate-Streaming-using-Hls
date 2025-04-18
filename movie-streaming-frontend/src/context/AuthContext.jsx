import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./Contexts";
import axios from "axios";

export const AuthProvider = ({ children }) => {
  const [userinfo, setUserinfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [token, setToken] = useState(
    localStorage.getItem("token") || sessionStorage.getItem("sessiontoken")
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
        setIsAuthenticated(true);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token") ||
      sessionStorage.removeItem("sessiontoken");
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{ token, logout, userinfo, loading, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};
