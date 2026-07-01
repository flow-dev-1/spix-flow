import React, { useState, useEffect } from "react";
import celebrate from "@/assets/celebrate.png";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { adminData } from "@/store/adminReducer";
import userService from "@/services/api/user";
import schoolService from "@/services/api/school";
import adminService from "@/services/api/admin";

function OverallFeedBack({ enrollmentId, setHasPercentile, isSchool, studentId }) {
  const [assessmentPercentile, setAssessmentPercentile] = useState(null);
  const { isAdmin, code } = useSelector(adminData);

  const { data, isPending, status, isError } = useQuery({
    queryKey: ["dashboard/tot-feedback-overall", enrollmentId, 1],
    queryFn: () => {
      if (isAdmin) return adminService.getUserCourseData(enrollmentId, 1, code);
      if (isSchool) return schoolService.getStudentCourseData(enrollmentId, 1, studentId);
      return userService.getUserCoursePercentile(enrollmentId);
    },
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
        return "You've taken your first step toward preparing for university life, and that already matters. You're beginning to understand important ideas like purpose, independence, mindset, and responsibility. However, you may still be building clarity around how these concepts apply directly to your own life. This is a great time to pause and reflect: Why are you really going to university? What kind of person do you want to become in this next chapter? How do your choices today connect to your future goals? Revisit your notes, reflect on your values, and talk through these ideas with someone you trust. Growth doesn't happen overnight, it happens through awareness and intentional effort. You're at the beginning of that journey.";
      case percentile >= 40 && percentile <= 59:
        return "Good effort! You're developing a solid understanding of the transition into university life. You recognize the importance of purpose, growth mindset, financial awareness, and balancing freedom with responsibility. You're beginning to see how your mindset and values shape your decisions. To strengthen your preparation, focus on practical application: How will you manage your time weekly? What systems will help you stay disciplined? Who will be part of your support network? The more intentional you are now, the smoother your transition will be. Keep building awareness and turning insight into action.";
      case percentile >= 60 && percentile <= 79:
        return "Well done! You've shown a strong understanding of the skills needed to thrive in university. You understand how purpose fuels motivation, how a growth mindset builds resilience, and how financial and social intelligence reduce unnecessary stress. You're beginning to think strategically about your independence. To level up further, focus on consistent practice of managing your time, setting small goals, and making decisions aligned with your values even now. You're building the mindset of someone who doesn't just survive post secondary school life, but thrives in it.";
      case percentile >= 80 && percentile <= 94:
        return "Excellent work! You demonstrate clear readiness for this next chapter. You understand the balance between freedom and responsibility and are thinking intentionally about your purpose, relationships, finances, and long-term goals. You likely have a strong awareness of your values and how they guide your decisions. Keep refining your Personal Action Plan and practicing resilience strategies. Continue developing leadership in your own life: your independence, discipline, and clarity will shape your success. You're stepping into university prepared, not just academically, but personally.";
      case percentile >= 95:
        return "Outstanding achievement! You've demonstrated exceptional clarity, self-awareness, and readiness for university life. You understand your why, embrace growth challenges, think responsibly about finances and relationships, and approach independence with maturity. You're not just preparing for university; you're designing your future intentionally. Continue to reflect, adapt, and lead yourself wisely. Remember, resilience and consistency will carry you further than talent alone. You are entering this next chapter with confidence, direction, and purpose.";
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
        Congratulations on completing the Year 12 Transition Course!
      </p> */}

      <p className="fs-md-3 text-gray mt-3">
        Congratulations on completing the Year 12 Transition Course!
      </p>
      <p className="fs-md-3 text-gray my-3">
        Over the past five weeks, you've reflected on your purpose, clarified
        your values, strengthened your mindset, built awareness around social
        and financial responsibility, and developed resilience strategies for
        navigating challenges.
      </p>
      <p className="fs-md-3 text-gray">
        University is not just about lectures and exams. It's about
        independence, character, discipline, relationships, and growth. The
        skills you've developed here which are: time management, emotional
        resilience, goal setting, and self-leadership will shape your experience
        far beyond your first year.
      </p>
      <p className="fs-md-3 text-gray">
        Remember: Your purpose keeps you focused. Your values guide your
        decisions. Your mindset shapes your response to challenges. Your
        discipline builds your freedom. Your resilience carries you through
        setbacks. Your next chapter is waiting.
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
