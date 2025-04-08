import {$authHost} from ".";
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

