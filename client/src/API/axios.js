import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true // para que la cookie httpOnly del refresh token viaje
});

// --- almacenamiento del access token en memoria (NO localStorage) ---
let accessToken = null;

export const setAccessToken = (token) => {
    accessToken = token;
};

export const getAccessToken = () => accessToken;

// --- request interceptor: agrega el access token en memoria ---
axiosInstance.interceptors.request.use((config) => {

    const tempToken = localStorage.getItem("temp_token");

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    } else if (tempToken) {
        config.headers.Authorization = `Bearer ${tempToken}`;
    }

    return config;
}, (error) => Promise.reject(error));

// --- response interceptor: si el access token expiró (401), refresca y reintenta ---
let isRefreshing = false;
let refreshQueue = [];

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        const isAuthRoute = originalRequest.url?.includes("/login")
            || originalRequest.url?.includes("/refresh");

        if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    refreshQueue.push({ resolve, reject, originalRequest });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { data } = await axiosInstance.post("/user/refresh");

                setAccessToken(data.accessToken);

                refreshQueue.forEach(({ resolve, originalRequest: req }) => {
                    req.headers.Authorization = `Bearer ${data.accessToken}`;
                    resolve(axiosInstance(req));
                });
                refreshQueue = [];

                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return axiosInstance(originalRequest);

            } catch (refreshError) {
                refreshQueue.forEach(({ reject }) => reject(refreshError));
                refreshQueue = [];
                setAccessToken(null);
                return Promise.reject(refreshError);

            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;