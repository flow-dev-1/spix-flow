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
  hideReviewPopup,
} from "@/store/navigationSlice";
import "./index.css";

// Import components
import PopUp from "./components/ReviewPopUp";
import Hurray from "./components/Hurray";
import { scrollToCourseTopOnMobile } from "../utils/scrollToCourseTop";

// Week 1
import Page1 from "./weeks/week1/page1/Page1";
import Page2 from "./weeks/week1/page2/Page2";
import Page3 from "./weeks/week1/page3/Page3";
import Page4 from "./weeks/week1/page4/Page4";
import Page5 from "./weeks/week1/page5/Page5";
import Page6 from "./weeks/week1/page6/Page6";
import Page7 from "./weeks/week1/page7/Page7";
import Page8 from "./weeks/week1/page8/Page8";
import Page9 from "./weeks/week1/page9/Page9";
import Page10 from "./weeks/week1/page10/Page10";
import Page11 from "./weeks/week1/page11/Page11";
import Page12 from "./weeks/week1/page12/Page12";
import Page13 from "./weeks/week1/page13/Page13";
import Page14 from "./weeks/week1/page14/Page14";

// Week 2
import WeekTwoPage1 from "./weeks/week2/page1/Page1";
import WeekTwoPage2 from "./weeks/week2/page2/Page2";
import WeekTwoPage3 from "./weeks/week2/page3/Page3";
import WeekTwoPage4 from "./weeks/week2/page4/Page4";
import WeekTwoPage5 from "./weeks/week2/page5/Page5";
import WeekTwoPage6 from "./weeks/week2/page6/Page6";

// Week 3
import WeekThreePage1 from "./weeks/week3/page1/Page1";
import WeekThreePage2 from "./weeks/week3/page2/Page2";
import WeekThreePage3 from "./weeks/week3/page3/Page3";
import WeekThreePage4 from "./weeks/week3/page4/Page4";
import WeekThreePage5 from "./weeks/week3/page5/Page5";
import WeekThreePage6 from "./weeks/week3/page6/Page6";
import WeekThreePage7 from "./weeks/week3/page7/Page7";
import WeekThreePage8 from "./weeks/week3/page8/Page8";

// Week 4
import WeekFourPage1 from "./weeks/week4/page1/Page1";
import WeekFourPage2 from "./weeks/week4/page2/Page2";
import WeekFourPage3 from "./weeks/week4/page3/Page3";
import WeekFourPage4 from "./weeks/week4/page4/Page4";
import WeekFourPage5 from "./weeks/week4/page5/Page5";
import WeekFourPage6 from "./weeks/week4/page6/Page6.jsx";
import WeekFourPage7 from "./weeks/week4/page7/Page7.jsx";
import WeekFourPage8 from "./weeks/week4/page8/Page8.jsx";

// Week5
import WeekFivePage1 from "./weeks/week5/page1/Page1.jsx";
import WeekFivePage2 from "./weeks/week5/page2/Page2.jsx";
import WeekFivePage3 from "./weeks/week5/page3/Page3.jsx";
import WeekFivePage4 from "./weeks/week5/page4/Page4.jsx";
import WeekFivePage5 from "./weeks/week5/page5/Page5.jsx";
import WeekFivePage6 from "./weeks/week5/page6/Page6.jsx";

// Week6
import WeekSixPage1 from "./weeks/week6/page1/Page1.jsx";
import WeekSixPage2 from "./weeks/week6/page2/Page2.jsx";
import WeekSixPage3 from "./weeks/week6/page3/Page3.jsx";
import WeekSixPage4 from "./weeks/week6/page4/Page4.jsx";
import WeekSixPage5 from "./weeks/week6/page5/Page5.jsx";
import WeekSixPage6 from "./weeks/week6/page6/Page6.jsx";
import WeekSixPage7 from "./weeks/week6/page7/Page7.jsx";
import WeekSixPage8 from "./weeks/week6/page8/Page8.jsx";
import WeekSixPage9 from "./weeks/week6/page9/Page9.jsx";
import WeekSixPage10 from "./weeks/week6/page10/Page10.jsx";
import WeekSixPage11 from "./weeks/week6/page11/Page11.jsx";
import WeekSixPage12 from "./weeks/week6/page12/Page12.jsx";
import WeekSixPage13 from "./weeks/week6/page13/Page13.jsx";

