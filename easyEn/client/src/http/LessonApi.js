import { $authHost, $host } from ".";
import { jwtDecode } from "jwt-decode";

export const createLesson = async (title,content,img) => {
  const { data } = await $authHost.post('api/lesson', {title,content,img});
  return data
};

export const fetchLesson = async () => {
      const { data } = await $host.get('api/lesson');
         return data
}

export const fetchOneLesson = async (id) =>{
    const { data } = await $host.get('api/lesson/' + id)
    return data
}

 