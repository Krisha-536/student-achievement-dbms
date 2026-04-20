// api.js — matches your Express backend exactly
// Routes: GET /api/  | GET /api/pending | POST /api/add | PUT /api/update/:id

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Response interceptor — unwrap data
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const achievementsAPI = {
  // GET /api/  → returns approved achievements
  getApproved: () => api.get('/'),

  // GET /api/pending  → returns all pending achievements
  getPending: () => api.get('/pending'),

  // POST /api/add  → body: { name, roll_no, title, category, level, position }
  submit: (data) => api.post('/add', data),

  // PUT /api/update/:id  → body: { status }
  updateStatus: (id, status) => api.put(`/update/${id}`, { status }),
};

export default api;
