import React, { useContext, useState } from "react";
import NavData from "../Layout/NavData";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faGear,
  faHeart,
  faSignOutAlt,
  faClock,
  faTimes,
  faUser,
  faBars,
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
    <div className="w-full  md:h-[8vh] sm:h-1/2 border-b-2   ">
      {userProfileOpen && (
        <div className="absolute w-48 top-0 right-0 mt-2  bg-black bg-opacity-95 rounded-2xl shadow-2xl border border-white border-opacity-10 z-50">
          <div className="flex flex-col items-center py-4 border-b border-white border-opacity-20">
            {userinfo?.avatar ? (
              <img
                src={userinfo.avatar.src}
                alt={userinfo.avatar.alt}
                onClick={toggleUserProfile}
                className=" h-auto object-contain rounded-sm w-12"
              />
            ) : (
              <FontAwesomeIcon
                icon={faUser}
                onClick={toggleUserProfile}
                className="text-3xl"
              />
            )}

            <div className="text-white font-semibold">
              <div className="text-white text-sm font-semibold">
                {userinfo?.username || "Username"}
              </div>
            </div>
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
              onClick={() => navigate("/manageprofile")}
              className="flex items-center gap-3 text-white hover:text-[#00acc1] px-4 py-2 rounded-lg transition-colors"
            >
              <FontAwesomeIcon icon={faGear} /> Manage Profile
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
      <div className="  w-[90%] md:h-[8vh]  text-white mx-auto    md:space-y-4 md:flex items-center justify-between sm:px-8 shadow-md relative">
        <div className="flex items-center justify-center md:w-auto">
          <div className=" flex items-center justify-between w-full md:w-auto sm:space-x-2  ">
            <div className="text-yellow-50 font-bold text-xl">MovieMandu</div>
          </div>

          {/* Mobile icons */}
          <div className="flex md:hidden items-center space-x-4 relative">
            <Link to={"/library"}>
              <img
                onClick={toogleIcon}
                src={isopen ? historyicon2 : historyicon}
                alt="historyicon"
                className="size-16"
              />
            </Link>

            <FontAwesomeIcon
              icon={faSearch}
              onClick={handleSearchClick}
              className="text-xl"
            />

            {userinfo?.avatar ? (
              <img
                src={userinfo.avatar.src}
                alt={userinfo.avatar.alt}
                onClick={toggleUserProfile}
                className="w-8 h-8 rounded-sm object-cover"
              />
            ) : (
              <FontAwesomeIcon
                icon={faBars}
                onClick={toggleUserProfile}
                className="text-2xl"
              />
            )}
          </div>
        </div>

        <ul className=" md:w-[40%]  flex items-center justify-around  md:flex  md:justify-evenly text-lg md:font-medium ">
          {NavData.map((navdata) => (
            <li key={navdata.id}>
              <NavLink
                to={navdata.path}
                className={({ isActive }) => {
                  return (
                    " py-1 md:py-5 md:px-12 text-sm md:text-lg font-helvetica w-1/3   " +
                    (isActive
                      ? "text-background2   border-b-4 border-background2"
                      : "text-white")
                  );
                }}
              >
                {navdata.title}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className=" hidden md:flex items-center md:space-x-10 cursor-pointer  ">
          <Link to={"/library"}>
            <img
              onClick={toogleIcon}
              src={isopen ? historyicon2 : historyicon}
              alt="historyicon"
              className="size-6 md:size-9"
            />
          </Link>

          <FontAwesomeIcon
            icon={faSearch}
            onClick={handleSearchClick}
            className="text-2xl border-r pr-6 md:text-4xl"
          />

          <div className="  w-14  flex flex-col items-center justify-center cursor-pointer relative ">
            {userinfo?.avatar ? (
              <img
                src={userinfo.avatar.src}
                alt={userinfo.avatar.alt}
                onClick={toggleUserProfile}
                className="w-full h-auto rounded-sm object-contain"
              />
            ) : (
              <FontAwesomeIcon
                icon={faUser}
                onClick={toggleUserProfile}
                className="hidden md:block text-3xl"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="w-full h-[8vh] flex items-center justify-center  ">
      <div className="w-full md:w-[90%] h-[6vh] mx-auto flex items-center  justify-evenly  ">
        <div className="hidden w-[10%] h-[5vh] md:flex items-center sm:space-x-2 ">
          <div className="text-yellow-50  font-bold text-xs md:text-xl">
            MovieMandu
          </div>
        </div>
        <div className="w-[90%] h-[5vh] flex items-center justify-around  md:justify-center ">
          <FontAwesomeIcon
            className=" w-[10%] text-xl md:text-4xl cursor-pointer"
            icon={faSearch}
            onClick={handleSearchClick}
          />
          <Input setIsSearchActive={setIsSearchActive} />
          <button onClick={handleSearchClick} className="w-[10%]">
            <FontAwesomeIcon
              icon={faTimes}
              className=" text-2xl  md:text-4xl cursor-pointer"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
