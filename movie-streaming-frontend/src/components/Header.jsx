import React, { useState } from "react";
import NavData from "../Layout/NavData";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUser } from "@fortawesome/free-solid-svg-icons";
import historyicon from "../assets/icons/icon1.svg";
import historyicon2 from "../assets/icons/icon2.svg";

const Header = () => {
  const [isopen, setIsopen] = useState(false);

  const toogleIcon = () => {
    setIsopen(!isopen);
  };
  return (
    <div className="w-full h-16 bg-black text-white flex items-center justify-between px-6 shadow-md">
      {/* Logo Section */}
      <div className="flex items-center space-x-2">
        {/* Replace with your actual logo */}
        <div className="text-yellow-50 font-bold text-xl">cinephile</div>
        <span className="bg-background2 text-black px-2 rounded text-sm">
          PRO
        </span>
      </div>

      <ul className="flex items-center space-x-20 text-lg font-medium">
        {NavData.map((navdata) => (
          <li key={navdata.id}>
            <Link
              to={navdata.path}
              className="hover:text-background2 transition"
            >
              {navdata.title}
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex items-center space-x-10 text-3xl cursor-pointer ">
        <img
          onClick={toogleIcon}
          src={isopen ? historyicon2 : historyicon}
          alt="historyicon"
          className="size-9"
        />
        <FontAwesomeIcon icon={faSearch} />
        <div className="border-l w-40 pl-8">
          <FontAwesomeIcon icon={faUser} />
        </div>
      </div>
    </div>
  );
};

export default Header;
