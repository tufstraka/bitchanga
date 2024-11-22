// services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const authService = {
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  verifyEmail: async (token) => {
    try {
      const response = await api.get(`/auth/verify/${token}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
};

// Project Service
export const projectService = {
  createProject: async (projectData) => {
    try {
      const response = await api.post('/projects', projectData);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  getMyProjects: async () => {
    try {
      const response = await api.get('/projects/my-projects');
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  getProject: async (projectId) => {
    try {
      const response = await api.get(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  updateProject: async (projectId, projectData) => {
    try {
      const response = await api.put(`/projects/${projectId}`, projectData);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  deleteProject: async (projectId) => {
    try {
      const response = await api.delete(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
};

// Wallet Service
export const walletService = {
  getBalance: async () => {
    try {
      const response = await api.get('/wallet/balance');
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  connectWallet: async (walletData) => {
    try {
      const response = await api.post('/wallet/connect', walletData);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
};

// Error handling helper
const handleError = (error) => {
  if (error.response) {
    // Server responded with error
    return {
      status: error.response.status,
      ...error.response.data
    };
  } else if (error.request) {
    // Request made but no response
    return {
      status: 503,
      message: 'Service unavailable. Please try again later.'
    };
  } else {
    // Request setup error
    return {
      status: 500,
      message: 'An unexpected error occurred.'
    };
  }
};