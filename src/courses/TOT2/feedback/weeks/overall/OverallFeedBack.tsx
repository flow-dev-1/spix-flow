import React, { useState, useEffect } from "react";
import celebrate from "@/assets/celebrate.png";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { adminData } from "@/store/adminReducer";
import userService from "@/services/api/user";
import adminService from "@/services/api/admin";

function OverallFeedBack({ enrollmentId, setHasPercentile }) {
  const [assessmentPercentile, setAssessmentPercentile] = useState(null);
  const { isAdmin, code } = useSelector(adminData);

  const { data, isPending, status, isError } = useQuery({
    queryKey: ["dashboard/tot-feedback-overall", enrollmentId, 1],
    queryFn: () =>
      isAdmin
        ? adminService.getUserCourseData(enrollmentId, 1, code)
        : userService.getUserCoursePercentile(enrollmentId),
    enabled: !!enrollmentId,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    keepPreviousData: false,
  });

  useEffect(() => {
    if (!data || data?.status === "failed") return;
    setAssessmentPercentile(data?.averagePercent);
    setHasPercentile(true);
    return () => { };
  }, [data]);

  function getFeedBackMessage(percentile) {
    switch (true) {
      case percentile >= 10 && percentile <= 39:
        return "You’ve taken an important first step in exploring Social and Emotional Learning and Positive Psychology. You’ve started to understand the value of emotional awareness, relationship skills, and teacher wellbeing. However, it seems you may still be building a full grasp of how SEL connects to classroom practice. Revisit the lessons and take time to reflect on how self-awareness and self-management can shape your approach to teaching. Don’t hesitate to ask questions or discuss ideas with your peers; collaboration is one of the best ways to deepen understanding. Every teacher starts somewhere, and your willingness to learn is already a sign of growth.";
      case percentile >= 40 && percentile <= 59:
        return "Good effort! You’re beginning to grasp key SEL and Positive Psychology principles such as self-awareness, empathy, and the importance of wellbeing in the classroom. You have a fair understanding of how emotional intelligence supports both teachers and students, but there’s room to strengthen your practical application. Try focusing on mindfulness and emotional regulation strategies in your daily teaching routine. Reflect after each class, ‘How did your emotional state affect your students' responses?’ The more intentional you are, the more confident and balanced you’ll become in integrating SEL principles effectively.";
      case percentile >= 60 && percentile <= 79:
        return "Well done! You’ve shown a strong understanding of SEL and Positive Psychology concepts and are starting to connect them meaningfully to your classroom practice. You recognize how empathy, relationship-building, and emotional regulation influence learning outcomes. To keep improving, aim to apply SEL more consistently, model calm responses to challenges, and build structured moments for reflection or gratitude in your lessons. You’re well on your way to creating a classroom culture rooted in care, connection, and emotional growth.";
      case percentile >= 80 && percentile <= 94:
        return "Excellent work! You’ve demonstrated a clear understanding of SEL and Positive Psychology competencies and how its principles can transform both teaching and learning. You’ve likely developed effective strategies for fostering empathy, self-regulation, and resilience in your students, and you understand the importance of teacher wellbeing in sustaining those practices. Keep refining your skills by mentoring peers or sharing SEL practices in team meetings. Continue to model emotional intelligence in every interaction, and you will build the kind of classroom where students feel safe, motivated, and valued.";
      case percentile >= 95:
        return "Outstanding achievement! You’ve shown exceptional mastery of Social and Emotional Learning. You not only understand the theory but also demonstrate how to live it out in your teaching, balancing self-awareness, empathy, and resilience with skill. Your approach likely fosters deep trust, engagement, and growth in your students. Continue to inspire others by leading discussions on SEL implementation and supporting colleagues who are just beginning their journey. Your dedication to nurturing emotional wellbeing in education sets a powerful example. Keep shining, the ripple effect of your work will last far beyond the classroom.";
      default:
        return "";
    }
  }

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (data?.status === "failed" || isError) {
    return (
      <div style={{ color: "red" }}>
        {data?.message || "Internal server error!"}
      </div>
    );
  }

  return (
    <>
      <div className="bg-compassion--feedback custom-border-20 question-box-container d-flex justify-content-center align-items-center flex-column gap-3">
        <img src={celebrate} alt="celebrate" className="text-center" />
        <h1 className="text-green" style={{ fontSize: "100px" }}>
          Hurray!
        </h1>
      </div>
      {/* <p className="fs-md-3 text-gray mt-3">
        Congratulations on completing the Transition Curriculum!
      </p> */}
      <p className="fs-md-3 text-gray mt-3">
        Congratulations on completing the Special Needs and Inclusive Education in Classrooms course!
        Over the past weeks, you’ve learned what it truly means to teach with emotional intelligence,
        self-awareness, and compassion. You’ve learned how SEL can strengthen not only your students’
        growth but also your own wellbeing as an educator.
      </p>
      <p className="fs-md-3 text-gray my-3">
        You now have practical strategies to manage stress, build meaningful relationships,
        and foster a supportive, thriving classroom environment. Remember,
        every interaction with a student is an opportunity to model empathy, resilience, and positivity.
      </p>
      <p className="fs-md-3 text-gray">
        Keep practicing what you’ve learned, reflect often, stay mindful,
        and continue nurturing both your emotional health and that of your students.
        Teaching with heart transforms classrooms into communities where everyone grows together.
      </p>

      <div className="bg-blue p-1 p-md-3 mt-2 rounded rounded-md-4">
        <h2 className="text-white fs-md-1">Overall Feedback</h2>
        <p className="text-white fs-md-3">
          {getFeedBackMessage(assessmentPercentile)}
        </p>
      </div>
    </>
  );
}

export default OverallFeedBack;
