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
import OverallFeedBack from "./weeks/overall/OverallFeedBack";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { adminData } from "@/store/adminReducer";
import { useSelector } from "react-redux";

function TOTFeedback({ isSchool: isSchoolProp }) {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState("");
  const location = useLocation(); // Get location object
  const [enrollmentId, setEnrollmentId] = useState(null);
  const [isSchool, setIsSchool] = useState(isSchoolProp || false);

  // This is used to trigger the report download.
  const [hasPercentile, setHasPercentile] = useState(false);
  const isAdmin = useSelector(adminData);

  const { user } = useSelector((state) => state?.user);

  useEffect(() => {
    if (user?.isSchool) {
      setIsSchool(true);
    }
  }, [user]);

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

  const [allDataLoaded, setAllDataLoaded] = useState(false);

  useEffect(() => {
    setAllDataLoaded(
      isWeekOneLoaded &&
        isWeekTwoLoaded &&
        isWeekThreeLoaded &&
        isWeekFourLoaded &&
        isWeekFiveLoaded &&
        isWeekSixLoaded,
    );
  }, [
    isWeekOneLoaded,
    isWeekTwoLoaded,
    isWeekThreeLoaded,
    isWeekFourLoaded,
    isWeekFiveLoaded,
    isWeekSixLoaded,
  ]);

  const currentWeek = activeIndex + 1;

  // Access data from location.state
  const enrolmentData = location.state?.enrollmentData; // Assuming enrollData is passed in state

  useEffect(() => {
    //toDo: Only Enrolled Users or Admin can access this course

    if (!isSchool && !enrolmentData && !isAdmin?.isAdmin)
      return navigate("/sign-in");

    if (isAdmin?.isAdmin) {
      const courseEnrollmentId = sessionStorage.getItem(
        "flow-courseEnrollmentId",
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
      topic: "Understanding SEL & Positive Psychology",
      component: (
        <Week1 enrollmentId={enrollmentId} setWeekOneData={setWeekOneData} />
      ),
    },
    {
      topic: "Self-Awareness & Emotional Regulation",
      component: (
        <Week2 enrollmentId={enrollmentId} setWeekTwoData={setWeekTwoData} />
      ),
    },
    {
      topic: "Building Relationships & Creating a Safe Classroom",
      component: (
        <Week3
          enrollmentId={enrollmentId}
          setWeekThreeData={setWeekThreeData}
        />
      ),
    },
    {
      topic: "Growth Mindset & Resilience for Educators",
      component: (
        <Week4 enrollmentId={enrollmentId} setWeekFourData={setWeekFourData} />
      ),
    },
    {
      topic: "Integrating SEL into Teaching Methods",
      component: (
        <Week5 enrollmentId={enrollmentId} setWeekFiveData={setWeekFiveData} />
      ),
    },
    {
      topic: "Teacher Well-being & Sustainable SEL Practices",
      component: (
        <Week6 enrollmentId={enrollmentId} setWeekSixData={setWeekSixData} />
      ),
    },
    {
      topic: "SEL & Positive Psychology Implementation Plan Worksheet.",
      component: "",
    },
    {
      topic: "Teacher Resources for ToT Course 1",
      component: "",
    },
    {
      topic: "Summary of your journey through ToT Course 1",
      component: (
        <OverallFeedBack
          enrollmentId={enrollmentId}
          setHasPercentile={setHasPercentile}
          //todo: pass a percentile prop which will be responsible for the detecting the correct messsage to display on the overall page
        />
      ),
    },
  ];

  const weeksTopic = weekContents.slice(0, 6).map((week) => week.topic);
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
            onClick={() =>
              isSchool ? navigate("/school-dashboard") : navigate("/dashboard")
            }
            className="navbar-logo"
            style={{ border: "none", background: "#FFF" }}
          >
            <img src={logo} alt="" />
          </button>
          <div
            className="navbar-logo"
            onClick={() => {}}
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
            onClick={() =>
              isSchool ? navigate(-1) : navigate("/dashboard/my-courses")
            }
            className="back"
            style={{ cursor: "pointer", border: "none", background: "#f8f5f5" }}
          >
            <Icon icon="fa6-solid:arrow-left-long" className="me-2" />
            {isSchool ? "Go back" : "Back to My Courses"}
          </button>
          <div className="tot-title">
            <h2 className="fs-5 fs-md-3 tot-nav-text">SEL for Educators:</h2>
            <h2 className="compassion fs-5 tot-nav-text">Feel It. Teach It. Transform Lives.</h2>
          </div>

          <ul className="compassion-list">
            {weeksTopic.map((item, index) => (
              <li
                key={index}
                className={
                  index + 1 <= currentWeek
                    ? "active-week"
                    : index >= 6
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
                <span className={index >= 6 ? "d-none" : ""}>
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
            enrollmentId={enrollmentId}
          />
        </section>
      </div>
    </>
  );
}

export default TOTFeedback;

// week 4, all drag and drop
