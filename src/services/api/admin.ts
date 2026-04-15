import api from "../index";

class AdminOBJ {
  getMyProfile = async (token: string) => {
    try {
      const response = await api.get(`api/admins/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      throw err?.response?.data || err.message;
    }
  };

  getUserCourseData = async (params1: string, week: number, token: string) => {
    try {
      const response = await api.get(`api/admins/course-enrollment/${params1}/${week}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      return err?.response?.data || err.message;
    }
  };

  getUserCoursePercentile = async (params1: string, week: number, token: string) => {
    try {
      const response = await api.get(`api/admins/course-enrollment/${params1}/percentile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      return err?.response?.data || err.message;
    }
  };

  submitAdminFeedback = async (data: any, params1: string, week: number, userId: string, token: string) => {
    try {
      const response = await api.patch(
        `api/admins/course-enrollment/${params1}/post-activity/${week}/${userId}`,
        { activities: data },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (err: any) {
      return err?.response?.data || err.message;
    }
  };

  submitAssessmentFeedback = async (data: any, params1: string, week: number, userId: string, token: string) => {
    try {
      const response = await api.patch(
        `api/admins/course-enrollment/${params1}/post-assessment/${week}/${userId}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (err: any) {
      return err?.response?.data || err.message;
    }
  };

  generateAIFeedback = async (payload: any, token: string) => {
    try {
      const response = await api.post(`api/admins/generate-ai-feedback`, payload, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 120000,
      });
      return response.data;
    } catch (err: any) {
      return err?.response?.data || err.message;
    }
  };
}

const admin = new AdminOBJ();
export default admin;
