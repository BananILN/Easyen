import { NavLink } from "react-router";

export const LinkButton = ({title, to, onClick, ...props}) =>{
    return (
        <NavLink
          to={to}
          className="buttonLink"
          onClick={onClick}
          {...props}
            >
            {title}
        </NavLink>
    )
}