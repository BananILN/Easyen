import MainNavigation from "./MainNavigation"
import SideBar from "./SideBar"
import Header from "./Header"
export const BaseLayout = ({ children }) => {
    return (
        <div className="main">
        
             <SideBar>
                 <MainNavigation/>
             </SideBar>
             <div className="content-wrapper">
                <Header /> {/* Header теперь внутри content-wrapper */}
                <div className="content">
                    {children}
                </div>
            </div>
        </div>
    )
}