import logo from "@/assets/logo.png";
import { Icon } from "@iconify/react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  selectCurrentWeek,
  selectShowHurray,
  selectCurrentPage,
  selectNavigationState,
  setCurrentWeek,
  setCurrentPage,
  setCurrentStep,
} from "@/store/navigationSlice";
import "./index.css";
// Import components
import Hurray from "./components/Hurray";

// Week 1
import TOT2PreAssesment from "./weeks/week1/preAssesement/PreAssesment.jsx";
import WeekOnePage2 from "./weeks/week1/page1/Page1";
import WeekOnePage3 from "./weeks/week1/page2/Page2";
import WeekOnePage4 from "./weeks/week1/page3/Page3";
import WeekOnePage5 from "./weeks/week1/page4/Page4";
import WeekOnePage6 from "./weeks/week1/page5/Page5";
import WeekOnePage7 from "./weeks/week1/page6/Page6";
import WeekOnePage8 from "./weeks/week1/page7/Page7";
import WeekOnePage9 from "./weeks/week1/page8/Page8";
import WeekOnePage10 from "./weeks/week1/page9/Page9";
import WeekOnePage11 from "./weeks/week1/page10/Page10";
import WeekOnePage12 from "./weeks/week1/page11/Page11";
import WeekOnePage13 from "./weeks/week1/page12/Page12.jsx";
import WeekOnePage14 from "./weeks/week1/page13/Page13.jsx";
import WeekOnePage15 from "./weeks/week1/page14/Page14.jsx";
import WeekOnePage16 from "./weeks/week1/page15/Page15.jsx";
import WeekOnePage17 from "./weeks/week1/page16/Page16.jsx";
import WeekOnePage18 from "./weeks/week1/page17/Page17.jsx";
import WeekOnePage19 from "./weeks/week1/page18/Page18.jsx";

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

// Week 3
import WeekThreePage1 from "./weeks/week3/page1/Page1";
import WeekThreePage2 from "./weeks/week3/page2/Page2";
import WeekThreePage3 from "./weeks/week3/page3/Page3.jsx";
import WeekThreePage4 from "./weeks/week3/page4/Page4.jsx";
import WeekThreePage5 from "./weeks/week3/page5/Page5.jsx";
import WeekThreePage6 from "./weeks/week3/page6/Page6.jsx";
import WeekThreePage7 from "./weeks/week3/page7/Page7.jsx";
import WeekThreePage8 from "./weeks/week3/page8/Page8.jsx";
import WeekThreePage9 from "./weeks/week3/page9/Page9.jsx";
import WeekThreePage10 from "./weeks/week3/page10/Page10.jsx";
import WeekThreePage11 from "./weeks/week3/page11/Page11.jsx";
import WeekThreePage12 from "./weeks/week3/page12/Page12.jsx";
import WeekThreePage13 from "./weeks/week3/page13/Page13.jsx";

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
import WeekFourPage12 from "./weeks/week4/page12/Page12.jsx";
import WeekFourPage13 from "./weeks/week4/page13/Page13.jsx";
import WeekFourPage14 from "./weeks/week4/page14/Page14.jsx";

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
import WeekFivePage11 from "./weeks/week5/page11/Page11.jsx";
import WeekFivePage12 from "./weeks/week5/page12/Page12.jsx";
import WeekFivePage13 from "./weeks/week5/page13/Page13.jsx";
import WeekFivePage14 from "./weeks/week5/page14/Page14.jsx";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useVideoDownload } from "./hooks/useVideoDownload";
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

