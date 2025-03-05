import { $authHost, $host } from ".";
import { jwtDecode } from "jwt-decode";

export const registrationAuth = async (email, username, password) => {
  const { data } = await $host.post('api/user/registration', { email, username, password, RoleID: 1 });
  localStorage.setItem('token', data.token);
  return jwtDecode(data.token); // Декодируем токен
};

export const loginAuth = async (email, password) => {
    try {
      const { data } = await $host.post('api/user/login', { email, password });
      if (!data.token) {
        throw new Error("Токен не получен");
      }
      localStorage.setItem('token', data.token);
      return jwtDecode(data.token); 
    } catch (error) {
      console.error("Ошибка при входе:", error);
      throw error;
    }
  };

  export const check = async () => {
    try {
      const { data } = await $authHost.get('api/user/auth');
      if (!data.token) {
        throw new Error("Токен не получен");
      }
      localStorage.setItem('token', data.token);
      return jwtDecode(data.token);
    } catch (error) {
      console.error("Ошибка при проверке авторизации:", error);
      throw error;
    }
  };