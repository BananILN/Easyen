import { ROUTES } from "..";
import { LinkButton } from "../components/LinkButton";

export default function HomePage(){


    return(

        <>
        <div className="main-home">
            <div className="content-home">
                <div className="text-content">
                <h1 className="title-desc">
                    Learning and
                    teaching online,
                    made easy.
                </h1>

                <span className="span-under-title-desc">Practice your English and learn new things with the platform.</span>
                <LinkButton to={ROUTES.courses} title="Courses"/>
                </div>
            </div>
            <div className="image-cont">
               <img src="src\assets\pep.png" alt="" />
            </div>
        </div>
        </>
    )
}