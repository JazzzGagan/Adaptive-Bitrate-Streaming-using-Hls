import { faXmark } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

import { MdDashboard } from 'react-icons/md'
import { FaCloudUploadAlt } from 'react-icons/fa'
import { NavLink, useNavigate } from 'react-router-dom'
import { FaUser } from 'react-icons/fa'
import axios from 'axios'

const SideBar = ({ isVisible, toogleSideBar }) => {
  const navigate = useNavigate()
  const logout = async () => {
    try {
      await axios.post('http://127.0.0.1:5000/admin/logout', null, {
        withCredentials: true, // <-- REQUIRED to send the session cookie
      })
      // Now clear any client-side state if necessary
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }
  return (
    <div
      className={`w-[15%] h-[100vh]  flex flex-col items-center   absolute top-0 z-20 min-h-[500px]  space-y-6 bg-black ${
        isVisible ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300`}
    >
      <button onClick={toogleSideBar}>
        <FontAwesomeIcon
          icon={faXmark}
          className="text-2xl text-white block ml-28 mt-5  top-4 cursor-pointer"
        />
      </button>
      <div className=" w-full text-white  h-28 flex flex-col  items-center justify-evenly border-b text-6xl">
        <span>
          <FontAwesomeIcon icon={faUser} />
        </span>
        <p className="font-Helvetica text-sm">Hello Admin</p>
      </div>
      <nav className=" text-center flex flex-col space-y-10">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? 'text-cyan-600' : 'text-white'
          }
        >
          <MdDashboard className="text-4xl " />
        </NavLink>

        <NavLink
          to="/uploadmovies"
          className={({ isActive }) =>
            isActive ? 'text-cyan-600' : 'text-white'
          }
        >
          <FaCloudUploadAlt className="text-4xl " />
        </NavLink>
        <NavLink
          to="/users"
          className={({ isActive }) =>
            isActive ? 'text-cyan-600' : 'text-white'
          }
        >
          <FaUser className="text-4xl " />
        </NavLink>
      </nav>

      <div className="w-full h-25 bg-cyan-600 absolute text-center bottom-0">
        <button
          onClick={logout}
          className="font-Coolvetica text-white font-semibold text-xl p-2 "
        >
          Log Out
        </button>
      </div>
    </div>
  )
}

export default SideBar