// Week 7
import WeekSevenPage1 from "./weeks/week7/page1/Page1.jsx";
import WeekSevenPage2 from "./weeks/week7/page2/Page2.jsx";
import WeekSevenPage3 from "./weeks/week7/page3/Page3.jsx";
import WeekSevenPage4 from "./weeks/week7/page4/Page4.jsx";
import WeekSevenPage5 from "./weeks/week7/page5/Page5.jsx";
import WeekSevenPage6 from "./weeks/week7/page6/Page6.jsx";

// Week 8
import WeekEightPage1 from "./weeks/week8/page1/Page1.jsx";
import WeekEightPage2 from "./weeks/week8/page2/Page2.jsx";
import WeekEightPage3 from "./weeks/week8/page3/Page3.jsx";
import WeekEightPage4 from "./weeks/week8/page4/Page4.jsx";
import WeekEightPage5 from "./weeks/week8/page5/Page5.jsx";
import WeekEightPage6 from "./weeks/week8/page6/Page6.jsx";
import WeekEightPage7 from "./weeks/week8/page7/Page7.jsx";
import WeekEightPage8 from "./weeks/week8/page8/Page8.jsx";

// Week 9
import WeekNinePage1 from "./weeks/week9/page1/Page1.jsx";
import WeekNinePage2 from "./weeks/week9/page2/Page2.jsx";
import WeekNinePage3 from "./weeks/week9/page3/Page3.jsx";
import WeekNinePage4 from "./weeks/week9/page4/Page4.jsx";
import WeekNinePage5 from "./weeks/week9/page5/Page5.jsx";
import WeekNinePage6 from "./weeks/week9/page6/Page6.jsx";
import WeekNinePage7 from "./weeks/week9/page7/Page7.jsx";
import WeekNinePage8 from "./weeks/week9/page8/Page8.jsx";

// Week 10
import WeekTenPage1 from "./weeks/week10/page1/Page1.jsx";
import WeekTenPage2 from "./weeks/week10/page2/Page2.jsx";
import WeekTenPage3 from "./weeks/week10/page3/Page3.jsx";
import WeekTenPage4 from "./weeks/week10/page4/Page4.jsx";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import userService from "@/services/api/user";
import {
  updateData,
  userAnswer,
  clearData,
} from "@/store/userAnswersReducer";
import { adminData } from "@/store/adminReducer";

import { setCourse } from "@/store/navigationSlice";
import { logoutSuccess } from "@/store/userReducer";
import { clearToken } from "@/store/jwtReducer";
import { useRespectLaunch } from "@/hooks/useRespectLaunch";
import { getRespectLaunchTarget } from "@/services/xapi";
import { getWeekAssessment } from "./data";
import { calculateResult } from "./utility";
import { useSpixWeekCache } from "@/hooks/useRespectOfflineWarmup";

const TOTAL_WEEKS = 10;
const courseProgressKey = "transition-flowProgress";
const weekProgressKey = (weekNumber) => `transition-week-progress-${weekNumber}`;
const responseKey = (weekNumber) => `transition-flowResponses-week${weekNumber}`;

