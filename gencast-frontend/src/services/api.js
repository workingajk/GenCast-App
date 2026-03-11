import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to inject the JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor to handle token refresh (optional but recommended)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    // No refresh token, redirect to login
                    return Promise.reject(error);
                }

                const response = await axios.post(`${API_URL}/auth/refresh/`, {
                    refresh: refreshToken
                });

                if (response.status === 200) {
                    localStorage.setItem('accessToken', response.data.access);
                    api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed, logout
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login'; // Or handle via context
            }
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: async (username, password) => {
        const response = await api.post('/auth/login/', { username, password });
        if (response.data.access) {
            localStorage.setItem('accessToken', response.data.access);
            localStorage.setItem('refreshToken', response.data.refresh);
            localStorage.setItem('user', JSON.stringify({ username })); // simplistic user storage
        }
        return response.data;
    },
    register: async (username, email, password) => {
        const response = await api.post('/auth/register/', { username, email, password });
        if (response.data.access) {
            localStorage.setItem('accessToken', response.data.access);
            localStorage.setItem('refreshToken', response.data.refresh);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    },
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        if (userStr) return JSON.parse(userStr);
        return null;
    },
    isAuthenticated: () => {
        return !!localStorage.getItem('accessToken');
    }
};

export const podcastService = {
    // Create a new podcast (Draft/Plan)
    create: async (topic, speakers, characteristics = []) => {
        const response = await api.post('/podcasts/create/', { topic, speakers, characteristics });
        return response.data;
    },

    // Get full details
    get: async (id) => {
        const response = await api.get(`/podcasts/${id}/`);
        return response.data;
    },

    // List all user podcasts
    list: async () => {
        const response = await api.get('/podcasts/');
        return response.data;
    },

    // Get script specifically
    getScript: async (id) => {
        const response = await api.get(`/podcasts/${id}/script/`);
        return response.data;
    },

    // Update script (save changes)
    updateScript: async (id, scriptContent) => {
        const response = await api.put(`/podcasts/${id}/script/`, { script_content: scriptContent });
        return response.data;
    },

    // Generate script via Gemini
    generateScript: async (id) => {
        const response = await api.post(`/podcasts/${id}/generate-script/`);
        return response.data;
    },

    // Generate audio via Edge TTS
    generateAudio: async (id) => {
        const response = await api.post(`/podcasts/${id}/generate-audio/`);
        return response.data;
    },

    // Delete a podcast
    delete: async (id) => {
        const response = await api.delete(`/podcasts/${id}/`);
        return response.data;
    }
};

export default api;
