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
    queryKey: ["dashboard/compassion-feedback-overall", enrollmentId, 1],
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
    return () => {};
  }, [data]);

  function getFeedBackMessage(percentile) {
    switch (true) {
      case percentile >= 10 && percentile <= 39:
        return "Well done on starting your journey toward a smooth transition into secondary school! You’ve made an effort to understand important ideas like understanding your “why,” identifying what’s in your control, and the importance of values. There’s still room to deepen your understanding and practice what you’ve learned. Focus on building small habits, like managing your time more effectively or thinking about how a growth mindset can help you face challenges. Remember, every step you take brings you closer to feeling confident and ready for this new chapter. Keep trying—you’re capable of great things! Also, I recommend you take the course again from the beginning, as this will help you get more familiar with the concepts.";
      case percentile >= 40 && percentile <= 59:
        return "Good job! You’ve made solid progress and shown a great understanding of how to transition into secondary school successfully. To build on this, try putting what you’ve learned into action more consistently. Practice navigating relationships with friends and family, and reflect on how your core values can guide your decisions. With steady effort, you’ll become even more prepared for this exciting new stage. Keep going—you’re on the right track!";
      case percentile >= 60 && percentile <= 79:
        return "Great work! You’ve proven to have gained a good understanding of the key concepts that will help you navigate the exciting transition from primary to secondary school. You can start applying ideas like cultivating a growth mindset, focusing on what’s within your control, and understanding your core values. To build on this progress, try practicing these lessons in your daily life—whether it’s managing your time, setting goals, or building meaningful relationships. With consistent effort, you’ll feel more confident and ready to take on this new chapter. Keep it up—you’re doing well!";
      case percentile >= 80 && percentile <= 94:
        return "Excellent job! You’ve shown a strong grasp of the skills and mindset needed to transition smoothly into secondary school. Remember it’s highly important to keep applying what you’ve learned about time management, goal setting, and resilience in every way you can. To continue growing, focus on using these tools to face new challenges and opportunities everyday. Your hard work is paying off, and you’re well on your way to thriving in secondary school. Keep up the fantastic progress!";
      case percentile >= 95 && percentile <= 100:
        return "Outstanding achievement! You’ve shown mastery and a deep understanding of the skills and mindset to navigate your transition into secondary school with confidence and purpose. Your understanding of growth and fixed mindsets, time management, and resilience is exceptional, and you’ve shown you can apply these concepts to real-life situations. You’re not only ready for this new stage but also equipped to make the most of it. Keep inspiring others with your example, and continue using these tools to grow and succeed in every area of your life. Well done—you’re ready to shine in secondary school!";
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
      <p className="fs-md-3 text-gray mt-3">
        Congratulations on completing the Transition Curriculum!
      </p>
      <p className="fs-md-3 text-gray mt-3">
        Over the past ten weeks, you’ve explored essential skills and concepts
        to prepare you for secondary school. From understanding your “why” to
        building resilience and setting goals, you’ve laid a strong foundation
        for success.
      </p>
      <p className="fs-md-3 text-gray my-3">
        Remember, transition is an ongoing process. The lessons you’ve learned
        in this course will continue to guide you as you navigate new challenges
        and opportunities. Stay curious, keep growing, and never stop believing
        in yourself.
      </p>
      <p className="fs-md-3 text-gray">
        Good luck on your journey ahead, and always strive to be your best self!
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
