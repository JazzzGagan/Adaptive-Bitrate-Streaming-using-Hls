import React from "react";
import HeroAnimation from "../src/components/HeroAnimation";
import { Link } from "react-router-dom";


const LandingPage2 = () => {
  return (
    <>
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

      <HeroAnimation />
    </>
  );
};

export default LandingPage2;
