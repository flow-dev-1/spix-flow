import { createSlice, createSelector } from "@reduxjs/toolkit";
import { courseContent as tot2CourseContent } from "@/courses/TOT2/data/activity";
import { assessments as tot2Assessments } from "@/courses/TOT2/data/assessment";

const courseData = {
  tot_2: {
    courseContent: tot2CourseContent,
    assessments: tot2Assessments,
  },
};

type CourseKey = keyof typeof courseData;

const calculateMultiStepTotal = (pageData: any): number => {
  if (!pageData?.steps) return 0;

  const hasConsolidatedScenarios = pageData.steps.some(
    (step: any) => step.type === "scenario" && step.subQuestions,
  );
  if (hasConsolidatedScenarios) {
    const scenarioCount = pageData.steps.filter(
      (step: any) => step.type === "scenario" && step.subQuestions,
    ).length;
    return 1 + scenarioCount * 7;
  }

  const hasSonarScenarios = pageData.steps.some(
    (step: any) => step.type === "scenario" && step.sonarSteps,
  );
  if (hasSonarScenarios) {
    const scenarioCount = pageData.steps.filter(
      (step: any) => step.type === "scenario" && step.sonarSteps,
    ).length;
    return 1 + scenarioCount * 2;
  }

  return pageData.steps.length;
};

const initialState = {
  currentCourse: "tot_2" as CourseKey,
  currentWeek: 1,
  currentPage: 1,
  currentStep: 1,
  showReview: false,
  showHurray: false,
};

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setCourse: (state, action) => {
      if (state.currentCourse !== action.payload) {
        state.currentCourse = action.payload;
        state.currentWeek = 1;
        state.currentPage = 1;
        state.currentStep = 1;
      }
    },
    updateCourseFromURL: (state) => {
      state.currentCourse = "tot_2";
      state.currentWeek = 1;
      state.currentPage = 1;
      state.currentStep = 1;
      state.showReview = false;
      state.showHurray = false;
      sessionStorage.setItem("flow-currentWeek", "1");
      sessionStorage.setItem("flow-currentPage", "1");
      sessionStorage.setItem("flow-currentStep", "1");
    },
    setCurrentWeek: (state, action) => { state.currentWeek = action.payload; },
    setCurrentPage: (state, action) => { state.currentPage = action.payload; },
    setCurrentStep: (state, action) => { state.currentStep = action.payload; },
    setShowReview: (state, action) => { state.showReview = action.payload; },
    setShowHurray: (state, action) => { state.showHurray = action.payload; },
    navigateNext: (state) => {
      const { courseContent, assessments } = courseData[state.currentCourse];
      const weekData = courseContent[`week${state.currentWeek}`];
      const totalWeeks = Object.keys(courseContent).length;
      const totalPages = weekData?.pages?.length || 0;
      const isAssessmentPage = state.currentPage > totalPages;
      const isLastWeek = state.currentWeek === totalWeeks;
      const isFirstWeek = state.currentWeek === 1;

      if (isAssessmentPage) {
        const assessmentData = assessments[`week${state.currentWeek}`];
        const totalQuestions = assessmentData?.questions?.length || 0;
        const isLastQuestion = state.currentStep === totalQuestions;
        if (isLastQuestion) {
          if (state.currentWeek === 5) {
            state.showReview = true;
          } else {
            state.showHurray = true;
          }
        } else {
          state.currentStep += 1;
          sessionStorage.setItem("flow-currentStep", String(state.currentStep));
        }
        return;
      }

      const pageData = weekData?.pages.find((page: any) => page.id === state.currentPage);
      const isLastPage = state.currentPage === totalPages;

      let totalSteps = 0;
      if (pageData?.type === "imageDragAndDrop") {
        totalSteps = pageData.steps;
      } else if (pageData?.type === "multiStep") {
        totalSteps = calculateMultiStepTotal(pageData);
      } else if (pageData?.type === "interactiveScenario") {
        totalSteps = pageData.steps?.length || 0;
      } else if (pageData?.type === "multiScenario") {
        totalSteps = pageData.scenarios?.length || 0;
      }

      const isLastStep = state.currentStep === totalSteps;
      const hasAssessment = assessments[`week${state.currentWeek}`]?.questions?.length > 0;

      if (totalSteps > 0 && !isLastStep) {
        state.currentStep += 1;
        sessionStorage.setItem("flow-currentStep", String(state.currentStep));
        return;
      }

      if (isLastPage) {
        if (hasAssessment) {
          state.currentPage += 1;
          state.currentStep = 1;
          sessionStorage.setItem("flow-currentPage", String(state.currentPage));
          sessionStorage.setItem("flow-currentStep", "1");
          return;
        }
        if (!isLastWeek) {
          state.currentWeek += 1;
          state.currentPage = 1;
          state.currentStep = 1;
          sessionStorage.setItem("flow-currentWeek", String(state.currentWeek));
          sessionStorage.setItem("flow-currentPage", "1");
          sessionStorage.setItem("flow-currentStep", "1");
        }
        return;
      }

      if (state.currentPage < totalPages) {
        state.currentPage += 1;
        state.currentStep = 1;
        sessionStorage.setItem("flow-currentPage", String(state.currentPage));
        sessionStorage.setItem("flow-currentStep", "1");
      }
    },
    navigatePrev: (state) => {
      const { courseContent } = courseData[state.currentCourse];
      const weekData = courseContent[`week${state.currentWeek}`];
      const isAssessmentPage = state.currentPage > weekData?.pages.length;

      if (state.showReview) return;

      if (isAssessmentPage) {
        if (state.currentStep > 1) {
          state.currentStep -= 1;
          sessionStorage.setItem("flow-currentStep", String(state.currentStep));
          return;
        }
        state.currentPage = weekData?.pages.length || 1;
        state.currentStep = 1;
        sessionStorage.setItem("flow-currentPage", String(state.currentPage));
        sessionStorage.setItem("flow-currentStep", "1");
        return;
      }

      const pageData = weekData?.pages.find((page: any) => page.id === state.currentPage);
      let totalSteps = 0;
      if (pageData?.type === "imageDragAndDrop") {
        totalSteps = pageData.steps;
      } else if (pageData?.type === "multiStep") {
        totalSteps = calculateMultiStepTotal(pageData);
      } else if (pageData?.type === "interactiveScenario") {
        totalSteps = pageData.steps?.length || 0;
      } else if (pageData?.type === "multiScenario") {
        totalSteps = pageData.scenarios?.length || 0;
      }

      const isFirstPage = state.currentPage === 1;
      const isFirstStep = state.currentStep === 1;
      const isFirstWeek = state.currentWeek === 1;

      if (totalSteps > 0 && !isFirstStep) {
        state.currentStep -= 1;
        sessionStorage.setItem("flow-currentStep", String(state.currentStep));
        return;
      }

      if (isFirstPage) {
        if (!isFirstWeek) {
          state.currentWeek -= 1;
          const prevWeekPages = courseContent[`week${state.currentWeek}`]?.pages.length || 1;
          state.currentPage = prevWeekPages;
          state.currentStep = 1;
          sessionStorage.setItem("flow-currentWeek", String(state.currentWeek));
          sessionStorage.setItem("flow-currentPage", String(state.currentPage));
          sessionStorage.setItem("flow-currentStep", "1");
        }
        return;
      }

      state.currentPage -= 1;
      state.currentStep = 1;
      sessionStorage.setItem("flow-currentPage", String(state.currentPage));
      sessionStorage.setItem("flow-currentStep", "1");
    },
    showReviewPopup: (state) => { state.showReview = true; },
    hideReviewPopup: (state) => {
      state.showReview = false;
      state.showHurray = true;
    },
    hideHurray: (state) => {
      state.showHurray = false;
      const { courseContent } = courseData[state.currentCourse];
      if (state.currentWeek < Object.keys(courseContent).length) {
        state.currentWeek += 1;
        state.currentPage = 1;
        state.currentStep = 1;
        sessionStorage.setItem("flow-currentWeek", String(state.currentWeek));
      }
    },
  },
});

