import { useEffect } from "react"
import { useLoaderData, useParams } from "react-router"
import { mockFetch } from "../api"

const TABS =[
    {
        path: "",
        title: "Программа курса",
    },
    {
        path: "resourse",
        title: "Ресурсы",
    }
]

export const courseLoader = async ({ params: { id } }) => {
    const course = await mockFetch(`/courses/${id}`);
    return { course };
  };
  
  export function CoursesDetails() {
    const { course } = useLoaderData();
  
    return (
      <div>
        {/* <h1>{course.title}</h1>
        <p>{course.description}</p> */}
        {/* Добавьте другие детали курса здесь */}
      </div>
    );
  }