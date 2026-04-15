// Mock API layer — all calls return instant success so all weeks are testable offline

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

class UserOBJ {
  register = async (_userType: string, _data: any) => {
    await delay();
    return { success: true, message: "Registered (mock)" };
  };

  login = async (_data: any) => {
    await delay();
    return { success: true, token: "mock-token", user: { name: "Test User" } };
  };

  getSingleEnrollment = async (_id: string) => {
    await delay();
    return { success: true, enrollment: { _id: "mock-enrollment", course: { _id: "tot2" } } };
  };

  getUserCourseData = async (_params1: string, _week: number) => {
    await delay();
    return { assessment: null, activity: null };
  };

  submitCourseData = async (_formData: any) => {
    await delay();
    return { success: true, message: "Submitted (mock)" };
  };

  submitUserCourseReaction = async (_courseId: string, _reaction: string) => {
    await delay();
    return { success: true, message: "Reaction saved (mock)" };
  };

  getUserCoursePercentile = async (_params1: string) => {
    await delay();
    return { percentile: 85 };
  };

  getMyActivites = async (_params1: string, _week: number) => {
    await delay();
    return { activities: [] };
  };

  getMyAssessment = async (_params1: string, _week: number) => {
    await delay();
    return { assessments: [] };
  };

  getMyAssessmentFeedback = async (_params1: string, _week: number, _params2: string) => {
    await delay();
    return { assessments: [] };
  };

  getMyActivitesFeedback = async (_params1: string, _week: number, _params2: string) => {
    await delay();
    return { activities: [] };
  };
}

const user = new UserOBJ();
export default user;
