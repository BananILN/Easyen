import { useEffect } from "react";
import { useLoaderData, useNavigation, useParams,  Route, Routes, } from "react-router";
import { mockFetch } from "../api";
import { Loader } from "../components/Loader";
import { Tabs } from "./Tabs";
import { CourseProgram } from "./CourseProgram";
import { CourseResourse } from "./CourseResourse";
import { LinkButton } from "../components/LinkButton";
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

// export const courseLoaderS = async ({ params: { id } }) => {
//     console.log("Fetching course with id:", id); // отладка
//     const course = await mockFetch(`/courses/${id}`);
//     console.log("Course data from loader:", course); // отладка
  
//     if (!course) {
//       throw new Response("Course not found", { status: 404 });
//     }
  
//     return { course }; 
//   };

export const CoursesDetails = () => {
    const [ course, setCourse] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const { id } = useParams(); 

    const getCourse = async () =>{
      const courseData = await mockFetch(`/courses/${id}`);
      setCourse(courseData);
      setIsLoading(false)
    }

    useEffect(()=>{
        setIsLoading(true);
        getCourse();
    },[])
  
    if (isLoading) {
      return <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
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
        <Tabs tabs={TABS}/>
         <Routes>
            <Route index path="" element={<CourseProgram/> }/>
            <Route path="resourse" element={<CourseResourse/>}/>
         </Routes>
         <LinkButton to={`/courses/${id}/start-course`} title="Start course" /> 
      </div>
    );
};