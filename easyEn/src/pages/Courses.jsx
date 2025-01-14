import { Await, useLoaderData, useNavigation, useSearchParams } from "react-router-dom";
import { mockFetch } from "../api";
import { Suspense, useState, useEffect } from "react";
import { Loader } from "../components/Loader";

export const courseLoader = async ({ request }) => {
    const search = new URL(request.url).searchParams.get("search");
    const courses = await mockFetch("/courses", { search }); // Используем await

    if (courses.error) {
        throw new Response("Not Found", { status: 404 });
    }

    return { courses }; // Убедитесь, что courses - это массив
};
export const Courses = () => {
    const { courses } = useLoaderData();
    const [searchParams, setSearchParams] = useSearchParams();
    const searchFromQuery = searchParams.get("search") || ""; // Убедитесь, что это не undefined
    const { state } = useNavigation();
    const [search, setSearch] = useState(searchFromQuery);

    useEffect(() => {
        setSearchParams((params) => {
            if (search) {
                params.set("search", search);
            } else {
                params.delete("search");
            }
            return params;
        });
    }, [search, setSearchParams]);

    if (!Array.isArray(courses)) {
        console.error("courses is not an array:", courses);
        return <div>No courses available</div>; // Сообщение об отсутствии курсов
    }

    return (
        <>
            <input
                type="text"
                className="search-input"
                placeholder="Search courses"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <div className="title-content">
                <h1>Courses</h1>
            </div>

            <div className="card-container">
                {state === "loading" && <Loader />}
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
    );
};