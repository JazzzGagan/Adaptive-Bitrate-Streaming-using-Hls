import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div
      className="w-full h-screen relative bg-center bg-cover bg-no-repeat"
      style={{ backgroundImage: "url('src/assets/backgroundimage.png')" }}
    >
     
      <div className="absolute top-4 right-4 flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 z-10">
        <Link to="/login">
          <button className="w-full sm:w-auto px-6 py-2 bg-background1 font-bold font-sans text-black rounded-full hover:bg-hoverWhite transition duration-300">
            Login
          </button>
        </Link>
        <Link to="/signup">
          <button className="w-full sm:w-auto px-6 py-2 bg-background2 font-bold font-sans text-white rounded-full hover:bg-hoverBlue transition duration-300">
            Sign Up
          </button>
        </Link>
      </div>

      {/* Centered Heading */}
      <div className="absolute inset-0 flex justify-center items-center text-white px-4 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
          Welcome to MovieStream
        </h1>
      </div>
    </div>
  );
};

export default LandingPage;
