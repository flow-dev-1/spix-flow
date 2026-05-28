import logo from "@/assets/logo.png";
import { Icon } from "@iconify/react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  selectCurrentWeek,
  selectShowReview,
  selectShowHurray,
  selectCurrentPage,
  selectCurrentStep,
  selectCurrentCourse,
  setCurrentWeek,
  setCurrentPage,
  setCurrentStep,
} from "@/store/navigationSlice";
import "./index.css";
// Import components
import PopUp from "./components/ReviewPopUp";
import Hurray from "./components/Hurray";
import { scrollToCourseTopOnMobile } from "../utils/scrollToCourseTop";

// Week 1
import Page1 from "./weeks/week1/page1/Page1.jsx";
import Page2 from "./weeks/week1/page2/Page2.jsx";
import Page3 from "./weeks/week1/page3/Page3.jsx";
import Page4 from "./weeks/week1/page4/Page4.jsx";
import Page5 from "./weeks/week1/page5/Page5.jsx";
import Page6 from "./weeks/week1/page6/Page6.jsx";
import Page7 from "./weeks/week1/page7/Page7.jsx";
import Page8 from "./weeks/week1/page8/Page8.jsx";
import Page9 from "./weeks/week1/page9/Page9";
import Page10 from "./weeks/week1/page10/Page10";
import Page11 from "./weeks/week1/page11/Page11";
import Page12 from "./weeks/week1/page12/Page12.jsx";
import Page13 from "./weeks/week1/page13/Page13";
import Page14 from "./weeks/week1/page14/Page14";
import Page15 from "./weeks/week1/page15/Page15.jsx";
import Page16 from "./weeks/week1/page16/Page16.jsx";
import Page17 from "./weeks/week1/page17/Page17.jsx";
import Page18 from "./weeks/week1/page18/Page18.jsx";
import Page19 from "./weeks/week1/page19/Page19.jsx";
import Page20 from "./weeks/week1/page20/Page20.jsx";
import Page21 from "./weeks/week1/page21/Page21.jsx";
import Page22 from "./weeks/week1/page22/Page22.jsx";
import Page23 from "./weeks/week1/page23/Page23.jsx";
import Page24 from "./weeks/week1/page24/Page24.jsx";
import Page25 from "./weeks/week1/page25/Page25.jsx";

// Week 2
import WeekTwoPage1 from "./weeks/week2/page1/Page1";
import WeekTwoPage2 from "./weeks/week2/page2/Page2";
import WeekTwoPage3 from "./weeks/week2/page3/Page3";
import WeekTwoPage4 from "./weeks/week2/page4/Page4";
import WeekTwoPage5 from "./weeks/week2/page5/Page5";
import WeekTwoPage6 from "./weeks/week2/page6/Page6.jsx";
import WeekTwoPage7 from "./weeks/week2/page7/Page7.jsx";
import WeekTwoPage8 from "./weeks/week2/page8/Page8.jsx";
import WeekTwoPage9 from "./weeks/week2/page9/Page9.jsx";
import WeekTwoPage10 from "./weeks/week2/page10/Page10.jsx";
import WeekTwoPage11 from "./weeks/week2/page11/Page11.jsx";
import WeekTwoPage12 from "./weeks/week2/page12/Page12.jsx";
import WeekTwoPage13 from "./weeks/week2/page13/Page13.jsx";
import WeekTwoPage14 from "./weeks/week2/page14/Page14.jsx";
import WeekTwoPage15 from "./weeks/week2/page15/Page15.jsx";
import WeekTwoPage16 from "./weeks/week2/page16/Page16.jsx";
import WeekTwoPage17 from "./weeks/week2/page17/Page17.jsx";
import WeekTwoAssessment from "./weeks/week2/page18/Page18.jsx";

// Week 3
import WeekThreePage1 from "./weeks/week3/page1/Page1";
import WeekThreePage2 from "./weeks/week3/page2/Page2";
import WeekThreePage3 from "./weeks/week3/page3/Page3";
import WeekThreePage4 from "./weeks/week3/page4/Page4";
import WeekThreePage5 from "./weeks/week3/page5/Page5";
import WeekThreePage6 from "./weeks/week3/page6/Page6";
import WeekThreePage7 from "./weeks/week3/page7/Page7";
import WeekThreePage8 from "./weeks/week3/page8/Page8";
import WeekThreePage9 from "./weeks/week3/page9/Page9";
import WeekThreePage10 from "./weeks/week3/page10/Page10";
import WeekThreePage11 from "./weeks/week3/page11/Page11";
import WeekThreePage12 from "./weeks/week3/page12/Page12";
import WeekThreePage13 from "./weeks/week3/page13/Page13";
import WeekThreePage14 from "./weeks/week3/page14/Page14";

