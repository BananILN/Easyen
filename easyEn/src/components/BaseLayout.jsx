import MainNavigation from "./MainNavigation"
import SideBar from "./SideBar"

export const BaseLayout = ({ children }) => {
    return (
        <div className="main">
             <SideBar>
                 <MainNavigation/>
             </SideBar>
             

            <div className="сontent">
                {children}
            </div>
        </div>
    )
}