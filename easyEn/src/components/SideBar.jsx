import Logo from "../assets/Language.svg?react";    
export default function SideBar ({children}) {

    return (
       <div className="sidebar">
        <div className="logo">
          <Logo/>
            <span>Try out</span>
        </div>
        <div className="hr-logo-cont">
        <hr className="hr-logo"  color="#424245" />
        </div>
    

            {children}
       </div>
    )
}