import axios from "axios"

const $host = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

const $authHost = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

const authInterceptor = config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};
const errorInterceptor = error => {
    if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
    return Promise.reject(error);
};

$authHost.interceptors.request.use(authInterceptor)
$authHost.interceptors.response.use(response => response, errorInterceptor);

export const checkAuth = async () => {
    try {
        const response = await $authHost.get('api/user/auth');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export {
    $host,
    $authHost
}