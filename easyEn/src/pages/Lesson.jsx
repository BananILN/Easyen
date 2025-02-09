import { useParams } from "react-router";

const Lesson = () => {
    const { id } = useParams(); // Получите ID урока из параметров маршрута
    return (
        <div>
            <h1>Lesson Page</h1>
            <p>Current lesson ID: {id}</p>
        </div>
    );
};

export default Lesson;