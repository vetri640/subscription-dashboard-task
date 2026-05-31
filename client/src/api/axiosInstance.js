import axios from 'axios';
import { store } from '../store';
import { updateAccessToken, logout } from '../store/authSlice';

// Use relative URL so the Vite proxy handles it, avoiding CORS and network issues
const baseURL = import.meta.env.VITE_API_URL || '/api';

const axiosInstance = axios.create({
    baseURL,
    withCredentials: true, // for sending refresh token cookie
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const token = state.auth.accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and it's not a retry
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh token
                const res = await axios.post(
                    `${baseURL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                const { accessToken } = res.data;
                
                // Update redux store
                store.dispatch(updateAccessToken({ accessToken }));

                // Update auth header and retry original request
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // If refresh fails, log out
                store.dispatch(logout());
                // Handle logout side-effect like redirect in components using hooks/events
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
