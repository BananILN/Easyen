import { $authHost, $host } from ".";
import { jwtDecode } from "jwt-decode";

export const createLesson = async (formData) => {
  const { data } = await $authHost.post('api/lesson', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  return data;
};

export const deleteLesson= async (id) =>{
  const {data} = await $authHost.delete(`api/lesson/${id}`)
  return data
}

export const updateLesson = async (id,formData) =>{
  const { data } = await $authHost.put(`api/lesson/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  return data;
}

export const fetchLesson = async () => {
      const { data } = await $host.get('api/lesson');
         return data
}

console.log('BaseURL:', $host.defaults.baseURL); 

export const fetchOneLesson = async (id) => {
  try {
    const response = await $host.get(`api/lesson/${id}`); 
    if (response.status !== 200) {
      throw new Error(`Ошибка ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error("Ошибка запроса:", {
      url: error.config.url,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

 