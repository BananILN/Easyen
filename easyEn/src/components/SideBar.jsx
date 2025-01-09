import Logo from "../assets/Language.svg?react";    
export default function SideBar ({children}) {

    return (
       <div className="sidebar">
        <div className="logo">
          <Logo/>
            <span>Try out</span>
        </div>
        <hr className="hr-logo"  color="#303270" />

            {children}
       </div>
    )
}