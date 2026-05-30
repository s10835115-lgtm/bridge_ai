import api from '../api/axios';

export const dashboardService = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
  getActivity: async () => {
    const response = await api.get('/dashboard/activity');
    return response.data;
  },
  getAnalytics: async () => {
    const response = await api.get('/dashboard/analytics');
    return response.data;
  }
};

export const inspectionService = {
  getInspections: async (params) => {
    const response = await api.get('/inspections', { params });
    return response.data;
  },
  getInspection: async (id) => {
    const response = await api.get(`/inspections/${id}`);
    return response.data;
  },
  uploadImage: async (formData) => {
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  createInspection: async (data) => {
    const response = await api.post('/inspections', data);
    return response.data;
  },
  updateInspection: async (id, data) => {
    const response = await api.put(`/inspections/${id}`, data);
    return response.data;
  },
  deleteInspection: async (id) => {
    const response = await api.delete(`/inspections/${id}`);
    return response.data;
  }
};

export const reportService = {
  getReports: async () => {
    const response = await api.get('/reports/');
    return response.data;
  },
  getReport: async (id) => {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  },
  generateAIReport: async (inspectionId) => {
    const response = await api.post(`/ai/generate-report/${inspectionId}`);
    return response.data;
  }
};

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};
