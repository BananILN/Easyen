import { Await, useLoaderData, useNavigation, useSearchParams } from "react-router";
import { mockFetch } from "../api";
import { Suspense, useState, useEffect } from "react";
import { Loader } from "../components/Loader";

export const courseLoader = ({request}) =>{
    const search = new URL(request.url).searchParams.get("search");
    const courses = mockFetch("/courses", {search})

    return defer({
        courses,
    });
};


export default function Courses(){
    const {courses} = useLoaderData();
    const {searchParams, setSearchParams} = useSearchParams();
    const searchFromQuery = searchParams.get("search");
    const {state} = useNavigation();
    const [search, setSearch] = useState(searchFromQuery || "")
   
    useEffect(() => {
        setSearchParams((params) => {
            if (search) {
                params.set("search", search);
            } else {
                params.delete("search");
            }
            return params;
        });
    }, [search]);

    return(
        <Suspense fallback ={<Loader/>}>
        <Await
            resolve={courses}
            errorElement={<div>Oops, error while loading courses</div>}
        >
            {(courses) => (
                    <>
                        <div className="title-content">
                            <h1>Courses</h1>
                        </div>

                        <div className="card-container">
                            {courses.map((course) => (
                                <div className="card" key={course.id}>
                                    <div className="img-cont">
                                        <img
                                            className="abstract-img-course"
                                            src={course.imageUrl}
                                            alt={course.title}
                                        />
                                    </div>
                                    <div className="title-card">
                                        {course.title}
                                    </div>

                                    <div className="progress-card">
                                        <div className="progressbar-Card"></div>
                                        <div className="text-desc-card">
                                            Completed: 0%
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </Await>
        </Suspense>
    )
}