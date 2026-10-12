import api from './api';

export const progressService = {
  async generateReport(classId = null) {
    const response = await api.post('/progress/report', { classId });
    return response.data;
  }
};

export default progressService;
