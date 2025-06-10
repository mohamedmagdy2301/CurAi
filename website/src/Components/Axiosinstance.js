import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'https://mostafa3mad.pythonanywhere.com/'
    //"https://mostafa3mad.pythonanywhere.com/All_doctors/"
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("refresh");

            if (!refreshToken) {
                localStorage.removeItem("token");
                localStorage.removeItem("refresh");
                window.location.href = "/login";
                return Promise.reject(error);
            }

            try {
                
                const response = await axios.post(
                    "https://mostafa3mad.pythonanywhere.com/api/token/refresh/",
                    { refresh: refreshToken }
                );

                localStorage.setItem("token", response.data.access);
                localStorage.setItem("refresh", response.data.refresh);

                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers.Authorization = `Bearer ${response.data.access}`;

                return axiosInstance(originalRequest);
            } catch (error) {
                console.error("⚠️ Failed to refresh token:", error);

                localStorage.removeItem("token");
                localStorage.removeItem("refresh");
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
