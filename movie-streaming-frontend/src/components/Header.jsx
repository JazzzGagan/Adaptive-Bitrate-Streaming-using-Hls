import React, { useContext, useState } from "react";
import NavData from "../Layout/NavData";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUser,
  faGear,
  faHeart,
  faSignOutAlt,
  faClock,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import historyicon from "../assets/icons/icon1.svg";
import historyicon2 from "../assets/icons/icon2.svg";
import { AuthContext } from "../context/Contexts";
import Input from "./Input";

const Header = () => {
  const navigate = useNavigate();
  const [isopen, setIsopen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [userProfileOpen, setUserProfileOpen] = useState(false);

  const { userinfo, logout } = useContext(AuthContext);


  const toogleIcon = () => {
    setIsopen(!isopen);
  };
  const handleSearchClick = () => {
    setIsSearchActive(!isSearchActive);
  };
  const toggleUserProfile = () => {
    setUserProfileOpen(!userProfileOpen);
  };

  return !isSearchActive ? (
    <div className="w-full h-[8vh] sm:h-1/2  text-white  space-y-4  sm:flex items-center justify-between sm:px-8 shadow-md relative">
      {/* Logo Section */}
      <div className="flex items-center sm:space-x-2">
        <div className="text-yellow-50 font-bold text-xl">cinephile</div>
        <span className="bg-background2 text-black px-2 rounded text-sm">
          PRO
        </span>
      </div>

      <ul className="flex items-center space-x-6   sm:space-x-20 text-lg font-medium ">
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

        <FontAwesomeIcon icon={faSearch} onClick={handleSearchClick} />

        <div className="border-l w-40 pl-8 cursor-pointer relative">
          <FontAwesomeIcon icon={faUser} onClick={toggleUserProfile} />
          <div className="text-white text-sm font-semibold">
            {userinfo?.username || "Username"}
          </div>

          {userProfileOpen && (
            <div className="absolute right-0  mt-4 w-64 bg-black bg-opacity-95 rounded-2xl shadow-2xl border border-white border-opacity-10 z-50">
              <div className="flex flex-col items-center py-4 border-b border-white border-opacity-20">
                <div className="w-16 h-16 rounded-full bg-gray-700 mb-2" />
                <div className="text-white font-semibold">
                  {userinfo?.username || "Username"}
                </div>
                <div className="text-gray-400 text-xs">VIP Member</div>
              </div>

              <div className="flex text-sm flex-col p-2">
                <button
                  onClick={() => navigate("/favorites")}
                  className="flex items-center gap-3 text-white hover:text-[#00acc1] px-4 py-2 rounded-lg transition-colors"
                >
                  <FontAwesomeIcon icon={faHeart} /> Favorites
                </button>

                <button
                  onClick={() => navigate("/history")}
                  className="flex items-center gap-3 text-white hover:text-[#00acc1] px-4 py-2 rounded-lg transition-colors"
                >
                  <FontAwesomeIcon icon={faClock} /> Watch History
                </button>

                <button
                  onClick={() => navigate("/settings")}
                  className="flex items-center gap-3 text-white hover:text-[#00acc1] px-4 py-2 rounded-lg transition-colors"
                >
                  <FontAwesomeIcon icon={faGear} /> Settings
                </button>

                <button
                  onClick={logout}
                  className="flex items-center gap-3 text-red-400 hover:text-red-600 px-4 py-2 rounded-lg transition-colors mt-2"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} /> Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="w-full h-[8vh] flex items-center justify-center ">
      <div className="w-[90%] h-[6vh] m-0 flex items-center justify-evenly ">
        <div className=" w-[10%] h-[5vh] flex items-center sm:space-x-2 ">
          <div className="text-yellow-50 font-bold text-xl">cinephile</div>
          <span className="bg-background2 text-black px-2 rounded text-sm">
            PRO
          </span>
        </div>
        <div className="w-[90%] h-[5vh] flex items-center justify-center ">
          <FontAwesomeIcon
            className=" w-[10%] text-4xl cursor-pointer"
            icon={faSearch}
            onClick={handleSearchClick}
          />
          <Input />
          <button onClick={handleSearchClick} className="w-[10%]">
            <FontAwesomeIcon
              icon={faTimes}
              className="  text-4xl cursor-pointer"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
