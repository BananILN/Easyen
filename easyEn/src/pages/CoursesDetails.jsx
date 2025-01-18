import { useEffect } from "react";
import { useLoaderData, useNavigation, useParams } from "react-router";
import { mockFetch } from "../api";
import { Loader } from "../components/Loader";

const TABS = [
    {
        path: "",
        title: "Программа курса",
    },
    {
        path: "resourse",
        title: "Ресурсы",
    }
];

export const courseLoaderS = async ({ params: { id } }) => {
    console.log("Fetching course with id:", id); // Отладочное сообщение
    const course = await mockFetch(`/courses/${id}`);
    console.log("Course data from loader:", course); // Отладочное сообщение
  
    if (!course) {
      throw new Response("Course not found", { status: 404 });
    }
  
    return { course }; // Возвращаем объект с курсом
  };

export const CoursesDetails = () => {
    const { course } = useLoaderData(); // Получаем данные о курсе
    const { state } = useNavigation();
  
    console.log("Course in CoursesDetails:", course); // Отладочное сообщение
  
    if (state === "loading") {
      return <Loader />;
    }
  
    if (!course) {
      return <div>Course not found</div>;
    }
  
    return (
      <div>
        <h1>{course.title}</h1>
        <p>{course.description}</p>
        <img src={course.imageUrl} alt={course.title} />
      </div>
    );
};