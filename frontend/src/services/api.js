import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
});

// Add a request interceptor to include the token in all requests
api.interceptors.request.use(
  (config) => {
    // 1. Get the user info from localStorage
    const userString = localStorage.getItem('user');

    if (userString) {
      // 2. Parse the user object to get the token
      const user = JSON.parse(userString);
      if (user && user.token) {
        // 3. Attach the token to the Authorization header
        config.headers['Authorization'] = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

