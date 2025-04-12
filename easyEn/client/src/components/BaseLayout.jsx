import MainNavigation from "./MainNavigation"
import SideBar from "./SideBar"
import Header from "./Header"
import { Outlet } from "react-router"
import { memo } from "react"
import { useState } from "react"


export const BaseLayout = memo(() => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleMenu = () => {
        setIsCollapsed((prev) => !prev);
      };

    return (
        <div className="main">
         <SideBar isCollapsed={isCollapsed}>
            <MainNavigation isCollapsed={isCollapsed} toggleMenu={toggleMenu} />
         </SideBar>
            <div className="content-wrapper">
                <Header /> 
                <div className="content">
                    <Outlet/>
                </div>
            </div>
        </div>
    );
});