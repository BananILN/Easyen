import { $authHost } from "./index";

export const fetchStatistics = async (userId = null) => {
  try {
    const url = userId ? `/api/statistics?userId=${userId}` : '/api/statistics';
    const { data } = await $authHost.get(url);
    return data;
  } catch (error) {
    console.error("Ошибка при загрузке статистики:", error);
    throw error;
  }
};