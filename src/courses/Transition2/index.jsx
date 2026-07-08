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
  setCurrentWeek,
  setCurrentPage,
  setCurrentStep,
} from "@/store/navigationSlice";
import "./index.css";
// Import components
import PopUp from "./components/ReviewPopUp.jsx";
import Hurray from "./components/Hurray.jsx";

// Week 1
import Page1 from "./weeks/week1/page1/Page1.jsx";
import Page2 from "./weeks/week1/page2/Page2.jsx";
import Page3 from "./weeks/week1/page3/Page3.jsx";
import Page4 from "./weeks/week1/page4-slider/Page4.jsx";
import Page5 from "./weeks/week1/page5/Page5.jsx";
import Page6 from "./weeks/week1/page6/Page6.jsx";
import Page7 from "./weeks/week1/page8/Page7.jsx";
import Page8 from "./weeks/week1/page6/Page6.jsx";
import Page9Scenario from "./weeks/week1/page9/Page8.jsx";
import Page10 from "./weeks/week1/page10-reason-sentence/Page10.jsx";
import Page16 from "./weeks/week1/page16/Page15.jsx";
import Page17 from "./weeks/week1/page17/Page16.jsx";

// Week 2
import WeekTwoPage1 from "./weeks/week2/page1/Page1.jsx";
import WeekTwoPage2 from "./weeks/week2/page2/Page2.jsx";
import WeekTwoPage3 from "./weeks/week2/page3-duplicate/Page3.jsx";
import WeekTwoPage4 from "./weeks/week2/page2/Page2.jsx";
import WeekTwoPage5 from "./weeks/week2/page3/Page3.jsx";
import WeekTwoPage6 from "./weeks/week2/page6-growth-mindset/Page6.jsx";
import WeekTwoPage7 from "./weeks/week2/page5/Page5.jsx";
import WeekTwoPage8 from "./weeks/week2/page4/Page4.jsx";
import WeekTwoPage9 from "./weeks/week2/page7/Page7.jsx";
import WeekTwoPage10 from "./weeks/week2/page6/Page6.jsx";
import WeekTwoPage11 from "./weeks/week2/page7/Page7.jsx";
import WeekTwoPage12 from "./weeks/week2/page8/Page8.jsx";
import WeekTwoPage13 from "./weeks/week2/page9/Page9.jsx";
import WeekTwoPage14 from "./weeks/week2/page14-value-reflection/Page14.jsx";
import WeekTwoPage15 from "./weeks/week2/page11/Page11.jsx";
import WeekTwoPage16 from "./weeks/week2/page10/Page10.jsx";
import WeekTwoPage17 from "./weeks/week2/page11/Page11.jsx";
import WeekTwoPage18 from "./weeks/week2/Page12/Page12.jsx";

// Week 3
import WeekThreePage1 from "./weeks/week3/page1/Page1";
import WeekThreePage2 from "./weeks/week3/page2/Page2";
import WeekThreePage3 from "./weeks/week3/page3/Page3";
import WeekThreePage4 from "./weeks/week3/page4/Page4";
import WeekThreePage5 from "./weeks/week3/page5/Page5";
import WeekThreePage6 from "./weeks/week3/page6/Page6";
import WeekThreePage7 from "./weeks/week3/page7/Page7";
import WeekThreePage8 from "./weeks/week3/page8-support-reflection/Page8";
import WeekThreePage9 from "./weeks/week3/page9/Page9";
import WeekThreePage10 from "./weeks/week3/page10-spending-bucket/Page10";
import WeekThreePage11 from "./weeks/week3/page9/Page9";
import WeekThreePage12 from "./weeks/week3/page8/Page8";
import WeekThreePage13 from "./weeks/week3/page9/Page9";
import WeekThreePage14 from "./weeks/week3/page10/Page10";

// Week 4
import WeekFourPage1 from "./weeks/week4/page1/Page1.jsx";
import WeekFourPage2 from "./weeks/week4/page2/Page2.jsx";
import WeekFourPage3 from "./weeks/week4/page3/Page3.jsx";
import WeekFourPage4 from "./weeks/week4/page4/Page4.jsx";
import WeekFourPage5 from "./weeks/week4/page5/Page5.jsx";
import WeekFourPage6 from "./weeks/week4/page6/Page6.jsx";
import WeekFourPage7 from "./weeks/week4/page7/Page7.jsx";
import WeekFourPage8 from "./weeks/week4/page8/Page8.jsx";
import WeekFourPage9 from "./weeks/week4/page9/Page9.jsx";
import WeekFourPage10 from "./weeks/week4/page10/Page10.jsx";
import WeekFourPage11 from "./weeks/week4/page11/Page11.jsx";
import WeekFourPage12 from "./weeks/week4/Page12/Page12.jsx";
import WeekFourPage13 from "./weeks/week4/page13/Page13.jsx";
import WeekFourPage14ExamChoice from "./weeks/week4/page14-exam-choice/Page14.jsx";
import WeekFourPage14 from "./weeks/week4/page14/Page14.jsx";
import WeekFourPage16 from "./weeks/week4/page16/Page16.jsx";

