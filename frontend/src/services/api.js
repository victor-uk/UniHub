import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
});

// This interceptor adds the auth token to every request
api.interceptors.request.use(
  (config) => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      if (user && user.token) {
        config.headers['Authorization'] = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// This is the new interceptor to handle expired sessions
api.interceptors.response.use(
  (response) => response, // Simply return successful responses
  (error) => {
    // Check if the error is a 401 Unauthorized response
    if (error.response && error.response.status === 401) {
      // If the token is invalid, remove the user from storage
      localStorage.removeItem('user');
      
      // Redirect to the login page
      // We also add a message to inform the user what happened
      window.location.href = '/login?sessionExpired=true';
    }
    
    // For all other errors, just pass them along
    return Promise.reject(error);
  }
);


export default api;

