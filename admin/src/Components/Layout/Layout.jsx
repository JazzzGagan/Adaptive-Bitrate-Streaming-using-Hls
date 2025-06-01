import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from '../SideBar/SideBar'
import NavBar from '../NavBar/NavBar'

const Layout = () => {
  const [isSideBarVisible, setIsSideBarVisible] = useState(false)

  const toogleSideBar = () => {
    setIsSideBarVisible(!isSideBarVisible)
  }
  return (
    <div className="flex flex-col">
      <NavBar toogleSideBar={toogleSideBar} />
      <SideBar isVisible={isSideBarVisible} toogleSideBar={toogleSideBar} />
      <div
        className={`flex-grow w-full h-[90vh]  transition-all duration-300 ${
          isSideBarVisible ? 'ml-[216px] w-[1224px]' : 'ml-0'
        } `}
      >
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
