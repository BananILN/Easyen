import {$authHost, $host} from ".";
import { jwtDecode } from "jwt-decode";

export const fetchProfile = async (userId) => {
    try {
        const { data } = await $authHost.get(`api/profile/${userId}`);
        return data;
    } catch (error) {
        console.error("Ошибка при загрузке профиля:", error);
        throw error;
    }
};

export const updateProfile = async (userId, formData) =>{
    try{
        const { data } = await $authHost.put(`api/profile/${userId}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
        })
        return data;
        }   
    catch (error){
        console.error();
        console.error("Ошибка при обновлении профиля:", error);
        throw error;
    }
}