export const {
  setCourse,
  setCurrentWeek,
  setCurrentPage,
  setCurrentStep,
  setShowReview,
  setShowHurray,
  navigateNext,
  navigatePrev,
  showReviewPopup,
  hideReviewPopup,
  hideHurray,
  updateCourseFromURL,
} = navigationSlice.actions;

const selectNavigation = (state: any) => state.navigation;
export const selectCurrentCourse = (state: any) => state.navigation.currentCourse;
export const selectCurrentWeek = (state: any) => state.navigation.currentWeek;
export const selectCurrentPage = (state: any) => state.navigation.currentPage;
export const selectCurrentStep = (state: any) => state.navigation.currentStep;
export const selectShowReview = (state: any) => state.navigation.showReview;
export const selectShowHurray = (state: any) => state.navigation.showHurray;

export const selectPageData = createSelector(
  [selectNavigation],
  (navigation) => {
    const { courseContent, assessments } = courseData[navigation.currentCourse as CourseKey];
    const weekData = courseContent[`week${navigation.currentWeek}`];
    const isAssessmentPage = navigation.currentPage > weekData?.pages.length;
    if (isAssessmentPage) {
      const assessmentData = assessments[`week${navigation.currentWeek}`];
      return { ...assessmentData, currentQuestion: assessmentData?.questions[navigation.currentStep - 1] };
    }
    return weekData?.pages.find((page: any) => page.id === navigation.currentPage);
  },
);

export const selectNavigationState = createSelector(
  [selectNavigation],
  (navigation) => {
    const { courseContent, assessments } = courseData[navigation.currentCourse as CourseKey];
    const weekData = courseContent[`week${navigation.currentWeek}`];
    const totalWeeks = Object.keys(courseContent).length;
    const isAssessmentPage = navigation.currentPage > weekData?.pages.length;

    let pageData: any;
    let totalSteps: number;

    if (isAssessmentPage) {
      pageData = assessments[`week${navigation.currentWeek}`];
      totalSteps = pageData?.questions?.length || 0;
    } else {
      pageData = weekData?.pages.find((page: any) => page.id === navigation.currentPage);
      if (pageData?.type === "imageDragAndDrop") {
        totalSteps = pageData.steps || 0;
      } else if (pageData?.type === "multiStep") {
        totalSteps = calculateMultiStepTotal(pageData);
      } else if (pageData?.type === "multiScenario") {
        totalSteps = pageData.scenarios?.length || 0;
      } else if (pageData?.type === "video" || pageData?.type === "question") {
        totalSteps = 0;
      } else {
        totalSteps = pageData?.steps?.length || 0;
      }
    }

    const totalPages = weekData?.pages.length || 0;

    return {
      isFirstPage: navigation.currentPage === 1,
      isLastPage: !isAssessmentPage && navigation.currentPage === totalPages,
      isFirstStep: navigation.currentStep === 1,
      isLastStep: navigation.currentStep === totalSteps,
      isFirstWeek: navigation.currentWeek === 1,
      isLastWeek: navigation.currentWeek === totalWeeks,
      isAssessmentPage,
      pageData,
      weekData,
      totalSteps,
    };
  },
);

export default navigationSlice.reducer;
