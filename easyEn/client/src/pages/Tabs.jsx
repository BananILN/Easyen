import { Link, useParams } from "react-router";

export const Tabs = ({ tabs }) =>{
    const { id } = useParams(); 

    return (
      <ul className="tabs-cont">
        {tabs.map(({ path, title }) => (
          <li className="li-tabs" key={path}>
            <Link
              to={`/courses/${id}/${path}`.replace(/\/+/g, '/')} // Абсолютный путь
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