// Week5
import WeekFivePage1 from "./weeks/week5/page1/Page1.jsx";
import WeekFivePage2 from "./weeks/week5/page2/Page2.jsx";
import WeekFivePage3 from "./weeks/week5/page3/Page3.jsx";
import WeekFivePage4 from "./weeks/week5/page4/Page4.jsx";
import WeekFivePage5 from "./weeks/week5/page5/Page5.jsx";
import WeekFivePage6 from "./weeks/week5/page6/Page6.jsx";
import WeekFivePage7 from "./weeks/week5/page7/Page7.jsx";
import WeekFivePage8 from "./weeks/week5/page8/Page8.jsx";
import WeekFivePage9 from "./weeks/week5/page9/Page9.jsx";
import WeekFivePage10 from "./weeks/week5/page10/Page10.jsx";

import { useEffect, useState } from "react";
import {
  updateData,
  userAnswer,
  clearData,
} from "@/store/userAnswersReducer";
import { adminData } from "@/store/adminReducer";

import { setCourse as setCurrentCourse } from "@/store/navigationSlice";
import { logoutSuccess } from "@/store/userReducer";
import { clearToken } from "@/store/jwtReducer";
import { useRespectLaunch } from "@/hooks/useRespectLaunch";
import { useSpixWeekCache } from "@/hooks/useRespectOfflineWarmup";

const TOTAL_WEEKS = 5;
const courseProgressKey = "transition2-flowProgress";
const weekProgressKey = (weekNumber) => `transition2-week-progress-${weekNumber}`;
const responseKey = (weekNumber) => `transition2-flowResponses-week${weekNumber}`;

