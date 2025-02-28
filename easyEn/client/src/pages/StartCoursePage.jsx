import { mockFetch } from "../api";
import { useNavigation,useActionData,redirect,Form, } from "react-router";
import { Loader } from "../components/Loader"; 

export const startCourseAction = async ({ params: { id }, request }) => {
    const formData = await request.formData();
    console.debug(formData);
  
    const courseDetails = await mockFetch(`/courses/${id}`);
  
    if (!formData.get("name")) {
      return ({ message: "Name field can't be empty" }, { status: 400 });
    }
  
    alert(`${formData.get("name")}, welcome to course ${courseDetails.title}`);
  
    return redirect(`/courses/${id}`);
  };

export const StartCoursePage = () =>{

    const navigation = useNavigation();
    const data = useActionData();

    return (
        <div className="start-course">
          <h1 className="start-title">
            Start your learning path now
          </h1>
    
          {data?.message && <p className="data-message">{data.message}</p>}
    
          {navigation.state === "submitting" && <Loader />}
    
          <Form method="post" className="form-start">
            <input
              className="form-input"
              type="text"
              name="name"
              placeholder="Enter your name"
            />
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="Enter your email"
            />
            <button className="buttonLink" type="submit">
              Start course
            </button>
          </Form>
        </div>
      );
}