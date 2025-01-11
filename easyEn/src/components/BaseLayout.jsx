import MainNavigation from "./MainNavigation"
import SideBar from "./SideBar"
import Header from "./Header"
import { Outlet } from "react-router"
export const BaseLayout = () => {
    return (
        <div className="main">
        
             <SideBar>
                 <MainNavigation/>
             </SideBar>
             <div className="content-wrapper">
                <Header /> 
                <div className="content">
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}