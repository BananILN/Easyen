import { Link } from "react-router";

export const Tabs = ({ tabs }) =>{
    return(
        <ul className="tabs-cont">
        {tabs.map(({ path, title }) => (
          <li className="li-tabs" key={path}>
            <Link
              to={path}
              aria-current="page"
              className="inline-block p-4 text-blue-600 bg-gray-100 rounded-t-lg"
            >
              {title}
            </Link>
          </li>
        ))}
      </ul>
    );
    
}