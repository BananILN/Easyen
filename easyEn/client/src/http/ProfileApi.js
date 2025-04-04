import {$authHost} from ".";
import { jwtDecode } from "jwt-decode";

export const fetchProfile = async (userId) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("Токен не найден");
    }

    try {
        const { data } = await $authHost.get(`api/profile/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return data;
    } catch (error) {
        console.error("Ошибка при загрузке профиля:", error);
        throw error;
    }
};

