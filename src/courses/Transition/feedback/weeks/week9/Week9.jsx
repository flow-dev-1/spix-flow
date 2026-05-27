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
import { useQuery } from "@tanstack/react-query";
import userService from "@/services/api/user";
import schoolService from "@/services/api/school";
import adminService from "@/services/api/admin";
import { calculateResult } from "../../../utility.js";
import { useSelector } from "react-redux";
import { adminData } from "@/store/adminReducer";
import Modal from "../../components/Modal.jsx";
import { useMutation } from "@tanstack/react-query";

function Week9({ enrollmentId, setWeekNineData, isSchool, studentId }) {
  const { pages } = getWeekContentExcludingVideos(9);
  const [activity1, activity2, activity3] = pages;
  const [activityData, setActivityData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState("");
  const [activityFeedbackId, setActivityFeedbackId] = useState(null);
  const [assessmentData, setAssessmentData] = useState([]);
  const { isAdmin, code } = useSelector(adminData);

  const [Q1, Q2] = activity2.steps;
  const [A1, A2] = activityData?.[1]?.answer?.map((a) => a.value) || [];
  const [F1, F2] = activityData?.[1]?.feedback?.map((a) => a.value) || [];

  const [_, q1, q2, q3, q4, q5] = activity3.steps;
  const [a1, a2, a3, a4, a5] =
    activityData?.[2]?.answer?.map((a) => a.value) || [];
  const [f1, f2, f3, f4, f5] =
    activityData?.[2]?.feedback?.map((a) => a.value) || [];

  const { questions: assessments } = getWeekAssessment(9);
  // toDo: Fetch User assessment and Activity Data
  const { data, isPending, status, isError } = useQuery({
    queryKey: ["dashboard/transition-feedback-9", enrollmentId, 9],
    queryFn: () => {
      if (isAdmin) return adminService.getUserCourseData(enrollmentId, 9, code);
      if (isSchool) return schoolService.getStudentCourseData(enrollmentId, 9, studentId);
      return userService.getUserCourseData(enrollmentId, 9);
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
        9,
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
    setWeekNineData(true);

    return () => { };
  }, [data]);

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setActivityFeedbackId(null);
    setShowModal(false);
  };

  function getActivityAnswer(activityId) {
    return activityData?.find((activity) => activity.page === activityId)
      ?.answer;
  }

  function getActivityFeedback(activityId, itemId, index) {
    if (!itemId) {
      return activityData?.find((activity) => activity.page === activityId)
        ?.feedback;
    } else {
      const answersList = activityData?.find(
        (activity) => activity.page === activityId
      )?.feedback;
      const answerObject = answersList?.find(
        (activity) => activity.stepId === itemId
      ).value;

      // return answerObject ? answerObject[index] : null;
      return answerObject ? answerObject : null;
    }
  }

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (data?.status === "failed" || isError || !data) {
    return <div>Take Activity to see feedback.</div>;
  }

  const score =
    calculateResult(assessments, assessmentData, assessments?.length) || 0;

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

  const renderActivity3 = (question, answer, feedback, activityId, index) => {
    return (
      <div key={index}>
        <div>
          <span
            style={{ backgroundColor: "#FF728B" }}
            className="rounded-3 text-white px-2 px-md-3 py-1"
          >
            Challenge
          </span>
        </div>

        <div className="d-flex gap-3 align-items-center mb-2">
          <p className="fs-md-5 flex-grow-1 mb-0">{question.challenge}</p>
        </div>

        <div>
          <span className="bg-success rounded-3 text-white px-2 px-md-3 py-1">
            Your "YET" statement
          </span>
        </div>

        <div className="d-flex gap-3 align-items-center mb-3">
          <h2 className="text-gray fs-md-1 mb-0">Answer:</h2>
          <p className="fs-md-5 flex-grow-1 mb-0">{answer?.[0]}</p>
          {isAdmin && !feedback && (
            <Icon
              onClick={() => {
                setActivityFeedbackId({ activityId, itemId: index + 1 });
                handleModalOpen();
              }}
              style={{ color: "#D6D6D6" }}
              width={35}
              icon="tabler:message-2"
            />
          )}
        </div>

        {feedback && (
          <div className="d-flex gap-3 mb-3">
            <p className="text-bg-secondary rounded-4 px-2 px-md-3 fs-md-5 align-self-start mb-0">
              Feedback
            </p>
            <p className="bg-step-active text-gray fs-md-5 flex-grow-1 p-1 p-md-2 rounded mb-0">
              {feedback}
            </p>
            {isAdmin && (
              <Icon
                onClick={() => {
                  setModalData(feedback);
                  setActivityFeedbackId({ activityId, itemId: index + 1 });
                  handleModalOpen();
                }}
                style={{ color: "#275DAD" }}
                width={35}
                icon="lucide:edit"
              />
            )}
          </div>
        )}
      </div>
    );
  };

  function drag1(type) {
    if (!a5) return [];

    const indices = type === "healthy" ? a5.green : a5.red;
    return indices?.map((index) => q5?.images[index]) || [];
  }

  return (
    <>
      {/* Activity 1 */}
      <p className="bg-yellow py-1 px-2 py-md-3 px-md-5 text-gray d-inline-block rounded-5 fs-md-4">
        Activity 1
      </p>
      <hr />
      <div className="d-flex gap-3">
        <h2 className="text-blue fs-md-1">Questions:</h2>
        <p className="text-blue fs-md-4">{activity1.question} "Resilience"?</p>
      </div>
      <div className="d-flex gap-3">
        <h2 className="text-gray fs-md-1 text-gray">Answers:</h2>
        <p className="fs-md-5 flex-grow-1">{getActivityAnswer(activity1.id)}</p>
        {isAdmin &&
          !activityData?.find((activity) => activity.page === activity1.id)
            ?.feedback && (
            <Icon
              onClick={() => {
                setActivityFeedbackId({ activityId: activity1.id });
                handleModalOpen();
              }}
              style={{ color: "#D6D6D6" }}
              width={35}
              icon="tabler:message-2"
            />
          )}
      </div>
      {
        // Show this only id theres a feedback
        activityData?.find((activity) => activity.page === activity1.id)
          ?.feedback && (
          <div className="d-flex gap-3">
            <p className="text-bg-secondary rounded-4 px-2 px-md-3 fs-md-5 align-self-start">
              Feedback
            </p>
            <p className="bg-step-active text-gray fs-md-5 flex-grow-1 p-1 p-md-2 rounded">
              {getActivityFeedback(activity1.id)}
            </p>
            {isAdmin && (
              <Icon
                onClick={() => {
                  setModalData(getActivityFeedback(activity1.id));
                  setActivityFeedbackId({ activityId: activity1.id });
                  handleModalOpen();
                }}
                style={{ color: "#275DAD" }}
                width={35}
                icon="lucide:edit"
              />
            )}
          </div>
        )
      }
      <hr />

      {/* Activity 2 */}
      <p className="bg-yellow py-1 px-2 py-md-3 px-md-5 text-gray d-inline-block rounded-5 fs-md-4">
        Activity 2
      </p>
      <hr />
      <>
        <div className="d-flex gap-3">
          <h2 className="text-blue fs-md-1">Question 1:</h2>
          <p className="text-blue fs-md-4">{Q1.question} "Coping Skills"?</p>
        </div>
        <div className="d-flex gap-3">
          <h2 className="text-gray fs-md-1 text-gray">Answers:</h2>
          <p className="fs-md-5 flex-grow-1">
            {A1 && typeof A1 === "object" ? A1[0] : ""}
          </p>
          {isAdmin && !F1 && (
            <Icon
              onClick={() => {
                setActivityFeedbackId({ activityId: activity2.id, itemId: 1 });
                handleModalOpen();
              }}
              style={{ color: "#D6D6D6" }}
              width={35}
              icon="tabler:message-2"
            />
          )}
        </div>
        {
          // Show this only id theres a feedback
          F1 && (
            <div className="d-flex gap-3">
              <p className="text-bg-secondary rounded-4 px-2 px-md-3 fs-md-5 align-self-start">
                Feedback
              </p>
              <p className="bg-step-active text-gray fs-md-5 flex-grow-1 p-1 p-md-2 rounded">
                {F1}
              </p>
              {isAdmin && (
                <Icon
                  onClick={() => {
                    setModalData(F1);
                    setActivityFeedbackId({
                      activityId: activity2.id,
                      itemId: 1,
                    });
                    handleModalOpen();
                  }}
                  style={{ color: "#275DAD" }}
                  width={35}
                  icon="lucide:edit"
                />
              )}
            </div>
          )
        }
      </>

      <>
        <div className="d-flex gap-3">
          <h2 className="text-blue fs-md-1">Question 2:</h2>
          <p className="text-blue fs-md-4">{Q2.question}</p>
        </div>
        <div className="d-flex gap-3">
          <h2 className="text-gray fs-md-1 text-gray">Answers:</h2>
          <ul className="list-unstyled fs-md-5 flex-grow-1">
            {Object.values(A2 || {}).map((value, idx) => (
              <li key={idx} className="fs-md-5">
                {`${idx + 1}. ${value}`}
              </li>
            ))}
          </ul>
          {isAdmin && !F2 && (
            <Icon
              onClick={() => {
                setActivityFeedbackId({ activityId: activity2.id, itemId: 2 });
                handleModalOpen();
              }}
              style={{ color: "#D6D6D6" }}
              width={35}
              icon="tabler:message-2"
            />
          )}
        </div>
        {
          // Show this only id theres a feedback
          F2 && (
            <div className="d-flex gap-3">
              <p className="text-bg-secondary rounded-4 px-2 px-md-3 fs-md-5 align-self-start">
                Feedback
              </p>
              <p className="bg-step-active text-gray fs-md-5 flex-grow-1 p-1 p-md-2 rounded">
                {F2}
              </p>
              {isAdmin && (
                <Icon
                  onClick={() => {
                    setModalData(F2);
                    setActivityFeedbackId({
                      activityId: activity2.id,
                      itemId: 2,
                    });
                    handleModalOpen();
                  }}
                  style={{ color: "#275DAD" }}
                  width={35}
                  icon="lucide:edit"
                />
              )}
            </div>
          )
        }
      </>
      <hr />

      {/* Activity 3 */}
      <p className="bg-yellow py-1 px-2 py-md-3 px-md-5 text-gray d-inline-block rounded-5 fs-md-4">
        Activity 3
      </p>
      <hr />

      <>
        <div className="d-flex gap-3 align-items-center">
          <h2 className="text-blue fs-md-1">Question 1:</h2>
          <p className="text-blue fs-md-4 mb-0">
            Use the power of yet to demonstrate resilience in challenging
            situations.
          </p>
        </div>
        {[q1, q2, q3, q4].map((question, index) =>
          renderActivity3(
            question,
            [a1, a2, a3, a4][index],
            [f1, f2, f3, f4][index],
            activity3.id,
            index
          )
        )}
      </>

      <>
        <div className="d-flex gap-3 align-items-center">
          <h2 className="text-blue fs-md-1">Question 2:</h2>
          <p className="text-blue fs-md-4 mb-0">
            Drag-and-drop the statements on the left into any of these bowls.
          </p>
        </div>
        <div className="d-flex gap-3">
          <h2 className="text-gray fs-md-1 text-gray">Answers:</h2>
          <div className="flex-grow-1 d-flex">
            <div className="flex-grow-1">
              <h2 className="text-center bg-green text-white py-1 py-md-3 fs-md-1">
                Healthy Skills
              </h2>
              <div className="px-2 px-md-5 py-1 py-md-3">
                {drag1("healthy")?.map((item, idx) => (
                  <p className="fs-md-4">
                    {idx + 1}. {item}
                  </p>
                ))}
              </div>
            </div>
            <div className="flex-grow-1">
              <h2 className="bg-red text-center text-white py-1 py-md-3 fs-md-1">
                Unhealthy Skills
              </h2>
              <div className="px-2 px-md-5 py-1 py-md-3">
                {drag1("unhealthy")?.map((item, idx) => (
                  <p className="fs-md-4">
                    {idx + 1}. {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
          {isAdmin && !f5 && (
            <Icon
              onClick={() => {
                setActivityFeedbackId({ activityId: activity3.id, itemId: 5 });
                handleModalOpen();
              }}
              style={{ color: "#D6D6D6" }}
              width={35}
              icon="tabler:message-2"
            />
          )}
        </div>
        {
          // Show this only id theres a feedback
          f5 && (
            <div className="d-flex gap-3">
              <p className="text-bg-secondary rounded-4 px-2 px-md-3 fs-md-5 align-self-start">
                Feedback
              </p>
              <p className="bg-step-active text-gray fs-md-5 flex-grow-1 p-1 p-md-2 rounded">
                {f5}
              </p>
              {isAdmin && (
                <Icon
                  onClick={() => {
                    setModalData(f5);
                    setActivityFeedbackId({
                      activityId: activity3.id,
                      itemId: 5,
                    });
                    handleModalOpen();
                  }}
                  style={{ color: "#275DAD" }}
                  width={35}
                  icon="lucide:edit"
                />
              )}
            </div>
          )
        }
      </>

      <hr />

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
            <div className="d-flex align-items-center gap-3" key={i}>
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
                  className="d-flex gap-1 p-md-2 mb-3 align-items-center justify-content-between"
                >
                  <div className="d-flex gap-1 p-md-2">
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

export default Week9;
