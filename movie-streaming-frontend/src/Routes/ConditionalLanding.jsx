import React from "react";
import { useContext } from "react";
import { AuthContext } from "../context/Contexts";
import Home from "../pages/Home";
import LandingPage from "../pages/LandingPage";

const ConditionalLanding = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? <Home /> : <LandingPage />;
};

export default ConditionalLanding;
