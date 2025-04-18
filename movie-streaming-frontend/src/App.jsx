import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import PrivateRoutes from "./Routes/PrivateRoutes";
import React from "react";
import MainLayout from "./Layout/MainLayout";
import TvShows from "./pages/TvShows";
import Movies from "./pages/Movies";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<PrivateRoutes />}>
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/tvshows" element={<TvShows />} />
          <Route path="/movie/:id" element={<Movies />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