// Week 4
import WeekFourPage1 from "./weeks/week4/page1/Page1";
import WeekFourPage2 from "./weeks/week4/page2/Page2";
import WeekFourPage3 from "./weeks/week4/page3/Page3";
import WeekFourPage4 from "./weeks/week4/page4/Page4";
import WeekFourPage5 from "./weeks/week4/page5/Page5";
import WeekFourPage6 from "./weeks/week4/page6/Page6.jsx";
import WeekFourPage7 from "./weeks/week4/page7/Page7.jsx";
import WeekFourPage8 from "./weeks/week4/page8/Page8.jsx";
import WeekFourPage9 from "./weeks/week4/page9/Page9";
import WeekFourPage10 from "./weeks/week4/page10/Page10";
import WeekFourPage11 from "./weeks/week4/page11/Page11";
import WeekFourPage12 from "./weeks/week4/page12/Page12";
import WeekFourPage13 from "./weeks/week4/page13/Page13";
import WeekFourPage14 from "./weeks/week4/page14/Page14";
import WeekFourPage15 from "./weeks/week4/page15/Page15";
import WeekFourPage16 from "./weeks/week4/page16/Page16";

// Week5
import WeekFivePage1 from "./weeks/week5/page1/Page1.jsx";
import WeekFivePage2 from "./weeks/week5/page2/Page2.jsx";
import WeekFivePage3 from "./weeks/week5/page3/Page3.jsx";
import WeekFivePage4 from "./weeks/week5/page4/Page4.jsx";
import WeekFivePage5 from "./weeks/week5/page5/Page5.jsx";
import WeekFivePage6 from "./weeks/week5/page6/Page6.jsx";
import WeekFivePage7 from "./weeks/week5/page7/page7.jsx";
import WeekFivePage8 from "./weeks/week5/page8/page8.jsx";
import WeekFivePage9 from "./weeks/week5/page9/Page9.jsx";
import WeekFivePage10 from "./weeks/week5/page10/Page10.jsx";
import WeekFivePage11 from "./weeks/week5/page11/Page11.jsx";
import WeekFivePage12 from "./weeks/week5/page12/Page12";
import WeekFivePage13 from "./weeks/week5/page13/Page13";
import WeekFivePage14 from "./weeks/week5/page14/Page14";

// Week 6
import WeekSixPage1 from "./weeks/week6/page1/Page1";
import WeekSixPage2 from "./weeks/week6/page2/Page2";
import WeekSixPage3 from "./weeks/week6/page3/Page3";
import WeekSixPage4 from "./weeks/week6/page4/Page4";
import WeekSixPage5 from "./weeks/week6/page5/Page5";
import WeekSixPage6 from "./weeks/week6/page6/Page6";
import WeekSixPage7 from "./weeks/week6/page7/page7.jsx";
import WeekSixPage8 from "./weeks/week6/page8/Page8";
import WeekSixPage9 from "./weeks/week6/page9/Page9.jsx";
import WeekSixPage10 from "./weeks/week6/page10/Page10";
import WeekSixPage11 from "./weeks/week6/page11/Page11";
import WeekSixPage12 from "./weeks/week6/page12/Page12";
import WeekSixPage13 from "./weeks/week6/page13/Page13";
import WeekSixPage14 from "./weeks/week6/page14/Page14";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import userService from "@/services/api/user";
import {
  updateData,
  userAnswer,
  clearData,
} from "@/store/userAnswersReducer";
import { adminData } from "@/store/adminReducer";

import { logoutSuccess } from "@/store/userReducer";
import { clearToken } from "@/store/jwtReducer";
import { setCourse } from "@/store/navigationSlice";
import { useRespectLaunch } from "@/hooks/useRespectLaunch";
import { useSpixWeekCache } from "@/hooks/useRespectOfflineWarmup";

const TOTAL_WEEKS = 6;
const courseProgressKey = "tot-flowProgress";
const weekProgressKey = (weekNumber) => `tot-week-progress-${weekNumber}`;
const responseKey = (weekNumber) => `tot-flowResponses-week${weekNumber}`;

