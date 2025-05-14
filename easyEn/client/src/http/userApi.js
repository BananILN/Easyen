import { $authHost, $host } from ".";
import { jwtDecode } from "jwt-decode";

// export const registrationAuth = async (email, username, password) => {
//   try {
//     const { data } = await $host.post('api/user/registration', { email, username, password, RoleID: 1 });
    
//     if (!data.token) {
//       throw new Error("Временный токен не получен");
//     }

//     localStorage.setItem('token', data.token);

//     const decodedToken = jwtDecode(data.token);
//     console.log(decodedToken);

//     return decodedToken;

//   } catch (error) {
//     console.error("Ошибка при регистрации:", error);
//     throw error;
//   }
// };

  export const registrationAuth = async (email, username, password) => {
    try {
      const { data } = await $host.post("api/user/registration", { email, username, password, RoleID: 1 });
      if (!data.tempToken) {
        throw new Error("Временный токен не получен");
      }
      return data; 
    } catch (error) {
      console.error("Ошибка при регистрации:", error);
      throw error;
    }
  };

  
  export const verifyEmail = async (tempToken, code) => {
    try {
      const { data } = await $host.post("api/user/verify-email", { tempToken, code });
      if (!data.token) {
        throw new Error("Токен не получен");
      }
      localStorage.setItem("token", data.token);
      return jwtDecode(data.token);
    } catch (error) {
      console.error("Ошибка при подтверждении email:", error);
      throw error;
    }
  };


export const loginAuth = async (email, password) => {
    try {
      const { data } = await $host.post('api/user/login', { email, password });
      console.log("Полученный токен:", data.token);
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
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Токен отсутствует");
      }
      
      const { data } = await $authHost.get('api/user/auth');
      if (!data.token) {
        throw new Error("Токен не получен");
      }
      localStorage.setItem('token', data.token);
      return jwtDecode(data.token);
    } catch (error) {
     
      if (error.response) {
        throw new Error(`Ошибка сервера: ${error.response.status}`);
      } else if (error.request) {
        throw new Error("Нет ответа от сервера");
      } else {
        throw error;
      }
    }
  };


  export const GetProfileInfo = async () =>{
    try {
      const { data } = await $authHost.get("api/user/profile"); 
      return data;
    } catch (error) {
      console.error("Ошибка при получении профиля:", error);
      throw error;
    }
  }

  export const resendCode = async (tempToken) => {
    try {
      const { data } = await $host.post("api/user/resend-code", { tempToken });
      return data;
    } catch (error) {
      console.error("Ошибка повторной отправки кода:", error);
      throw error;
    }
  };