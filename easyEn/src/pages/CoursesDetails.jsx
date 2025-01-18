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
    console.log("Fetching course with id:", id); // отладка
    const course = await mockFetch(`/courses/${id}`);
    console.log("Course data from loader:", course); // отладка
  
    if (!course) {
      throw new Response("Course not found", { status: 404 });
    }
  
    return { course }; 
  };

export const CoursesDetails = () => {
    const { course } = useLoaderData();
    const { state } = useNavigation();
  
    console.log("Course in CoursesDetails:", course); 
  
    if (state === "loading") {
      return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Loader />
    </div>;
    }
  
    if (!course) {
      return <div>Course not found</div>;
    }
  
    return (
      <div className="content-details">
       
         <h1>{course.title}</h1>
        <p className="p-details">{course.description}</p>
        
        
      </div>
    );
};