import axios from "axios";
import { BASE_URL } from "./Base_url";

export const apiClient = axios.create({
    baseURL: BASE_URL, 
    withCredentials: true 
});

// 1. Request Interceptor: Attach the token if we have it
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// 2. Response Interceptor: Handle Token Expiration
apiClient.interceptors.response.use(
    (response) => response, // Pass through successful responses
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 (Unauthorized) and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Call refresh endpoint
                // Note: We use axios directly here or a separate instance 
                // to avoid the interceptor loop
                const response = await axios.get(`${BASE_URL}/auth/refresh`, { 
                    withCredentials: true 
                });
                
                const { accessToken } = response.data;
                localStorage.setItem("accessToken", accessToken);

                // Update the failed request with the new token and retry
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                // If refresh fails, the session is truly dead
                localStorage.removeItem("accessToken");
                window.location.href = "/login"; // Optional: Redirect to login
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);