const getLaunchWeekFromUrl = () => {
  const pathMatch = window.location.pathname.match(
    /\/transition\/week(\d+)(?:\/index\.html)?\/?$/i,
  );
  if (pathMatch) return Number(pathMatch[1]);

  const params = new URLSearchParams(window.location.search);
  const activityWeek = getRespectLaunchTarget(params.get("activity_id") ?? "")?.week;
  if (activityWeek) return activityWeek;

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
    highestWeek: Math.min(Math.max(highestWeek || weekNumber, weekNumber), TOTAL_WEEKS),
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

const calculateAssessmentScore = (weekNumber, answers) => {
  const questions = getWeekAssessment(weekNumber)?.questions ?? [];
  const percentage = calculateResult(questions, answers, questions.length);
  const raw = questions.reduce((score, question) => score + (answers?.find((answer) => answer.id === question.id)?.value === question.correctOption ? 1 : 0), 0);
  return { raw, min: 0, max: questions.length, scaled: percentage / 100 };
};
const WeekContent = ({ maxAccessibleWeek, setMaxAccessibleWeek }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userAnswers = useSelector(userAnswer);
  const location = useLocation(); // Get location object
  const [enrollmentId, setEnrollmentId] = useState(null);
  const [course, setCourse] = useState(null);
  const { isAdmin } = useSelector(adminData);
  const {
    isRespectSession,
    launchParams,
    launchTarget,
    sendCompleted,
    sendPassed,
    sendProgressed,
    restoreProgress,
    persistProgress,
    saveResponses,
    loadResponses,
  } = useRespectLaunch();
  const completedWeeksRef = useRef(new Set());
  const trackedStatementsInFlightRef = useRef(new Set());
  const respectProgressReadyRef = useRef(!isRespectSession);
  const respectResponsesReadyWeekRef = useRef(null);
  const [isRespectProgressReady, setIsRespectProgressReady] = useState(!isRespectSession);

  // Access data from location.state
  const enrolmentData = location.state?.enrollmentData; // Assuming enrollData is passed in state

  useEffect(() => {
    if (isRespectSession) {
      setEnrollmentId(null);
      setCourse("transition");
      return;
    }

    if (enrolmentData?._id) {
      setEnrollmentId(enrolmentData._id);
      setCourse(enrolmentData?.course?._id ?? null);
      return;
    }

    userService.getSingleEnrollment("").then((res) => {
      if (res?.enrollment?._id) {
        setEnrollmentId(res.enrollment._id);
        setCourse("transition");
      }
    });
  }, [enrolmentData, isRespectSession]);

  useEffect(() => {
    const launchedWeek = getLaunchWeekFromUrl();
    const currentWeek = launchedWeek ?? (sessionStorage.getItem("flow-currentWeek") ? Number(sessionStorage.getItem("flow-currentWeek")) : 1);
    const currentPage = launchedWeek ? 1 : (sessionStorage.getItem("flow-currentPage") ? Number(sessionStorage.getItem("flow-currentPage")) : 1);
    const currentStep = launchedWeek ? 1 : (sessionStorage.getItem("flow-currentStep") ? Number(sessionStorage.getItem("flow-currentStep")) : 1);

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

  useEffect(() => {
    if (isRespectSession && showReview) {
      dispatch(hideReviewPopup());
    }
  }, [dispatch, isRespectSession, showReview]);

  useEffect(() => {
    restoreProgress().then((saved) => {
      const localSaved = isRespectSession ? null : getSavedCourseProgress();
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
              : isRespectSession
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
        const next = isRespectSession
          ? Math.min(Math.max(highestAuthorizedWeek, targetWeek), TOTAL_WEEKS)
          : Math.min(Math.max(prev, highestAuthorizedWeek, targetWeek), TOTAL_WEEKS);
        sessionStorage.setItem("flow-highestWeek", String(next));
        return next;
      });
      respectProgressReadyRef.current = true;
      setIsRespectProgressReady(true);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!showHurray) return;
    if (isRespectSession && launchTarget?.week !== currentWeek) return;

    if (isRespectSession && currentWeek <= 5) {
      const score = calculateAssessmentScore(currentWeek, userAnswers.assessments);
      const identity = launchParams?.registration || launchParams?.actor || "local";
      const getStatementId = (verb) => {
        const key = `transition-xapi-${identity}-week-${currentWeek}-${verb}-statement-id`;
        let id = sessionStorage.getItem(key);
        if (!id) {
          id = crypto.randomUUID();
          sessionStorage.setItem(key, id);
        }
        return id;
      };
      const statements = [
        ["completed", () => sendCompleted(score.scaled, getStatementId("completed"))],
        ["passed", () => sendPassed({ score }, getStatementId("passed"))],
        ["progressed", () => sendProgressed(currentWeek / TOTAL_WEEKS, getStatementId("progressed"))],
      ];
      void Promise.all(statements.map(async ([verb, send]) => {
        const deliveryKey = `transition-xapi-${identity}-week-${currentWeek}-${verb}-delivered`;
        if (sessionStorage.getItem(deliveryKey) || trackedStatementsInFlightRef.current.has(deliveryKey)) return;
        trackedStatementsInFlightRef.current.add(deliveryKey);
        const delivered = await send();
        trackedStatementsInFlightRef.current.delete(deliveryKey);
        if (delivered) sessionStorage.setItem(deliveryKey, "1");
      }));
      return;
    }
    if (isRespectSession) return;

    setMaxAccessibleWeek((prev) => {
      const next = Math.min(Math.max(prev, currentWeek + 1), TOTAL_WEEKS);
      sessionStorage.setItem("flow-highestWeek", String(next));
      return next;
    });

    const registrationKey = launchParams?.registration || "local";
    const completionKey = `transition-xapi-completed-${registrationKey}-week-${currentWeek}`;
    if (completedWeeksRef.current.has(completionKey) || sessionStorage.getItem(completionKey)) return;

    completedWeeksRef.current.add(completionKey);
    sessionStorage.setItem(completionKey, "1");
    void (async () => {
      await sendCompleted();
      await sendPassed({ score: { scaled: 1 } });
    })();

    if (currentWeek < TOTAL_WEEKS) {
      void sendProgressed(currentWeek / TOTAL_WEEKS);
    }
  }, [showHurray, currentWeek, isRespectSession, launchParams?.registration, launchTarget?.week, sendCompleted, sendPassed, sendProgressed]);

  useEffect(() => {
    if (!currentWeek || !currentPage) return;
    if (isRespectSession && !respectProgressReadyRef.current) return;
    const step = currentStep || Number(sessionStorage.getItem("flow-currentStep") ?? 1);
    const highestWeek = Math.min(Math.max(currentWeek, maxAccessibleWeek), TOTAL_WEEKS);
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
      `dashboard-transition-course-${currentWeek}`,
      enrollmentId,
      currentWeek,
    ],
    queryFn: () => userService.getUserCourseData(enrollmentId, currentWeek),
    enabled: !isRespectSession && !!enrollmentId && !!currentWeek,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    keepPreviousData: false,
  });

  // console.log(data,"Course data here")

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
    if (isRespectSession && !isRespectProgressReady) return;
    const weekToRestore = currentWeek;
    if (isRespectSession) respectResponsesReadyWeekRef.current = null;
    loadResponses(weekToRestore).then((saved) => {
      if (!saved && !isRespectSession) saved = getSavedWeekResponsesLocally(weekToRestore);
      if (!saved && !isRespectSession) return;
      const restored = saved ?? { activities: [], assessments: [] };
      if (isRespectSession) respectResponsesReadyWeekRef.current = weekToRestore;

      dispatch(
        updateData({
          course: course,
          courseEnrollmentId: enrollmentId ?? userAnswers.courseEnrollmentId,
          week: weekToRestore,
          activities: restored.activities,
          assessments: restored.assessments,
        }),
      );
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWeek, isRespectProgressReady]);

  useEffect(() => {
    if (!currentWeek) return;
    if (isRespectSession && respectResponsesReadyWeekRef.current !== currentWeek) return;
    if (userAnswers.week !== currentWeek) return;
    if (!userAnswers.activities?.length && !userAnswers.assessments?.length) return;

    const responses = {
      activities: userAnswers.activities ?? [],
      assessments: userAnswers.assessments ?? [],
    };

    saveResponses(currentWeek, responses);
    saveWeekResponsesLocally(currentWeek, responses);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAnswers.activities, userAnswers.assessments]);

  if (isRespectSession && !isRespectProgressReady) {
    return (
      <div className="d-flex min-vh-50 align-items-center justify-content-center py-5">
        <div className="spinner-border text-info" role="status" aria-label="Loading course" />
      </div>
    );
  }

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
          default:
            return null;
        }
      case 7:
        switch (currentPage) {
          case 1:
            return <WeekSevenPage1 />;
          case 2:
            return <WeekSevenPage2 />;
          case 3:
            return <WeekSevenPage3 />;
          case 4:
            return <WeekSevenPage4 />;
          case 5:
            return <WeekSevenPage5 />;
          case 6:
            return <WeekSevenPage6 />;
          default:
            return null;
        }

      case 8:
        switch (currentPage) {
          case 1:
            return <WeekEightPage1 />;
          case 2:
            return <WeekEightPage2 />;
          case 3:
            return <WeekEightPage3 />;
          case 4:
            return <WeekEightPage4 />;
          case 5:
            return <WeekEightPage5 />;
          case 6:
            return <WeekEightPage6 />;
          case 7:
            return <WeekEightPage7 />;
          case 8:
            return <WeekEightPage8 />;
          default:
            return null;
        }

      case 9:
        switch (currentPage) {
          case 1:
            return <WeekNinePage1 />;
          case 2:
            return <WeekNinePage2 />;
          case 3:
            return <WeekNinePage3 />;
          case 4:
            return <WeekNinePage4 />;
          case 5:
            return <WeekNinePage5 />;
          case 6:
            return <WeekNinePage6 />;
          case 7:
            return <WeekNinePage7 />;
          case 8:
            return <WeekNinePage8 />;
          default:
            return null;
        }

      case 10:
        switch (currentPage) {
          case 1:
            return <WeekTenPage1 />;
          case 2:
            return <WeekTenPage2 />;
          case 3:
            return <WeekTenPage3 />;
          case 4:
            return <WeekTenPage4 />;
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
      {showReview && !isRespectSession && <PopUp />}
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
  const { launchTarget: respectLaunchTarget } = useRespectLaunch();
  useSpixWeekCache(currentWeek, "transition", TOTAL_WEEKS);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [menuVisible, setMenuVisible] = useState(false);

  const weeksTopic = [
    "Introduction To Transition. Also Talk About ‘Your Why’",
    "Growth And Fixed Mindset",
    "Understanding What Is In Your Control",
    "Understanding Values",
    `Emotional Intelligence`,
    "Social Skills (Navigating Relationships)",
    "Time Management",
    "Goal Setting",
    "Resilience And Introduction To Coping Skills",
    "Looking Ahead",
  ];

  const [enrollmentProgress, setEnrollmentProgress] = useState(0);
  const [maxAccessibleWeek, setMaxAccessibleWeek] = useState(
    () => Number(sessionStorage.getItem("flow-highestWeek") ?? 1),
  );

  // Access data from location.state
  const enrolmentData = location.state?.enrollmentData;

  useEffect(() => {
    saveWeekProgress(currentWeek, currentPage, currentStep);
    saveCourseProgressLocally(currentWeek, currentPage, currentStep, maxAccessibleWeek);

    setMaxAccessibleWeek((prev) => {
      const next = Math.min(Math.max(prev, currentWeek), TOTAL_WEEKS);
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

    if (courseSegment === "transition") {
      dispatch(setCourse("transition"));
    }
  }, [location.pathname, dispatch]);

  if (currentCourse !== "transition") {
    return null;
  }

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
      })
    );
    navigate("/", { replace: true });
  };
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleWeekClick = (weekNumber) => {
    if (!isWeekAccessible(weekNumber)) return;

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
    return respectLaunchTarget ? weekNumber === respectLaunchTarget.week : weekNumber >= 1 && weekNumber <= weeksTopic.length;
  };

  const isWeekCompleted = (weekNumber) => {
    // A week is completed if the user has progressed beyond it
    const progressPerWeek = 100 / weeksTopic.length;
    return enrollmentProgress >= (weekNumber * progressPerWeek);
  };

  return (
    <>
      <nav className="navbar">
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

      <div className="main-content flex-column-reverse flex-md-row">
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

          <div className="compassion-title">
            <h2 className="fs-5 fs-md-3 transition-nav-text">
              From Curious to Confident: Transition with Ease
            </h2>
            <h2 className="compassion fs-5 transition-nav-text">Transition</h2>
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
                  onClick={isAccessible ? () => handleWeekClick(weekNumber) : undefined}
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
                      className="course-list-icon "
                    />
                  </div>
                  <span style={{ whiteSpace: "nowrap" }}>
                    Week {weekNumber}
                  </span>
                  <span className="">{item} </span>
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
        <section className="week-content position-relative">
          <WeekContent maxAccessibleWeek={maxAccessibleWeek} setMaxAccessibleWeek={setMaxAccessibleWeek} />
        </section>
      </div>
    </>
  );
};

const TransitionCourse = () => {
  return <CourseContent />;
};

export default TransitionCourse;

// data
// activity |  assestment