const getLaunchWeekFromUrl = () => {
  const pathMatch = window.location.pathname.match(
    /\/transition2\/week(\d+)(?:\/index\.html)?\/?$/i,
  );
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

const WeekContent = () => {
  const dispatch = useDispatch();
  const userAnswers = useSelector(userAnswer);

  useEffect(() => {
    const launchWeek = getLaunchWeekFromUrl();
    const currentWeek =
      launchWeek && launchWeek >= 1 && launchWeek <= TOTAL_WEEKS
        ? launchWeek
        : sessionStorage.getItem("flow-currentWeek")
          ? Number(sessionStorage.getItem("flow-currentWeek"))
          : 1;
    const currentPage = launchWeek
      ? 1
      : sessionStorage.getItem("flow-currentPage")
        ? Number(sessionStorage.getItem("flow-currentPage"))
        : 1;
    const currentStep = launchWeek
      ? 1
      : sessionStorage.getItem("flow-currentStep")
        ? Number(sessionStorage.getItem("flow-currentStep"))
        : 1;

    // Dispatch the current week, page, and step
    dispatch(setCurrentWeek(currentWeek));
    dispatch(setCurrentPage(currentPage));
    dispatch(setCurrentStep(currentStep));
    sessionStorage.setItem("flow-currentWeek", String(currentWeek));
    sessionStorage.setItem("flow-currentPage", String(currentPage));
    sessionStorage.setItem("flow-currentStep", String(currentStep));

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
      sessionStorage.setItem("flow-highestWeek", String(Math.max(highestAuthorizedWeek, targetWeek)));
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!showHurray) return;

    if (currentWeek >= TOTAL_WEEKS) {
      sendCompleted(1.0);
    } else {
      sendProgressed(currentWeek / TOTAL_WEEKS);
    }
  }, [showHurray]);

  useEffect(() => {
    if (!currentWeek || !currentPage) return;
    const step = currentStep || Number(sessionStorage.getItem("flow-currentStep") ?? 1);
    const highestWeek = Math.max(currentWeek, Number(sessionStorage.getItem("flow-highestWeek") ?? 1));

    saveWeekProgress(currentWeek, currentPage, step);
    saveCourseProgressLocally(currentWeek, currentPage, step, highestWeek);
    persistProgress({
      currentWeek,
      currentPage,
      currentStep: step,
      highestWeek,
    });
  }, [currentWeek, currentPage, currentStep]);

  useEffect(() => {
    if (!currentWeek) return;
    loadResponses(currentWeek).then((saved) => {
      if (!saved) saved = getSavedWeekResponsesLocally(currentWeek);
      if (!saved) return;

      dispatch(
        updateData({
          course: "transition2",
          courseEnrollmentId: null,
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
    saveWeekResponsesLocally(currentWeek, responses);
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
            return <Page7 />;
          case 10:
            return <Page10 />;
          case 11:
            return <Page7 />;
          case 12:
            return <Page9Scenario />;
          case 13:
            return <Page16 />;
          case 14:
            return <Page17 />;
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
            return <WeekTwoPage18 />;
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
            return <WeekFourPage4 />;
          case 7:
            return <WeekFourPage5 />;
          case 8:
            return <WeekFourPage6 />;
          case 9:
            return <WeekFourPage7 />;
          case 10:
            return <WeekFourPage8 />;
          case 11:
            return <WeekFourPage9 />;
          case 12:
            return <WeekFourPage10 />;
          case 13:
            return <WeekFourPage11 />;
          case 14:
            return <WeekFourPage12 />;
          case 15:
            return <WeekFourPage13 />;
          case 16:
            return <WeekFourPage14ExamChoice />;
          case 17:
            return <WeekFourPage13 />;
          case 18:
            return <WeekFourPage10 />;
          case 19:
            return <WeekFourPage13 />;
          case 20:
            return <WeekFourPage14 />;
          case 21:
            return <WeekFourPage13 />;
          case 22:
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
  const currentWeek = useSelector(selectCurrentWeek);
  const currentPage = useSelector(selectCurrentPage);
  const currentStep = useSelector(selectCurrentStep);
  const showHurray = useSelector(selectShowHurray);
  const currentUserAnswers = useSelector(userAnswer);
  useSpixWeekCache(currentWeek, "transition2", TOTAL_WEEKS);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [menuVisible, setMenuVisible] = useState(false);
  const [enrollmentProgress, setEnrollmentProgress] = useState(0);
  const [maxAccessibleWeek, setMaxAccessibleWeek] = useState(
    () => Number(sessionStorage.getItem("flow-highestWeek") ?? 1),
  );

  const weeksTopic = [
    "Defining Your Next Chapter",
    "Mindset and Values",
    "Social and Financial Intelligence",
    "Freedom and Responsibility",
    "Goal Setting and Resilience",
  ];

  useEffect(() => {
    saveWeekProgress(currentWeek, currentPage, currentStep);
    saveCourseProgressLocally(currentWeek, currentPage, currentStep, maxAccessibleWeek);

    setMaxAccessibleWeek((prev) => {
      const next = Math.max(prev, currentWeek);
      sessionStorage.setItem("flow-highestWeek", String(next));

      const progressPerWeek = 100 / weeksTopic.length;
      const completedWeeks =
        showHurray && currentWeek >= TOTAL_WEEKS ? TOTAL_WEEKS : next - 1;
      setEnrollmentProgress(Math.round(Math.min(completedWeeks * progressPerWeek, 100)));

      return next;
    });
  }, [currentWeek, currentPage, currentStep, showHurray, weeksTopic.length]);

  useEffect(() => {
    const segments = location.pathname.split("/").filter(Boolean);
    const firstSegment = segments[0];
    const lastSegment = segments[segments.length - 1];

    // This is an important section that affects course rendering!
    if (
      [
        "compassion",
        "transition",
        "resilience_grit",
        "emotional_regulation",
        "transition2",
        "transition_2",
      ].includes(lastSegment?.toLowerCase())
      || ["transition2", "transition_2"].includes(firstSegment?.toLowerCase())
    ) {
      dispatch(setCurrentCourse("transition2"));
    }
  }, [location.pathname, dispatch]);

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

    sessionStorage.setItem("flow-currentWeek", weekNumber.toString());
    sessionStorage.setItem("flow-currentPage", String(savedProgress.page));
    sessionStorage.setItem("flow-currentStep", String(savedProgress.step));
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
      })
    );
    navigate("/", { replace: true });
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
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


        </div>
      </nav>

      <div className="main-content flex-column-reverse flex-md-row">
        <aside className="d-md-none d-lg-block aside-class">
          <button
            disabled={isAdmin}
            onClick={() => navigate("/courses")}
            className="back fs-6 transition2-back-to-courses"
            style={{ cursor: "pointer", border: "none", background: "#f8f5f5" }}
          >
            <Icon icon="fa6-solid:arrow-left-long" className="me-2" />
            Back to My Courses
          </button>

          <div className="compassion-title">
            <h2 className="fs-5 fs-md-3">Navigating the next chapter with clarity</h2>
            <h2 className="compassion fs-5">Transition 2</h2>
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
          <WeekContent />
        </section>
      </div>
    </>
  );
};

const EmotionalRegulationCourse = () => {
  return <CourseContent />;
};

export default EmotionalRegulationCourse;
