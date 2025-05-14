import { LESSON_ROUTE, ROUTES } from "..";
import { LinkButton } from "../components/LinkButton";

export default function HomePage(){


    return(

        <>
        <div className="main-home">
            <div className="content-home">
                <div className="text-content">
                <h1 className="title-desc">
                        Обучение и
                    преподавание онлайн
                    стали проще.
                </h1>

                
                
                <span className="span-under-title-desc">Практикуйте английский и изучайте новое с нашей платформой.</span>
                <LinkButton to={LESSON_ROUTE} title="Lesson"/>
                </div>
            </div>
            <div className="image-cont">
               <img src="src\assets\pep.png" alt="" />
            </div>
        </div>
        </>
    )
}