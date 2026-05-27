import React, { useState, useEffect, useRef } from "react";
import logo from "@/assets/logo.png";
import { Icon } from "@iconify/react";
import Accordion from "./components/Accordion";
import Week1 from "./weeks/week1/Week1";
import Week2 from "./weeks/week2/Week2";
import Week3 from "./weeks/week3/Week3";
import Week4 from "./weeks/week4/Week4";
import Week5 from "./weeks/week5/Week5";
import Week6 from "./weeks/week6/Week6";
import Week7 from "./weeks/week7/Week7";
import Week8 from "./weeks/week8/Week8";
import Week9 from "./weeks/week9/Week9";
import Week10 from "./weeks/week10/Week10";
import OverallFeedBack from "./weeks/overall/OverallFeedBack";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { adminData } from "@/store/adminReducer";
import { useSelector } from "react-redux";

function TransitionFeedback({ isSchool: isSchoolProp, studentId }) {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState("");
  const location = useLocation(); // Get location object
  const [enrollmentId, setEnrollmentId] = useState(null);
  const [isSchool, setIsSchool] = useState(isSchoolProp || false);

  const { user } = useSelector((state) => state?.user);

  useEffect(() => {
    if (user?.isSchool) {
      setIsSchool(true);
    }
  }, [user]);

  // This is used to trigger the report download.
  const [hasPercentile, setHasPercentile] = useState(false);
  const isAdmin = useSelector(adminData);

  // states to check a certain week data has been loaded
  // This is for the final report generation
  const [isWeekOneLoaded, setWeekOneData] = useState(false);
  const [isWeekTwoLoaded, setWeekTwoData] = useState(false);
  const [isWeekThreeLoaded, setWeekThreeData] = useState(false);
  const [isWeekFourLoaded, setWeekFourData] = useState(false);
  const [isWeekFiveLoaded, setWeekFiveData] = useState(false);
  const [isWeekSixLoaded, setWeekSixData] = useState(false);
  const [isWeekSevenLoaded, setWeekSevenData] = useState(false);
  const [isWeekEightLoaded, setWeekEightData] = useState(false);
  const [isWeekNineLoaded, setWeekNineData] = useState(false);
  const [isWeekTenLoaded, setWeekTenData] = useState(false);

  const [allDataLoaded, setAllDataLoaded] = useState(false);

  useEffect(() => {
    setAllDataLoaded(
      isWeekOneLoaded &&
      isWeekTwoLoaded &&
      isWeekThreeLoaded &&
      isWeekFourLoaded &&
      isWeekFiveLoaded &&
      isWeekSixLoaded &&
      isWeekSevenLoaded &&
      isWeekEightLoaded &&
      isWeekNineLoaded &&
      isWeekTenLoaded
    );
  }, [
    isWeekOneLoaded,
    isWeekTwoLoaded,
    isWeekThreeLoaded,
    isWeekFourLoaded,
    isWeekFiveLoaded,
    isWeekSixLoaded,
    isWeekSevenLoaded,
    isWeekEightLoaded,
    isWeekNineLoaded,
    isWeekTenLoaded,
  ]);

  const currentWeek = activeIndex + 1;

  // Access data from location.state
  const enrolmentData = location.state?.enrollmentData; // Assuming enrollData is passed in state

  useEffect(() => {
    //toDo: Only Enrolled Users or Admin can access this course

    if (!isSchool && !enrolmentData && !isAdmin?.isAdmin) return navigate("/sign-in");

    if (isAdmin?.isAdmin) {
      const courseEnrollmentId = sessionStorage.getItem(
        "flow-courseEnrollmentId"
      );
      if (!courseEnrollmentId) return;
      setEnrollmentId(courseEnrollmentId);
    } else if (isSchool) {
      if (enrolmentData?._id) {
        setEnrollmentId(enrolmentData._id);
      }
    } else {
      setEnrollmentId(enrolmentData?._id);
    }
  }, [isAdmin, enrolmentData, isSchool, navigate]);

  const weekContents = [
    {
      topic: "Introduction to Transition",
      component: (
        <Week1 enrollmentId={enrollmentId} setWeekOneData={setWeekOneData} isSchool={isSchool} studentId={studentId} />
      ),
    },
    {
      topic: "Growth and Fixed Mindset",
      component: (
        <Week2 enrollmentId={enrollmentId} setWeekTwoData={setWeekTwoData} isSchool={isSchool} studentId={studentId} />
      ),
    },
    {
      topic: "Understanding what is in your control",
      component: (
        <Week3
          enrollmentId={enrollmentId}
          setWeekThreeData={setWeekThreeData}
          isSchool={isSchool} studentId={studentId}
        />
      ),
    },
    {
      topic: "Understanding Values",
      component: (
        <Week4 enrollmentId={enrollmentId} setWeekFourData={setWeekFourData} isSchool={isSchool} studentId={studentId} />
      ),
    },
    {
      topic: "Core Values and how they matter",
      component: (
        <Week5 enrollmentId={enrollmentId} setWeekFiveData={setWeekFiveData} isSchool={isSchool} studentId={studentId} />
      ),
    },
    {
      topic: "Social Skills (Navigating Relationships)",
      component: (
        <Week6 enrollmentId={enrollmentId} setWeekSixData={setWeekSixData} isSchool={isSchool} studentId={studentId} />
      ),
    },
    {
      topic: "Time Management",
      component: (
        <Week7
          enrollmentId={enrollmentId}
          setWeekSevenData={setWeekSevenData}
          isSchool={isSchool} studentId={studentId}
        />
      ),
    },
    {
      topic: "Goal Setting",
      component: (
        <Week8
          enrollmentId={enrollmentId}
          setWeekEightData={setWeekEightData}
          isSchool={isSchool} studentId={studentId}
        />
      ),
    },
    {
      topic: "Resilience and Introduction to Coping Skills",
      component: (
        <Week9 enrollmentId={enrollmentId} setWeekNineData={setWeekNineData} isSchool={isSchool} studentId={studentId} />
      ),
    },
    {
      topic: "Looking Ahead",
      component: (
        <Week10 enrollmentId={enrollmentId} setWeekTenData={setWeekTenData} isSchool={isSchool} studentId={studentId} />
      ),
    },
    {
      topic: "Summary of your journey through Transition",
      component: (
        <OverallFeedBack
          enrollmentId={enrollmentId}
          setHasPercentile={setHasPercentile}
        //todo: pass a percentile prop which will be responsible for the detecting the correct messsage to display on the overall page
        />
      ),
    },
  ];

  const weeksTopic = weekContents.map((week) => week.topic);
  const items = weekContents.map((week) => ({
    title: week.topic,
    content: week.component,
  }));

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <button
            disabled={isAdmin?.isAdmin}
            onClick={() => isSchool ? navigate("/school-dashboard") : navigate("/dashboard")}
            className="navbar-logo"
            style={{ border: "none", background: "#FFF" }}
          >
            <img src={logo} alt="" />
          </button>
          <div
            className="navbar-logo"
            onClick={() => { }}
            style={{ cursor: "pointer" }}
          >
            Logout
          </div>
        </div>
      </nav>
      <div className="main-content">
        <aside className="d-none d-lg-block">
          <button
            disabled={isAdmin?.isAdmin}
            onClick={() => isSchool ? navigate(-1) : navigate("/dashboard/my-courses")}
            className="back"
            style={{ cursor: "pointer", border: "none", background: "#f8f5f5" }}
          >
            <Icon icon="fa6-solid:arrow-left-long" className="me-2" />
            {isSchool ? "Go back" : "Back to My Courses"}
          </button>
          <div className="compassion-title">
            <h2> From Curious to Confident: Transition with Ease</h2>
            <h2 className="compassion">Transition</h2>
          </div>

          <ul className="compassion-list">
            {weeksTopic.map((item, index) => (
              <li
                key={index}
                className={
                  index + 1 <= currentWeek
                    ? "active-week"
                    : index === 10
                      ? "d-none"
                      : ""
                }
              >
                <div className="icon">
                  <Icon
                    icon="icon-park-outline:check-one"
                    className="course-list-icon"
                  />
                </div>
                <span className={index === 10 ? "d-none" : ""}>
                  Week
                  {index + 1}
                </span>
                <span>{item} </span>
              </li>
            ))}
          </ul>
        </aside>
        <section className="week-content position-relative mb-5 ">
          <Link
            disabled={isAdmin}
            to={isSchool ? -1 : "/dashboard/my-courses"}
            className="back text-black mb-5 p-3 d-lg-none"
            style={{ cursor: "pointer", border: "none" }}
          >
            <Icon icon="fa6-solid:arrow-left-long" className="me-2" />
            {isSchool ? "Go back" : "Back to My Courses"}
          </Link>
          <Accordion
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            items={items}
            hasPercentile={hasPercentile}
            allDataLoaded={allDataLoaded}
            setHasPercentile={setHasPercentile}
          />
        </section>
      </div>
    </>
  );
}

export default TransitionFeedback;

// week 4, all drag and drop