const WeekContent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userAnswers = useSelector(userAnswer);
  const location = useLocation(); // Get location object
  const [enrollmentId, setEnrollmentId] = useState(null);
  const [course, setCourse] = useState(null);
  const { isAdmin } = useSelector(adminData);

  // Access data from location.state
  const enrolmentData = location.state?.enrollmentData as any; // Assuming enrollData is passed in state

  useEffect(() => {
    if (enrolmentData?._id) {
      setEnrollmentId(enrolmentData._id);
      setCourse(enrolmentData?.course?._id ?? null);
    }
  }, []);

  // Fallback for RESPECT Launcher sessions — the launcher navigates via URL params,
  // not React Router state, so location.state?.enrollmentData is undefined.
  // Without an enrollmentId the useQuery below stays disabled and week data is never fetched.
  useEffect(() => {
    if (!enrolmentData?._id) {
      userService.getSingleEnrollment("").then((res: any) => {
        if (res?.enrollment?._id) {
          setEnrollmentId(res.enrollment._id);
          setCourse(res.enrollment?.course?._id ?? null);
        }
      });
    }
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

    return () => {};
  }, [dispatch]); // Added dispatch to dependency array

  const currentWeek = useSelector(selectCurrentWeek);
  const currentPage = useSelector(selectCurrentPage);
  const showHurray = useSelector(selectShowHurray);
  const { isLastWeek } = useSelector(selectNavigationState);

  const { sendCompleted, sendProgressed, restoreProgress, persistProgress, saveResponses, loadResponses } = useRespectLaunch();

  // On mount: try to restore position from the LRS State API (RESPECT sessions).
  // Falls back to sessionStorage which is already loaded in the effect above.
  useEffect(() => {
    restoreProgress().then((saved) => {
      if (!saved) return;
      dispatch(setCurrentWeek(saved.currentWeek));
      dispatch(setCurrentPage(saved.currentPage));
      dispatch(setCurrentStep(saved.currentStep));
      sessionStorage.setItem("flow-currentWeek", String(saved.currentWeek));
      sessionStorage.setItem("flow-currentPage", String(saved.currentPage));
      sessionStorage.setItem("flow-currentStep", String(saved.currentStep));
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fire xAPI progress/completion when the week-end screen appears
  useEffect(() => {
    if (!showHurray) return;
    if (isLastWeek) {
      sendCompleted(1.0);
    } else {
      sendProgressed(currentWeek / 5);
    }
  }, [showHurray]);

  // Persist position to the LRS State API whenever the user advances
  useEffect(() => {
    if (!currentWeek || !currentPage) return;
    const step = Number(sessionStorage.getItem("flow-currentStep") ?? 1);
    persistProgress({ currentWeek, currentPage, currentStep: step });
  }, [currentWeek, currentPage]);

  // toDo: Fetch User assessment and Activity Data
  const { data, isLoading, status, isError } = useQuery({
    queryKey: [
      `dashboard-tot-course-2-${currentWeek}`,
      enrollmentId,
      currentWeek,
    ],
    queryFn: () => userService.getUserCourseData(enrollmentId, currentWeek),
    enabled: !!enrollmentId && !!currentWeek,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (!data) return;
    const d = data as any;

    if (d.assessment && d.activity) {
      dispatch(
        updateData({
          course: course,
          courseEnrollmentId: enrollmentId,
          week: currentWeek,
          activities: d.activity?.activities,
          assessments: d.assessment?.assessments,
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
          activities: userAnswers.activities,
          assessments: userAnswers.assessments,
        }),
      );
    }

    return () => {};
  }, [data]);

  // Restore responses from LRS when the week changes (covers switching back to a previous week)
  useEffect(() => {
    if (!currentWeek) return;
    loadResponses(currentWeek).then((saved) => {
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

  // Auto-save responses to LRS whenever the user answers a question
  useEffect(() => {
    if (!currentWeek) return;
    if (!userAnswers.activities?.length && !userAnswers.assessments?.length) return;
    saveResponses(currentWeek, {
      activities: userAnswers.activities ?? [],
      assessments: userAnswers.assessments ?? [],
    });
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
            return <TOT2PreAssesment />;
          case 2:
            return <WeekOnePage2 />;
          case 3:
            return <WeekOnePage3 />;
          case 4:
            return <WeekOnePage4 />;
          case 5:
            return <WeekOnePage5 />;
          case 6:
            return <WeekOnePage6 />;
          case 7:
            return <WeekOnePage7 />;
          case 8:
            return <WeekOnePage8 />;
          case 9:
            return <WeekOnePage9 />;
          case 10:
            return <WeekOnePage10 />;
          case 11:
            return <WeekOnePage11 />;
          case 12:
            return <WeekOnePage12 />;
          case 13:
            return <WeekOnePage13 />;
          case 14:
            return <WeekOnePage14 />;
          case 15:
            return <WeekOnePage15 />;
          case 16:
            return <WeekOnePage16 />;
          case 17:
            return <WeekOnePage17 />;
          case 18:
            return <WeekOnePage18 />;
          case 19:
            return <WeekOnePage19 />;
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
      default:
        return null;
    }
  };

  return (
    <>
      {getComponent()}
    </>
  );
};

const CourseContent = () => {
  const { isAdmin } = useSelector(adminData);
  const currentWeek = useSelector(selectCurrentWeek);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [menuVisible, setMenuVisible] = useState(false);
  const [enrollmentProgress, setEnrollmentProgress] = useState(0);
  const [maxAccessibleWeek, setMaxAccessibleWeek] = useState(
    () => Number(sessionStorage.getItem("flow-highestWeek") ?? 1)
  );
  const [enrollmentId, setEnrollmentId] = useState(null);

  const weeksTopic = [
    "Understanding Inclusion and Special Needs in the Classroom",
    "The Inclusive Mindset: Empathy and Compassion",
    "Designing Learning for Everyone, Universal Design for Learning and Differentiated Instruction",
    "Practical Strategies for Supporting Students with Common Special Needs",
    "Collaboration, Support Systems, and Inclusive Implementation",
  ];

  // Get enrollment data from location state
  const enrolmentData = location.state?.enrollmentData as any;

  // Capture enrollmentId from location state on mount
  useEffect(() => {
    if (enrolmentData?._id) {
      setEnrollmentId(enrolmentData._id);
    }
  }, []);

  // Derive progress locally from currentWeek — each completed week = 20%.
  // maxAccessibleWeek only ever increases — navigating back never locks future weeks.
  useEffect(() => {
    const progressPerWeek = 100 / weeksTopic.length;
    const completedWeeks = currentWeek - 1;
    const progress = Math.min(completedWeeks * progressPerWeek, 100);
    setEnrollmentProgress(progress);
    setMaxAccessibleWeek((prev) => {
      const next = Math.max(prev, currentWeek);
      sessionStorage.setItem("flow-highestWeek", String(next));
      return next;
    });
  }, [currentWeek]);

  useEffect(() => {
    const segments = location.pathname.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1];

    // This is an important section that affects course rendering!
    if (["tot_2"].includes(lastSegment?.toLowerCase())) {
      dispatch(setCourse(lastSegment.toLowerCase()));
    }
  }, [location.pathname, dispatch]);

  const handleWeekClick = (weekNumber) => {
    // Only allow navigation to completed weeks or the current week in progress
    if (weekNumber <= maxAccessibleWeek) {
      // Clear previous week data before switching
      dispatch(clearData());

      dispatch(setCurrentWeek(weekNumber));
      dispatch(setCurrentPage(1));
      dispatch(setCurrentStep(1));

      // Update session storage
      sessionStorage.setItem("flow-currentWeek", weekNumber.toString());
      sessionStorage.setItem("flow-currentPage", "1");
      sessionStorage.setItem("flow-currentStep", "1");
    }
  };

  const isWeekAccessible = (weekNumber) => {
    return weekNumber <= maxAccessibleWeek;
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
    navigate("/sign-in", { replace: true });
  };

  const { progress: dlProgress, downloadWeek, removeWeek } = useVideoDownload();

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <button
            disabled={isAdmin}
            onClick={() => navigate("/dashboard")}
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

          <div className="d-block d-lg-none position-relative">
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
            onClick={() => navigate("/dashboard/my-courses")}
            className="back fs-6 d-none d-lg-block"
            style={{ cursor: "pointer", border: "none", background: "#f8f5f5" }}
          >
            <Icon icon="fa6-solid:arrow-left-long" className="me-2" />
            Back to My Courses
          </button>

          <div className="tot-title">
            <h2 className="fs-5 fs-md-3 tot-nav-text">
              Special Needs and Inclusive Education in Classrooms:
            </h2>
            <h2 className="compassion fs-5 tot-nav-text">
              {" "}
              Leaving no learner behind.
            </h2>
          </div>

          <ul className="compassion-list">
            {weeksTopic.map((item, index) => {
              const weekNumber = index + 1;
              const isAccessible = isWeekAccessible(weekNumber);
              const isCompleted = isWeekCompleted(weekNumber);
              const isActive = weekNumber === currentWeek;

              const dl = dlProgress[weekNumber];
              const isDownloading = dl?.state === "downloading";
              const isDone = dl?.state === "done";
              const isError = dl?.state === "error";

              return (
                <li
                  key={index}
                  className={`${isActive ? "active-week" : ""} ${
                    isAccessible ? "accessible-week" : "locked-week"
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
                  <span className="">{item}</span>

                  {/* Save for offline button — temporarily commented out for RESPECT testing */}
                  {/* {isAccessible && (
                    <button
                      title={
                        isDownloading
                          ? `Saving ${dl.current}/${dl.total} videos…`
                          : isDone
                            ? "Available offline — click to remove"
                            : isError
                              ? `Error: ${dl.error}. Tap to retry`
                              : "Save week videos for offline"
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isDownloading) return;
                        if (isDone) removeWeek(weekNumber);
                        else downloadWeek(weekNumber);
                      }}
                      style={{
                        marginLeft: "auto",
                        flexShrink: 0,
                        background: "none",
                        border: "none",
                        cursor: isDownloading ? "default" : "pointer",
                        padding: "2px 4px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        color: isDone ? "#00BCC3" : isError ? "#dc3545" : "#275DAD",
                        opacity: isDownloading ? 0.7 : 1,
                      }}
                    >
                      <Icon
                        icon={
                          isDownloading
                            ? "mdi:loading"
                            : isDone
                              ? "mdi:check-circle"
                              : isError
                                ? "mdi:alert-circle"
                                : "mdi:download-circle-outline"
                        }
                        width={20}
                        style={isDownloading ? { animation: "spin 1s linear infinite" } : {}}
                      />
                      {isDownloading && (
                        <span style={{ fontSize: "9px", lineHeight: 1.2 }}>
                          {dl.current}/{dl.total}
                        </span>
                      )}
                      {isDone && (
                        <span style={{ fontSize: "9px", lineHeight: 1.2, color: "#00BCC3" }}>
                          Saved
                        </span>
                      )}
                    </button>
                  )} */}
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
                aria-valuemin={0}
                aria-valuemax={100}
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
            onClick={() => navigate("/dashboard/my-courses")}
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

const TOTCourse = () => {
  return <CourseContent />;
};

export default TOTCourse;
