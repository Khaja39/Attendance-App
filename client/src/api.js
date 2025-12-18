// src/api.js
import axios from 'axios';

// Create an instance with the base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/', // Your API domain
  timeout: 5000, // Optional: Time out after 5 seconds
});


// Interceptor to add the JWT token to headers
api.interceptors.request.use((config) => {
    const userString = localStorage.getItem('user');
    if (userString) {
        const userData = JSON.parse(userString);
        // Ensure your Login/Register logic saves the token inside the 'user' object
        if (userData.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
    }
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;