const getLaunchWeekFromUrl = () => {
  const pathMatch = window.location.pathname.match(/\/tot\/week(\d+)(?:\/index\.html)?\/?$/i);
  if (pathMatch) return Number(pathMatch[1]);

  const params = new URLSearchParams(window.location.search);
  const startWeekParam = params.get("startWeek");
  return startWeekParam ? Number(startWeekParam) : null;
};

const getSavedWeekProgress = (weekNumber) => {
  try {
    const raw =
      localStorage.getItem(weekProgressKey(weekNumber)) ||
      sessionStorage.getItem(weekProgressKey(weekNumber));
    if (!raw) return { page: 1, step: 1 };

    const saved = JSON.parse(raw);
    const page = Number(saved?.page);
    const step = Number(saved?.step);
    return { page: page > 0 ? page : 1, step: step > 0 ? step : 1 };
  } catch {
    return { page: 1, step: 1 };
  }
};

const getSavedCourseProgress = () => {
  try {
    const raw =
      localStorage.getItem(courseProgressKey) ||
      sessionStorage.getItem(courseProgressKey);
    if (!raw) return null;

    const saved = JSON.parse(raw);
    const currentWeek = Number(saved?.currentWeek);
    const currentPage = Number(saved?.currentPage);
    const currentStep = Number(saved?.currentStep);
    const highestWeek = Number(saved?.highestWeek);

    if (!currentWeek || !currentPage || !currentStep) return null;
    return {
      currentWeek,
      currentPage,
      currentStep,
      highestWeek: highestWeek || currentWeek,
    };
  } catch {
    return null;
  }
};

const saveWeekProgress = (weekNumber, page, step) => {
  if (!weekNumber || !page || !step) return;

  const value = JSON.stringify({ page, step });
  try {
    localStorage.setItem(weekProgressKey(weekNumber), value);
    sessionStorage.setItem(weekProgressKey(weekNumber), value);
  } catch {
    // Ignore storage quota/private mode failures.
  }
};

const saveCourseProgressLocally = (weekNumber, page, step, highestWeek) => {
  if (!weekNumber || !page || !step) return;

  const value = JSON.stringify({
    currentWeek: weekNumber,
    currentPage: page,
    currentStep: step,
    highestWeek: Math.max(highestWeek || weekNumber, weekNumber),
  });

  try {
    localStorage.setItem(courseProgressKey, value);
    sessionStorage.setItem(courseProgressKey, value);
  } catch {
    // Ignore storage quota/private mode failures.
  }
};

const getSavedWeekResponsesLocally = (weekNumber) => {
  try {
    const raw = localStorage.getItem(responseKey(weekNumber));
    if (!raw) return null;

    const saved = JSON.parse(raw);
    return {
      activities: Array.isArray(saved?.activities) ? saved.activities : [],
      assessments: Array.isArray(saved?.assessments) ? saved.assessments : [],
    };
  } catch {
    return null;
  }
};

const saveWeekResponsesLocally = (weekNumber, responses) => {
  if (!weekNumber || !responses) return;
  if (!responses.activities?.length && !responses.assessments?.length) return;

  try {
    localStorage.setItem(
      responseKey(weekNumber),
      JSON.stringify({
        activities: responses.activities ?? [],
        assessments: responses.assessments ?? [],
      }),
    );
  } catch {
    // Ignore storage quota/private mode failures.
  }
};

const hasSavedResponses = (responses) => {
  return Boolean(responses?.activities?.length || responses?.assessments?.length);
};

