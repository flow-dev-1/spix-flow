const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

class SchoolOBJ {
  getStudentCourseData = async (_enrollmentId: string, _week: number, _studentId: string) => {
    await delay();
    return { assessment: null, activity: null };
  };
}

const school = new SchoolOBJ();
export default school;
