import { createSlice } from "@reduxjs/toolkit";

const userAnswerSlice = createSlice({
  name: "userAnswer",
  initialState: {
    course: null as string | null,
    courseEnrollmentId: null as string | null,
    week: 1,
    activities: [] as any[],
    assessments: [] as any[],
  },
  reducers: {
    updateData: (state, action) => {
      const { course, courseEnrollmentId, week, activities, assessments } = action.payload;
      state.course = course;
      state.courseEnrollmentId = courseEnrollmentId;
      state.week = week;
      state.activities = activities;
      state.assessments = assessments;
    },
    saveActivity: (state, action) => {
      state.activities = [
        ...state.activities.filter((a) => a.page !== action.payload.page),
        action.payload,
      ];
    },
    saveAssessment: (state, action) => { state.assessments = action.payload; },
    clearData: (state) => {
      state.course = null;
      state.courseEnrollmentId = null;
      state.week = null;
      state.activities = [];
      state.assessments = [];
    },
  },
});

export const { updateData, saveActivity, saveAssessment, clearData } = userAnswerSlice.actions;
export default userAnswerSlice.reducer;

export const userAnswer = (state: any) => state.userAnswer;
