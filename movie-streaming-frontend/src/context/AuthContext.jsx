import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./Contexts";
import axios from "axios";

export const AuthProvider = ({ children }) => {
  const [userinfo, setUserinfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [token, setToken] = useState(null);

<<<<<<< HEAD

=======
>>>>>>> 9c939ad (Recommend movies using tf-idf vector spacing method and find movie similarity using cosine)
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
<<<<<<< HEAD
      .get("http://127.0.0.1:5000/home", {
=======
      .get(" http://127.0.0.1:5000/home", {
>>>>>>> 9c939ad (Recommend movies using tf-idf vector spacing method and find movie similarity using cosine)
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
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
        setToken,
        setUserinfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