const WeekContent = ({ maxAccessibleWeek, setMaxAccessibleWeek }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userAnswers = useSelector(userAnswer);
  const location = useLocation(); // Get location object
  const [enrollmentId, setEnrollmentId] = useState(null);
  const [course, setCourse] = useState(null);
  const { isAdmin } = useSelector(adminData);

  // Access data from location.state
  const enrolmentData = location.state?.enrollmentData; // Assuming enrollData is passed in state

  useEffect(() => {
    if (enrolmentData?._id) {
      setEnrollmentId(enrolmentData._id);
      setCourse(enrolmentData?.course?._id ?? null);
      return;
    }

    userService.getSingleEnrollment("").then((res) => {
      if (res?.enrollment?._id) {
        setEnrollmentId(res.enrollment._id);
        setCourse(res.enrollment?.course?._id ?? "tot");
      }
    });
  }, []);

  useEffect(() => {
    const currentWeek = sessionStorage.getItem("flow-currentWeek")
      ? Number(sessionStorage.getItem("flow-currentWeek"))
      : 1;
    const currentPage = sessionStorage.getItem("flow-currentPage")
      ? Number(sessionStorage.getItem("flow-currentPage"))
      : 1;
    const currentStep = sessionStorage.getItem("flow-currentStep")
      ? Number(sessionStorage.getItem("flow-currentStep"))
      : 1;

    // Dispatch the current week, page, and step
    dispatch(setCurrentWeek(currentWeek));
    dispatch(setCurrentPage(currentPage));
    dispatch(setCurrentStep(currentStep));

    return () => { };
  }, [dispatch]); // Added dispatch to dependency array

  const currentWeek = useSelector(selectCurrentWeek);
  const currentPage = useSelector(selectCurrentPage);
  const currentStep = useSelector(selectCurrentStep);
  const showReview = useSelector(selectShowReview);
  const showHurray = useSelector(selectShowHurray);
  const { sendCompleted, sendProgressed, restoreProgress, persistProgress, saveResponses, loadResponses } = useRespectLaunch();

  useEffect(() => {
    restoreProgress().then((saved) => {
      const localSaved = getSavedCourseProgress();
      const restored = saved || localSaved;
      let targetWeek = restored?.currentWeek || 1;
      let targetPage = restored?.currentPage || 1;
      let targetStep = restored?.currentStep || 1;
      const highestAuthorizedWeek = Math.max(restored?.highestWeek || 1, targetWeek);

      const launchWeek = getLaunchWeekFromUrl();
      if (launchWeek && launchWeek >= 1 && launchWeek <= TOTAL_WEEKS) {
        const isCompletedLaunchWeek = highestAuthorizedWeek > launchWeek;
        const savedLaunchProgress =
          restored?.currentWeek === launchWeek && !isCompletedLaunchWeek
            ? { page: restored.currentPage, step: restored.currentStep }
            : isCompletedLaunchWeek
              ? { page: 1, step: 1 }
              : getSavedWeekProgress(launchWeek);

        targetWeek = launchWeek;
        targetPage = savedLaunchProgress.page;
        targetStep = savedLaunchProgress.step;
      }

      dispatch(setCurrentWeek(targetWeek));
      dispatch(setCurrentPage(targetPage));
      dispatch(setCurrentStep(targetStep));
      sessionStorage.setItem("flow-currentWeek", String(targetWeek));
      sessionStorage.setItem("flow-currentPage", String(targetPage));
      sessionStorage.setItem("flow-currentStep", String(targetStep));
      saveWeekProgress(targetWeek, targetPage, targetStep);
      saveCourseProgressLocally(targetWeek, targetPage, targetStep, highestAuthorizedWeek);

      setMaxAccessibleWeek((prev) => {
        const next = Math.max(prev, highestAuthorizedWeek, targetWeek);
        sessionStorage.setItem("flow-highestWeek", String(next));
        return next;
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!showHurray) return;

    setMaxAccessibleWeek((prev) => {
      const next = Math.max(prev, currentWeek + 1);
      sessionStorage.setItem("flow-highestWeek", String(next));
      return next;
    });

    if (currentWeek >= TOTAL_WEEKS) {
      sendCompleted(1.0);
    } else {
      sendProgressed(currentWeek / TOTAL_WEEKS);
    }
  }, [showHurray]);

  useEffect(() => {
    if (!currentWeek || !currentPage) return;
    const step = currentStep || Number(sessionStorage.getItem("flow-currentStep") ?? 1);
    const highestWeek = Math.max(currentWeek, maxAccessibleWeek);
    saveWeekProgress(currentWeek, currentPage, step);
    saveCourseProgressLocally(currentWeek, currentPage, step, highestWeek);
    persistProgress({
      currentWeek,
      currentPage,
      currentStep: step,
      highestWeek,
    });
  }, [currentWeek, currentPage, currentStep, maxAccessibleWeek]);

  // toDo: Fetch User assessment and Activity Data
  const { data, isLoading, status, isError } = useQuery({
    queryKey: [
      `dashboard-tot-course-${currentWeek}`,
      enrollmentId,
      currentWeek,
    ],
    queryFn: () => userService.getUserCourseData(enrollmentId, currentWeek),
    enabled: !!enrollmentId && !!currentWeek,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    keepPreviousData: false,
  });

  useEffect(() => {
    if (!data) return;

    const localSaved = getSavedWeekResponsesLocally(currentWeek);
    const serverResponses = {
      activities: data.activity?.activities ?? [],
      assessments: data.assessment?.assessments ?? [],
    };
    const responses = hasSavedResponses(serverResponses)
      ? serverResponses
      : localSaved || serverResponses;

    if (data.assessment && data.activity) {
      dispatch(
        updateData({
          course: course,
          courseEnrollmentId: enrollmentId,
          week: currentWeek,
          activities: responses.activities,
          assessments: responses.assessments,
        }),
      );
    } else {
      dispatch(
        updateData({
          course: course,
          courseEnrollmentId: enrollmentId
            ? enrollmentId
            : userAnswers.courseEnrollmentId,
          week: currentWeek,
          activities: responses.activities,
          assessments: responses.assessments,
        }),
      );
    }

    return () => { };
  }, [data]);

  useEffect(() => {
    if (!currentWeek) return;
    loadResponses(currentWeek).then((saved) => {
      if (!saved) saved = getSavedWeekResponsesLocally(currentWeek);
      if (!saved) return;

      dispatch(
        updateData({
          course: course,
          courseEnrollmentId: enrollmentId ?? userAnswers.courseEnrollmentId,
          week: currentWeek,
          activities: saved.activities,
          assessments: saved.assessments,
        }),
      );
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWeek]);

  useEffect(() => {
    if (!currentWeek) return;
    if (userAnswers.week !== currentWeek) return;
    if (!userAnswers.activities?.length && !userAnswers.assessments?.length) return;

    const responses = {
      activities: userAnswers.activities ?? [],
      assessments: userAnswers.assessments ?? [],
    };

    saveResponses(currentWeek, responses);
    try {
      localStorage.setItem(responseKey(currentWeek), JSON.stringify(responses));
    } catch {
      // Ignore storage quota/private mode failures.
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAnswers.activities, userAnswers.assessments]);

  // If showing hurray, render that instead
  if (showHurray) {
    return <Hurray currentWeek={currentWeek} />;
  }

  // Determine which component to render based on week and page
  const getComponent = () => {
    switch (currentWeek) {
      case 1:
        switch (currentPage) {
          case 1:
            return <Page1 />;
          case 2:
            return <Page2 />;
          case 3:
            return <Page3 />;
          case 4:
            return <Page4 />;
          case 5:
            return <Page5 />;
          case 6:
            return <Page6 />;
          case 7:
            return <Page7 />;
          case 8:
            return <Page8 />;
          case 9:
            return <Page9 />;
          case 10:
            return <Page10 />;
          case 11:
            return <Page11 />;
          case 12:
            return <Page12 />;
          case 13:
            return <Page13 />;
          case 14:
            return <Page14 />;
          case 15:
            return <Page15 />;
          case 16:
            return <Page16 />;
          case 17:
            return <Page17 />;
          case 18:
            return <Page18 />;
          case 19:
            return <Page19 />;
          case 20:
            return <Page20 />;
          case 21:
            return <Page21 />;
          case 22:
            return <Page22 />;

          case 23:
            return <Page23 />;
          case 24:
            return <Page24 />;
          case 25:
            return <Page25 />;
          default:
            return null;
        }
      case 2:
        switch (currentPage) {
          case 1:
            return <WeekTwoPage1 />;
          case 2:
            return <WeekTwoPage2 />;
          case 3:
            return <WeekTwoPage3 />;
          case 4:
            return <WeekTwoPage4 />;
          case 5:
            return <WeekTwoPage5 />;
          case 6:
            return <WeekTwoPage6 />;
          case 7:
            return <WeekTwoPage7 />;
          case 8:
            return <WeekTwoPage8 />;
          case 9:
            return <WeekTwoPage9 />;
          case 10:
            return <WeekTwoPage10 />;
          case 11:
            return <WeekTwoPage11 />;
          case 12:
            return <WeekTwoPage12 />;
          case 13:
            return <WeekTwoPage13 />;
          case 14:
            return <WeekTwoPage14 />;
          case 15:
            return <WeekTwoPage15 />;
          case 16:
            return <WeekTwoPage16 />;
          case 17:
            return <WeekTwoPage17 />;
          case 18:
            return <WeekTwoAssessment />;
          default:
            return null;
        }
      case 3:
        switch (currentPage) {
          case 1:
            return <WeekThreePage1 />;
          case 2:
            return <WeekThreePage2 />;
          case 3:
            return <WeekThreePage3 />;
          case 4:
            return <WeekThreePage4 />;
          case 5:
            return <WeekThreePage5 />;
          case 6:
            return <WeekThreePage6 />;
          case 7:
            return <WeekThreePage7 />;
          case 8:
            return <WeekThreePage8 />;
          case 9:
            return <WeekThreePage9 />;
          case 10:
            return <WeekThreePage10 />;
          case 11:
            return <WeekThreePage11 />;
          case 12:
            return <WeekThreePage12 />;
          case 13:
            return <WeekThreePage13 />;
          case 14:
            return <WeekThreePage14 />;

          default:
            return null;
        }
      case 4:
        switch (currentPage) {
          case 1:
            return <WeekFourPage1 />;
          case 2:
            return <WeekFourPage2 />;
          case 3:
            return <WeekFourPage3 />;
          case 4:
            return <WeekFourPage4 />;
          case 5:
            return <WeekFourPage5 />;
          case 6:
            return <WeekFourPage6 />;
          case 7:
            return <WeekFourPage7 />;
          case 8:
            return <WeekFourPage8 />;
          case 9:
            return <WeekFourPage9 />;
          case 10:
            return <WeekFourPage10 />;
          case 11:
            return <WeekFourPage11 />;
          case 12:
            return <WeekFourPage12 />;
          case 13:
            return <WeekFourPage13 />;
          case 14:
            return <WeekFourPage14 />;
          case 15:
            return <WeekFourPage15 />;
          case 16:
            return <WeekFourPage16 />;
          default:
            return null;
        }
      case 5:
        switch (currentPage) {
          case 1:
            return <WeekFivePage1 />;
          case 2:
            return <WeekFivePage2 />;
          case 3:
            return <WeekFivePage3 />;
          case 4:
            return <WeekFivePage4 />;
          case 5:
            return <WeekFivePage5 />;
          case 6:
            return <WeekFivePage6 />;
          case 7:
            return <WeekFivePage7 />;
          case 8:
            return <WeekFivePage8 />;
          case 9:
            return <WeekFivePage9 />;
          case 10:
            return <WeekFivePage10 />;
          case 11:
            return <WeekFivePage11 />;
          case 12:
            return <WeekFivePage12 />;
          case 13:
            return <WeekFivePage13 />;
          case 14:
            return <WeekFivePage14 />;
          default:
            return null;
        }
      case 6:
        switch (currentPage) {
          case 1:
            return <WeekSixPage1 />;
          case 2:
            return <WeekSixPage2 />;
          case 3:
            return <WeekSixPage3 />;
          case 4:
            return <WeekSixPage4 />;
          case 5:
            return <WeekSixPage5 />;
          case 6:
            return <WeekSixPage6 />;
          case 7:
            return <WeekSixPage7 />;
          case 8:
            return <WeekSixPage8 />;
          case 9:
            return <WeekSixPage9 />;
          case 10:
            return <WeekSixPage10 />;
          case 11:
            return <WeekSixPage11 />;
          case 12:
            return <WeekSixPage12 />;
          case 13:
            return <WeekSixPage13 />;
          case 14:
            return <WeekSixPage14 />;
          default:
            return null;
        }
      default:
        return null;
    }
  };

  return (
    <>
      {getComponent()}
      {showReview && <PopUp />}
    </>
  );
};

const CourseContent = () => {
  const { isAdmin } = useSelector(adminData);
  const currentCourse = useSelector(selectCurrentCourse);
  const currentWeek = useSelector(selectCurrentWeek);
  const currentPage = useSelector(selectCurrentPage);
  const currentStep = useSelector(selectCurrentStep);
  const currentUserAnswers = useSelector(userAnswer);
  useSpixWeekCache(currentWeek, "tot", TOTAL_WEEKS);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [menuVisible, setMenuVisible] = useState(false);
  const [enrollmentProgress, setEnrollmentProgress] = useState(0);
  const [maxAccessibleWeek, setMaxAccessibleWeek] = useState(
    () => Number(sessionStorage.getItem("flow-highestWeek") ?? 1),
  );
  const [enrollmentId, setEnrollmentId] = useState(null);

  const weeksTopic = [
    "Understanding SEL & Positive Psychology",
    "Self-Awareness & Emotional Regulation",
    "Building Relationships & Creating a Safe Classroom",
    "Growth Mindset & Resilience for Educators",
    "Integrating SEL into Teaching Methods",
    "Teacher Well-being & Sustainable SEL Practices",
  ];

  // Get enrollment data from location state
  const enrolmentData = location.state?.enrollmentData;

  // Capture enrollmentId from location state on mount
  useEffect(() => {
    if (enrolmentData?._id) {
      setEnrollmentId(enrolmentData._id);
    }
  }, []);

  // Derive progress locally from the highest week reached. This mirrors TOT2:
  // week cards are launchable, while progress/checkmarks remain informational.
  useEffect(() => {
    saveWeekProgress(currentWeek, currentPage, currentStep);
    saveCourseProgressLocally(currentWeek, currentPage, currentStep, maxAccessibleWeek);

    setMaxAccessibleWeek((prev) => {
      const next = Math.max(prev, currentWeek);
      sessionStorage.setItem("flow-highestWeek", String(next));

      const progressPerWeek = 100 / weeksTopic.length;
      const completedWeeks = next - 1;
      setEnrollmentProgress(Math.round(Math.min(completedWeeks * progressPerWeek, 100)));

      return next;
    });
  }, [currentWeek, currentPage, currentStep, weeksTopic.length]);

  useEffect(() => {
    const segments = location.pathname.split("/").filter(Boolean);
    const courseSegment = segments[0]?.toLowerCase();

    // This is an important section that affects course rendering!
    if (courseSegment === "tot") {
      dispatch(setCourse("tot"));
    }
  }, [location.pathname, dispatch]);

  if (currentCourse !== "tot") {
    return null;
  }

  const handleWeekClick = (weekNumber) => {
    saveWeekProgress(currentWeek, currentPage, currentStep);
    if (currentUserAnswers?.week === currentWeek) {
      saveWeekResponsesLocally(currentWeek, currentUserAnswers);
    }

    const isCompletedWeek = maxAccessibleWeek > weekNumber;
    const savedProgress = isCompletedWeek
      ? { page: 1, step: 1 }
      : getSavedWeekProgress(weekNumber);

    dispatch(clearData());
    dispatch(setCurrentWeek(weekNumber));
    dispatch(setCurrentPage(savedProgress.page));
    dispatch(setCurrentStep(savedProgress.step));
    saveWeekProgress(weekNumber, savedProgress.page, savedProgress.step);
    saveCourseProgressLocally(weekNumber, savedProgress.page, savedProgress.step, maxAccessibleWeek);

    sessionStorage.setItem("flow-currentWeek", weekNumber.toString());
    sessionStorage.setItem("flow-currentPage", String(savedProgress.page));
    sessionStorage.setItem("flow-currentStep", String(savedProgress.step));
    scrollToCourseTopOnMobile();
  };

  const isWeekAccessible = (weekNumber) => {
    return true;
  };

  const isWeekCompleted = (weekNumber) => {
    // A week is completed if the user has progressed beyond it
    const progressPerWeek = 100 / weeksTopic.length;
    return enrollmentProgress >= weekNumber * progressPerWeek;
  };

  const logOut = () => {
    localStorage.clear();
    sessionStorage.clear();
    dispatch(logoutSuccess());
    dispatch(clearToken());
    dispatch(
      updateData({
        course: null,
        courseEnrollmentId: null,
        week: 1,
        activities: [],
        assessments: [],
      }),
    );
    navigate("/", { replace: true });
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <>
      <nav className="navbar tot-course-navbar">
        <div className="container">
          <button
            disabled={isAdmin}
            onClick={() => navigate("/courses")}
            className="navbar-logo"
            style={{ border: "none", background: "#FFF" }}
          >
            <img src={logo} alt="" />
          </button>
          <div
            className="navbar-logo d-none d-lg-block"
            onClick={logOut}
            style={{ cursor: "pointer" }}
          >
            Logout
          </div>

          <div className="d-none">
            <Icon
              icon="mdi:menu"
              width={30}
              onClick={toggleMenu}
              style={{
                cursor: "pointer",
              }}
            />
            {menuVisible && (
              <div
                className="d-lg-none position-absolute"
                style={{
                  top: "30px",
                  left: "-100px",
                  borderRadius: "15px",
                  border: "1px solid rgba(244, 241, 241, 0.9)",
                }}
              >
                <div
                  style={{
                    cursor: "pointer",
                    overflow: "hidden",
                    borderRadius: "15px",
                    background: "rgba(255,255,255,0.9)",
                  }}
                  className="border-5 px-4 pt-4 pb-1"
                >
                  <ul className="d-flex gap-3 flex-column">
                    <li className="">
                      <Link to={"/dashboard"}>Overview</Link>
                    </li>
                    <li className="">
                      <Link to={"/dashboard/profile"}>Profile</Link>
                    </li>
                    <li className="">
                      <Link to={"/dashboard/my-courses"}>MyCourse</Link>
                    </li>
                    <li className="">
                      <Link to={"/dashboard/support"}>Support</Link>
                    </li>
                    <li className="text-nowrap">
                      <Link to={"/dashboard/payment-history"}>
                        Payment History
                      </Link>
                    </li>
                    <li className=" text-danger" onClick={logOut}>
                      Log Out
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="main-content tot-course-main flex-column-reverse flex-md-row">
        <aside className="d-md-none d-lg-block aside-class">
          <button
            disabled={isAdmin}
            onClick={() => navigate("/courses")}
            className="back fs-6 d-none d-lg-block"
            style={{ cursor: "pointer", border: "none", background: "#f8f5f5" }}
          >
            <Icon icon="fa6-solid:arrow-left-long" className="me-2" />
            Back to My Courses
          </button>

          <div className="tot-title">
            <h2 className="fs-5 fs-md-3 tot-nav-text">
              SEL & Positive Psychology for Educators:
            </h2>
            <h2 className="compassion fs-5 tot-nav-text">
              Feel It. Teach It. Transform Lives.
            </h2>
          </div>

          <ul className="compassion-list">
            {weeksTopic.map((item, index) => {
              const weekNumber = index + 1;
              const isAccessible = isWeekAccessible(weekNumber);
              const isCompleted = isWeekCompleted(weekNumber);
              const isActive = weekNumber === currentWeek;

              return (
                <li
                  key={index}
                  className={`${isActive ? "active-week" : ""} ${isAccessible ? "accessible-week" : "locked-week"
                    }`}
                  onClick={() => handleWeekClick(weekNumber)}
                  style={{
                    cursor: isAccessible ? "pointer" : "not-allowed",
                    opacity: isAccessible ? 1 : 0.5,
                    transition: "all 0.3s ease",
                  }}
                >
                  <div className="icon">
                    <Icon
                      icon={
                        isCompleted
                          ? "icon-park-solid:check-one"
                          : isAccessible
                            ? "icon-park-outline:check-one"
                            : "mdi:lock"
                      }
                      className="course-list-icon"
                    />
                  </div>
                  <span style={{ whiteSpace: "nowrap" }}>
                    Week {weekNumber}
                  </span>
                  <span className="">{item}</span>
                </li>
              );
            })}
          </ul>

          {/* Progress indicator */}
          <div className="mt-4 px-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <small className="text-muted">Course Progress</small>
              <small className="fw-bold">{enrollmentProgress}%</small>
            </div>
            <div className="progress" style={{ height: "8px" }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{
                  width: `${enrollmentProgress}%`,
                  backgroundColor: "#00BCC3",
                }}
                aria-valuenow={enrollmentProgress}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </div>
        </aside>

        <aside
          className="d-none d-md-block d-lg-none"
          style={{
            flexBasis: "0px",
            background: "#00BCC3",
          }}
        >
          <button
            disabled={isAdmin}
            onClick={() => navigate("/courses")}
            className="p-3"
            style={{
              cursor: "pointer",
              border: "none",
              background: "#f8f5f5",
              borderRadius: "50%",
            }}
          >
            <Icon icon="mdi:arrow-right" width="20" height="20" />
          </button>
        </aside>

        <section className="week-content resilience-week-content position-relative">
          <WeekContent maxAccessibleWeek={maxAccessibleWeek} setMaxAccessibleWeek={setMaxAccessibleWeek} />
        </section>
      </div>
    </>
  );
};

const TOTCourse = () => {
  return <CourseContent />;
};

export default TOTCourse;
