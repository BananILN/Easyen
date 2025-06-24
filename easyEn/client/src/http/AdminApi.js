import { $authHost } from "./index";

export const fetchAllUsers = async () => {
  try {
    const { data } = await $authHost.get("/api/admin/users"); 
    return data;
  } catch (error) {
    console.error("Ошибка при загрузке списка пользователей:", error);
    throw error;
  }
};

export const fetchProgressForUser = async (userId) => {
  try {
    const { data } = await $authHost.get(`/api/admin/progress/${userId}`);
    if (!data || data.length === 0) {
      return []; // Просто возвращаем пустой массив без логов
    }
    return data;
  } catch (error) {
    console.error(`Ошибка при загрузке прогресса для пользователя ${userId}:`, error);
    throw error;
  }
};