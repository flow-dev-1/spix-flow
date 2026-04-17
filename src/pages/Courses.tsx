import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Navbar from "@/components/navbar/Navbar";
import "@/styles/courses.css";
import tot2Cover from "@/assets/tot2-cover.png";

const COURSES = [
  {
    id: "tot_2",
    title: "Leaving No Learner Behind",
    topic: "Special Needs and Inclusive Education in Classrooms",
    description:
      "This program prepares teachers to build classrooms where every learner can participate fully and grow with confidence.",
    image: tot2Cover,
    route: "/tot2",
    weeks: 5,
  },
];

export default function Courses() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f8" }}>
      <Navbar />

      {/* Content sits below the fixed navbar */}
      <div className="courses-content-wrapper">
      {/* Header bar */}
      <div className="browse-all-courses-text container-fluid">
        <p>My Courses</p>
      </div>

      {/* Course grid */}
      <div className="container-fluid px-4 py-4">
        <div className="row g-4">
          {COURSES.map((course) => (
            <div key={course.id} className="col-12 col-sm-6 col-lg-3">
              <div className="reusable-course-card h-100">
                <div className="course-card">

                  {/* Image with padding */}
                  <div style={{ padding: "10px 10px 0 10px" }}>
                    <img
                      src={course.image}
                      alt={course.title}
                      style={{
                        width: "100%",
                        height: "180px",
                        objectFit: "cover",
                        borderRadius: "6px",
                        display: "block",
                      }}
                    />
                  </div>

                  {/* Text body */}
                  <div className="course-details px-3 pt-3 pb-1">
                    <p style={{ color: "#00BCC3", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>
                      {course.topic}
                    </p>
                    <h3 style={{ color: "#275DAD", fontSize: "17px", fontWeight: 700, marginBottom: "8px" }}>
                      {course.title}
                    </h3>
                    <p style={{ color: "#555", fontSize: "13px" }}>{course.description}</p>

                    <span className="progress-badge mb-3">
                      <Icon icon="bi:book" />
                      {course.weeks} Weeks
                    </span>
                  </div>

                  {/* Action */}
                  <div className="course-card-btn">
                    <button
                      className="card-btn start-resume"
                      onClick={() => navigate(course.route)}
                    >
                      <Icon icon="pepicons-print:play-circle" width={18} />
                      Start
                    </button>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
