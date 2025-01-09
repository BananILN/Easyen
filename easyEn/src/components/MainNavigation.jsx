import { NAV_ITEMS } from "..";
import { Link } from "react-router";
export default function MainNavigation() {
    
    return(
        <nav className="navigate">
            {NAV_ITEMS.map(item => (
                <Link to={item.path} className = "nav-items">
                    {item.title}
                </Link>
            ))}
        </nav>
    )
}