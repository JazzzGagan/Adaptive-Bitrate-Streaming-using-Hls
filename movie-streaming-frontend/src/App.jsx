import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import PrivateRoutes from "./Routes/PrivateRoutes";
import React from "react";
import MainLayout from "./Layout/MainLayout";
import TvShows from "./pages/TvShows";
import Movies from "./pages/Movies";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import SignupForm from "./pages/Signup";
import LoginFrom from "./pages/Login";
import Search from "./pages/Search";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginFrom />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route element={<PrivateRoutes />}>
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/tvshows" element={<TvShows />} />
          <Route path="/movie/:id/:type" element={<Movies />} />
          <Route path="/movie/:id" element={<Movies />} />
          <Route path="/search" element={<Search />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
