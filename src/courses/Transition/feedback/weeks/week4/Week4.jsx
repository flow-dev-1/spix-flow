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

function Week4({ enrollmentId, setWeekFourData, isSchool, studentId }) {
  const { pages } = getWeekContentExcludingVideos(4);
  const [activity1, activity2, activity3] = pages;
  const [activityData, setActivityData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState("");
  const [activityFeedbackId, setActivityFeedbackId] = useState(null);
  const [assessmentData, setAssessmentData] = useState([]);
  const { isAdmin, code } = useSelector(adminData);

  const [Q1, Q2, Q3] = activity2.steps;
  const [A1, A2, A3] = activityData?.[1]?.answer?.map((a) => a.value) || [];

  const [q1, q2, q3] = activity3.steps;
  const [a1, a2, a3] = activityData?.[2]?.answer?.map((a) => a.value) || [];
  const [f1, f2, f3] = activityData?.[2]?.feedback?.map((a) => a.value) || [];

  const { questions: assessments } = getWeekAssessment(4);
  // toDo: Fetch User assessment and Activity Data
  const { data, isPending, status, isError } = useQuery({
    queryKey: ["dashboard/transition-feedback-4", enrollmentId, 4],
    queryFn: () => {
      if (isAdmin) return adminService.getUserCourseData(enrollmentId, 4, code);
      if (isSchool) return schoolService.getStudentCourseData(enrollmentId, 4, studentId);
      return userService.getUserCourseData(enrollmentId, 4);
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
        4,
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
    setWeekFourData(true);

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

  function renderActivity2() {
    const renderAnswers = (question, answer) => {
      if (!answer) return null;

      const selectedIndices = Object.entries(answer)
        .filter(([_, value]) => value === true)
        .map(([index]) => parseInt(index));

      const selectedValues = question
        .filter((_, index) => selectedIndices.includes(index))
        .map((item) => item.value);

      return selectedValues.join(", ");
    };

    return (
      <>
        <div className="d-flex gap-3">
          <h2 className="text-blue fs-md-1">Questions:</h2>
          <p className="text-blue fs-md-4">{activity2?.instruction}</p>
        </div>

        <div className="d-flex gap-3">
          <h2 className="text-gray fs-md-1 text-gray">Answer:</h2>
          <ul className="list-unstyled fs-md-5 flex-grow-1">
            {[
              [Q1, A1],
              [Q2, A2],
              [Q3, A3],
            ].map(([question, answer], index) => (
              <li key={index} className="mb-4">
                <div className="d-flex align-items-start gap-3">
                  <span className="fs-md-4">•</span>
                  <div className="d-flex gap-3 flex-grow-1">
                    <p className="text-blue fs-md-4 mb-0">
                      {question.question}
                    </p>
                    <p className="text-gray fs-md-4 mb-0">
                      {renderAnswers(question.options, answer)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {isAdmin &&
            !activityData?.find((activity) => activity.page === activity2.id)
              ?.feedback && (
              <Icon
                onClick={() => {
                  setActivityFeedbackId({ activityId: activity2.id });
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
          activityData?.find((activity) => activity.page === activity2.id)
            ?.feedback && (
            <div className="d-flex gap-3">
              <p className="text-bg-secondary rounded-4 px-md-3 px-1 fs-md-5 align-self-start">
                Feedback
              </p>
              <p className="bg-step-active text-gray fs-md-5 flex-grow-1 p-md-2 p-1 rounded">
                {getActivityFeedback(activity2.id)}
              </p>
              {isAdmin && (
                <Icon
                  onClick={() => {
                    setModalData(getActivityFeedback(activity2.id));
                    setActivityFeedbackId({ activityId: activity2.id });
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
    );
  }

  function renderActivity3() {
    const questions = [q1, q2, q3];
    const answers = [a1, a2, a3];
    const feedbacks = [f1, f2, f3];

    return questions.map((question, index) => (
      <>
        <div className="d-flex gap-3">
          <h2 className="text-blue fs-md-1">Questions:</h2>
          <p className="text-blue fs-md-4">{question.question}</p>
        </div>

        <div className="d-flex gap-3">
          <h2 className="text-gray fs-md-1 text-gray">Answer:</h2>
          <ul className="list-unstyled fs-md-5 flex-grow-1">
            {Object.values(answers[index] || {}).map((value, idx) => (
              <li key={idx} className="fs-md-5">
                {idx + 1}. {value}
              </li>
            ))}
          </ul>

          {isAdmin && !feedbacks[index] && (
            <Icon
              onClick={() => {
                setActivityFeedbackId({
                  activityId: activity3.id,
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

        {feedbacks[index] && (
          <div className="d-flex gap-3">
            <p className="text-bg-secondary rounded-4 px-md-3 px-1 fs-md-5 align-self-start">
              Feedback
            </p>
            <p className="bg-step-active text-gray fs-md-5 flex-grow-1 p-md-2 p-1 rounded">
              {feedbacks[index]}
            </p>
            {isAdmin && (
              <Icon
                onClick={() => {
                  setModalData(feedbacks[index]);
                  setActivityFeedbackId({
                    activityId: activity3.id,
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
      </>
    ));
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
        <p className="text-blue fs-md-4">{activity1.question} "Values"?</p>
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
            <p className="text-bg-secondary rounded-4 px-md-3 px-1 fs-md-5 align-self-start">
              Feedback
            </p>
            <p className="bg-step-active text-gray fs-md-5 flex-grow-1 p-md-2 p-1 rounded">
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
      {renderActivity2()}
      <hr />

      {/* Activity 3 */}
      <p className="bg-yellow py-1 px-2 py-md-3 px-md-5 text-gray d-inline-block rounded-5 fs-md-4">
        Activity 3
      </p>
      <hr />
      {renderActivity3()}

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

export default Week4;
