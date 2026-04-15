import { createSlice } from "@reduxjs/toolkit";

const weekTemplate = () => ({
  pages: {} as Record<string, any>,
  assessment: { questions: [] as any[] },
});

const initialState = {
  weeks: {
    week1: weekTemplate(),
    week2: weekTemplate(),
    week3: weekTemplate(),
    week4: weekTemplate(),
    week5: weekTemplate(),
  } as Record<string, ReturnType<typeof weekTemplate>>,
};

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    updateVideoStatus: (state, action) => {
      const { week, page, isCompleted } = action.payload;
      state.weeks[`week${week}`].pages[`page${page}`] = { type: "video", isCompleted };
    },
    updateTextInput: (state, action) => {
      const { week, page, questions } = action.payload;
      state.weeks[`week${week}`].pages[`page${page}`] = { type: "text_input", questions };
    },
    updateObjectives: (state, action) => {
      const { week, page, questions } = action.payload;
      state.weeks[`week${week}`].pages[`page${page}`] = { type: "objectives", questions };
    },
    updateDragAndDrop: (state, action) => {
      const { week, page, items } = action.payload;
      state.weeks[`week${week}`].pages[`page${page}`] = { type: "drag_and_drop", items };
    },
    updateAssessment: (state, action) => {
      const { week, questions } = action.payload;
      state.weeks[`week${week}`].assessment.questions = questions;
    },
    updateAssessmentReview: (state, action) => {
      const { week, review } = action.payload;
      state.weeks[`week${week}`].assessment.review = review;
    },
  },
});

export const {
  updateVideoStatus,
  updateTextInput,
  updateObjectives,
  updateDragAndDrop,
  updateAssessment,
  updateAssessmentReview,
} = feedbackSlice.actions;

export const selectWeekFeedback = (state: any, week: number) => state.feedback.weeks[`week${week}`];
export const selectPageFeedback = (state: any, week: number, page: number) =>
  state.feedback.weeks[`week${week}`].pages[`page${page}`];
export const selectAssessmentFeedback = (state: any, week: number) =>
  state.feedback.weeks[`week${week}`].assessment;

export default feedbackSlice.reducer;
