import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const NavBar = ({ toogleSideBar }) => {
  return (
    <div className="w-full h-[10vh] flex items-center justify-start text-white bg-black">
      <button onClick={toogleSideBar} className="ml-8 text-3xl cursor-pointer">
        <FontAwesomeIcon icon={faBars} />
      </button>
    </div>
  );
};

export default NavBar;
