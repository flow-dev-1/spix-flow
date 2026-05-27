import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import checkedImage from "@/assets/checkedbox.png";
import unCheckedImage from "@/assets/uncheckedBox.png";
import correct from "@/assets/correct.png";
import wrong from "@/assets/wrong.png";
import {
  getWeekAssessment,
  getWeekContentExcludingVideos,
} from "../../../data/index.js";
import { useQuery, useMutation } from "@tanstack/react-query";
import userService from "@/services/api/user";
import schoolService from "@/services/api/school";
import { calculateResult } from "../../../utility.js";
import { adminData } from "@/store/adminReducer";
import Modal from "../../components/Modal.jsx";
import { useSelector } from "react-redux";
import adminService from "@/services/api/admin";

function Week10({ enrollmentId, setWeekTenData, isSchool, studentId }) {
  const { pages } = getWeekContentExcludingVideos(10);
  const [activity1] = pages;
  const [activityData, setActivityData] = useState([]);
  const [assessmentData, setAssessmentData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState("");
  const [activityFeedbackId, setActivityFeedbackId] = useState(null);
  const { isAdmin, code } = useSelector(adminData);

  const [q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12] = activity1.steps;
  const [a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12] =
    activityData?.[0]?.answer?.map((a) => a.value) || [];
  const [f1, f2, f3, f4, f5, f6, f7, f8, f9, f10, f11, f12] =
    activityData?.[0]?.feedback?.map((a) => a.value) || [];

  const { questions: assessments } = getWeekAssessment(10);

  // toDo: Fetch User assessment and Activity Data
  const { data, isPending, status, isError } = useQuery({
    queryKey: ["dashboard/transition-feedback-10", enrollmentId, 10],
    queryFn: () => {
      if (isAdmin) return adminService.getUserCourseData(enrollmentId, 10, code);
      if (isSchool) return schoolService.getStudentCourseData(enrollmentId, 10, studentId);
      return userService.getUserCourseData(enrollmentId, 10);
    },
    enabled: !!enrollmentId,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    keepPreviousData: false,
  });

  const mutation = useMutation({
    mutationFn: () =>
      adminService.submitAdminFeedback(
        activityData,
        enrollmentId,
        10,
        data?.activity?.user,
        code
      ),
    onSuccess: (data) => {
      setModalData("");
      // setIsOpen(true)
      // toast.success(data.message)
    },
    onError: (error) => {
      console.error("Registration error:", error);
      setModalData("");
      // toast.dismiss()
      // toast.error(error?.message)
      // navigate('/sign-in', { replace: true })
    },
  });

  useEffect(() => {
    if (!data) return;

    setActivityData(data.activity?.activities);
    setAssessmentData(data.assessment?.assessments);
    setWeekTenData(true);

    return () => { };
  }, [data]);

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setActivityFeedbackId(null);
    setShowModal(false);
  };

  function getActivityAnswer(item) {
    const actData = activityData[0]?.answer;
    const userAnswer = actData?.find(
      (activity) => activity.id === item?.id
    )?.value;

    return item?.options?.find((data) => data.id === userAnswer)?.text;
  }

  function getActivityFeedback(item) {
    const actData = activityData[0]?.answer;
    const userAnswer = actData?.find(
      (activity) => activity.id === item?.id - 1
    )?.value;
    return item?.feedback[userAnswer];
  }

  const submitFeedback = (value) => {
    if (!activityFeedbackId?.itemId) {
      const answerData = activityData.find(
        (item) => item.page === activityFeedbackId.activityId
      );
      answerData.feedback = value;
      handleModalClose();
      mutation.mutate();
    } else {
      const answerData = activityData?.find(
        (item) => item.page === activityFeedbackId.activityId
      );

      if (!answerData.feedback) {
        answerData.feedback = [];
      }

      const existingFeedbackIndex = answerData.feedback.findIndex(
        (item) => item.stepId === activityFeedbackId.itemId
      );

      if (existingFeedbackIndex >= 0) {
        answerData.feedback[existingFeedbackIndex].value = value;
      } else {
        answerData.feedback.push({
          stepId: activityFeedbackId.itemId,
          value: value,
        });
      }

      handleModalClose();
      setModalData("");
      mutation.mutate();
    }
  };

  const score =
    calculateResult(assessments, assessmentData, assessments?.length) || 0;

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (data?.status === "failed" || isError || !data) {
    return <div>Take Activity to see feedback.</div>;
  }

  return (
    <>
      {/* Activity 1*/}
      <p className="bg-yellow py-1 px-2 py-md-3 px-md-5 text-gray d-inline-block rounded-5 fs-md-4">
        Activity 1
      </p>
      <hr />
      {[
        [q1, a1, f1],
        [q2, a2, f2],
        [q3, a3, f3],
        [q4, a4, f4],
        [q5, a5, f5],
        [q6, a6, f6],
        [q7, a7, f7],
        [q8, a8, f8],
        [q9, a9, f9],
        [q10, a10, f10],
        [q11, a11, f11],
        [q12, a12, f12],
      ].map(([question, answer, feedback], index) => (
        <React.Fragment key={index}>
          <div className="d-flex gap-3">
            <h2 className="text-blue fs-md-1">Question {index + 1}:</h2>
            <p className="text-blue fs-md-4">
              {question?.questions?.[0]?.question}
            </p>
          </div>
          <div className="d-flex gap-3">
            <h2 className="text-gray fs-md-1 text-gray">Answer:</h2>
            <p className="fs-md-5 flex-grow-1">{answer?.[0]}</p>

            {isAdmin && !feedback && (
              <Icon
                onClick={() => {
                  setActivityFeedbackId({
                    activityId: activity1.id,
                    itemId: index + 1,
                  });
                  handleModalOpen();
                }}
                style={{ color: "#D6D6D6" }}
                width={35}
                icon="tabler:message-2"
              />
            )}
          </div>
          {feedback && (
            <div className="d-flex gap-3">
              <p className="text-bg-secondary rounded-4 px-2 px-md-3 fs-md-5 align-self-start">
                Feedback
              </p>
              <p className="bg-step-active text-gray fs-md-5 flex-grow-1 p-1 p-md-2 rounded">
                {feedback}
              </p>
              {isAdmin && (
                <Icon
                  onClick={() => {
                    setModalData(feedback);
                    setActivityFeedbackId({
                      activityId: activity1.id,
                      itemId: index + 1,
                    });
                    handleModalOpen();
                  }}
                  style={{ color: "#275DAD" }}
                  width={35}
                  icon="lucide:edit"
                />
              )}
            </div>
          )}
          <hr />
        </React.Fragment>
      ))}

      {/* Assesment 1 */}
      <p className="bg-yellow py-1 px-2 py-md-3 px-md-5 text-gray d-inline-block rounded-5 fs-md-4">
        Assessment 1
      </p>
      <hr />
      {assessments.map(({ id, question, options, correctOption }, i) => {
        const selectedAnswer = assessmentData?.find(
          (answer) => answer.id === id
        )?.value;
        return (
          <>
            <div className="d-flex gap-3" key={i}>
              <h2 className="text-blue fs-md-1 text-nowrap">
                Questions {i + 1}:
              </h2>
              <p className="text-blue fs-md-4">{question}</p>
            </div>
            {options.map((option, index) => {
              const optionKey = Object.keys(option)[0];
              const optionText = option[optionKey];
              const isCorrectOption = correctOption === optionText;
              const isAnswer = selectedAnswer === optionText;

              return (
                <div
                  key={index}
                  className="d-flex gap-2 mb-3 align-items-center justify-content-between"
                >
                  <div className="d-flex gap-2">
                    <img
                      src={isAnswer ? checkedImage : unCheckedImage}
                      alt={`Option ${optionKey}`}
                      style={{ width: 20, height: 20 }}
                    />
                    <div>{`${optionText}. ${option.text}`}</div>
                  </div>
                  {isCorrectOption ? (
                    <p className="d-flex gap-1">
                      {" "}
                      <img
                        src={correct}
                        alt=""
                        style={{ width: 20, height: 20 }}
                      />{" "}
                      Correct
                    </p>
                  ) : (
                    <p className="d-flex gap-1">
                      {" "}
                      <img
                        src={wrong}
                        alt=""
                        style={{ width: 20, height: 20 }}
                      />
                      Wrong
                    </p>
                  )}
                </div>
              );
            })}
          </>
        );
      })}
      <hr />
      {/* Weekly Report */}
      <div className="bg-button p-3 p-md-5 rounded-4">
        <h2 className="text-white fs-md-1">Weekly Report</h2>
        <div className="d-flex flex-column flex-md-row gap-4">
          <h2 className="text-gray fs-md-1 ratio-1x1 bg-aqua rounded-4 p-3 p-md-5 d-flex justify-content-center border border-6 border-blue">
            {score}%
          </h2>
          <p className="text-white">
            {score < 40
              ? "Well done on starting your journey toward a smooth transition into secondary school! You’ve made an effort to understand important ideas like understanding your “why,” identifying what’s in your control, and the importance of values. There’s still room to deepen your understanding and practice what you’ve learned. Focus on building small habits, like managing your time more effectively or thinking about how a growth mindset can help you face challenges. Remember, every step you take brings you closer to feeling confident and ready for this new chapter. Keep trying—you’re capable of great things! Also, I recommend you take the course again from the beginning, as this will help you get more familiar with the concepts."
              : score < 60
                ? "Good job! You’ve made solid progress and shown a great understanding of how to transition into secondary school successfully. To build on this, try putting what you’ve learned into action more consistently. Practice navigating relationships with friends and family, and reflect on how your core values can guide your decisions. With steady effort, you’ll become even more prepared for this exciting new stage. Keep going—you’re on the right track!"
                : score < 80
                  ? "Great work! You’ve proven to have gained a good understanding of the key concepts that will help you navigate the exciting transition from primary to secondary school. You can start applying ideas like cultivating a growth mindset, focusing on what’s within your control, and understanding your core values. To build on this progress, try practicing these lessons in your daily life—whether it’s managing your time, setting goals, or building meaningful relationships. With consistent effort, you’ll feel more confident and ready to take on this new chapter. Keep it up—you’re doing well!"
                  : score < 95
                    ? "Excellent job! You’ve shown a strong grasp of the skills and mindset needed to transition smoothly into secondary school. Remember it’s highly important to keep applying what you’ve learned about time management, goal setting, and resilience in every way you can. To continue growing, focus on using these tools to face new challenges and opportunities everyday. Your hard work is paying off, and you’re well on your way to thriving in secondary school. Keep up the fantastic progress!"
                    : score <= 100
                      ? "Outstanding achievement! You’ve shown mastery and a deep understanding of the skills and mindset to navigate your transition into secondary school with confidence and purpose. Your understanding of growth and fixed mindsets, time management, and resilience is exceptional, and you’ve shown you can apply these concepts to real-life situations. You’re not only ready for this new stage but also equipped to make the most of it. Keep inspiring others with your example, and continue using these tools to grow and succeed in every area of your life. Well done—you’re ready to shine in secondary school!"
                      : ""}
          </p>
        </div>
        <Modal
          isOpen={showModal}
          closeModal={handleModalClose}
          data={modalData}
          handleSubmit={submitFeedback}
        />
      </div>
    </>
  );
}

export default Week10;
