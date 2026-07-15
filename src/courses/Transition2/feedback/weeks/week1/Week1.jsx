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

function Week1({ enrollmentId, setWeekOneData, isSchool, studentId }) {
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState("");
  const [activityFeedbackId, setActivityFeedbackId] = useState(null);
  const { pages } = getWeekContentExcludingVideos(1);

  const [
    activity1,
    activitySlider,
    activityWhy,
    activityFutureSelf,
    activityVisionBoard,
    activityScenarios,
  ] = pages;

  const [activityData, setActivityData] = useState([]);
  const [assessmentData, setAssessmentData] = useState([]);
  const { isAdmin, code } = useSelector(adminData);

  const { questions: assessments } = getWeekAssessment(1);
  // toDo: Fetch User assessment and Activity Data
  const { data, isPending, status, isError } = useQuery({
    queryKey: ["dashboard/transition2-feedback-1", enrollmentId, 1],
    queryFn: () => {
      if (isAdmin) return adminService.getUserCourseData(enrollmentId, 1, code);
      if (isSchool) return schoolService.getStudentCourseData(enrollmentId, 1, studentId);
      return userService.getUserCourseData(enrollmentId, 1);
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
        1,
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

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setActivityFeedbackId(null);
    setShowModal(false);
  };

  useEffect(() => {
    if (!data) return;

    console.log(data.activity?.activities);

    setActivityData(data.activity?.activities);
    setAssessmentData(data.assessment?.assessments);
    setWeekOneData(true);

    return () => { };
  }, [data]);

  function getActivityAnswer(activityId, itemId) {
    if (!itemId) {
      return activityData?.find((activity) => activity.page === activityId)
        ?.answer;
    } else {
      const answersList = activityData?.find(
        (activity) => activity.page === activityId
      )?.answer;

      const answerObject = answersList?.find(
        (activity) => activity.id === itemId
      )?.value;
      return answerObject ? answerObject : "";
    }
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
      )?.value;

      // return answerObject ? answerObject[index] : null;
      return answerObject ? answerObject : null;
    }
  }

  if (isPending) {
    return <div>Loading...</div>;
  }

  function getSelectedItems(selectedMap, items) {
    if (!selectedMap || typeof selectedMap !== "object") return [];

    // const items =

    return Object.keys(selectedMap)
      .filter((key) => selectedMap[key])
      .map((index) => items[Number(index)])

      .filter(Boolean);
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

  const renderFeedbackAction = (activityId) => (
    <>
      {isAdmin &&
        !activityData?.find((activity) => activity.page === activityId)
          ?.feedback && (
          <Icon
            onClick={() => {
              setActivityFeedbackId({ activityId });
              handleModalOpen();
            }}
            style={{ color: "#D6D6D6" }}
            width={35}
            icon="tabler:message-2"
          />
        )}
    </>
  );

  const renderFeedback = (activityId) =>
    activityData?.find((activity) => activity.page === activityId)
      ?.feedback && (
      <div className="d-flex gap-3">
        <p className="text-bg-secondary rounded-4 px-1 px-md-3 fs-md-5 align-self-start">
          Feedback
        </p>
        <p className="bg-step-active text-gray fs-md-5 flex-grow-1 p-md-2 p-1 rounded">
          {getActivityFeedback(activityId)}
        </p>
        {isAdmin && (
          <Icon
            onClick={() => {
              setModalData(getActivityFeedback(activityId));
              setActivityFeedbackId({ activityId });
              handleModalOpen();
            }}
            style={{ color: "#275DAD" }}
            width={35}
            icon="lucide:edit"
          />
        )}
      </div>
    );

  const renderScenarioFeedbackAction = (activityId, stepId) => {
    const feedback = getActivityFeedback(activityId, stepId);
    if (!isAdmin || feedback) return null;

    return (
      <Icon
        onClick={() => {
          setActivityFeedbackId({ activityId, itemId: stepId });
          handleModalOpen();
        }}
        style={{ color: "#D6D6D6" }}
        width={35}
        icon="tabler:message-2"
      />
    );
  };

  const renderScenarioFeedback = (activityId, stepId) => {
    const feedback = getActivityFeedback(activityId, stepId);
    if (!feedback) return null;

    return (
      <div className="d-flex gap-3">
        <p className="text-bg-secondary rounded-4 px-1 px-md-3 fs-md-5 align-self-start">
          Feedback
        </p>
        <p className="bg-step-active text-gray fs-md-5 flex-grow-1 p-md-2 p-1 rounded">
          {feedback}
        </p>
        {isAdmin && (
          <Icon
            onClick={() => {
              setModalData(feedback);
              setActivityFeedbackId({ activityId, itemId: stepId });
              handleModalOpen();
            }}
            style={{ color: "#275DAD" }}
            width={35}
            icon="lucide:edit"
          />
        )}
      </div>
    );
  };

  const getScenarioQuestionPairs = (activity) => {
    const steps = activity?.steps || [];
    return steps
      .filter((step) => step.type === "scenario")
      .map((scenarioStep) => {
        const questionStep = steps.find(
          (step) =>
            step.type === "question" && step.stepId === scenarioStep.stepId + 1
        );
        return { scenarioStep, questionStep };
      });
  };

  return (
    <>
      {" "}
      {/* Activity 1 */}
      <p className="bg-yellow py-md-3 px-md-5 py-1 px-2 text-gray d-inline-block rounded-5 fs-md-4">
        Activity 1
      </p>
      <hr />
      <div className="d-flex gap-3">
        <h2 className="text-blue fs-md-1">Questions:</h2>
        <p className="text-blue fs-md-4">{activity1.question}</p>
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
            <p className="text-bg-secondary rounded-4 px-1 px-md-3 fs-md-5 align-self-start">
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
      <p className="bg-yellow py-md-3 px-md-5 py-1 px-2 text-gray d-inline-block rounded-5 fs-md-4">
        Activity 2
      </p>
      <hr />
      <div className="d-flex gap-3">
        <h2 className="text-blue fs-md-1">Questions:</h2>
        <p className="text-blue fs-md-4">{activitySlider.question}</p>
      </div>
      <div className="d-flex gap-3">
        <h2 className="text-gray fs-md-1 text-gray">Answers:</h2>
        <p className="fs-md-5 flex-grow-1">
          {getActivityAnswer(activitySlider.id)}
        </p>
        {isAdmin &&
          !activityData?.find((activity) => activity.page === activitySlider.id)
            ?.feedback && (
            <Icon
              onClick={() => {
                setActivityFeedbackId({ activityId: activitySlider.id });
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
        activityData?.find((activity) => activity.page === activitySlider.id)
          ?.feedback && (
          <div className="d-flex gap-3">
            <p className="text-bg-secondary rounded-4 px-1 px-md-3 fs-md-5 align-self-start">
              Feedback
            </p>
            <p className="bg-step-active text-gray fs-md-5 flex-grow-1 p-md-2 p-1 rounded">
              {getActivityFeedback(activitySlider.id)}
            </p>
            {isAdmin && (
              <Icon
                onClick={() => {
                  setModalData(getActivityFeedback(activitySlider.id));
                  setActivityFeedbackId({ activityId: activitySlider.id });
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
      {/* Activity 3 */}
      <p className="bg-yellow py-md-3 px-md-5 py-1 px-2 text-gray d-inline-block rounded-5 fs-md-4">
        Activity 3
      </p>
      <hr />
      <div className="d-flex gap-3">
        <h2 className="text-blue fs-md-1">Questions:</h2>
        <p className="text-blue fs-md-4">{activityWhy.steps[0].question}</p>
      </div>
      <div className="d-flex gap-3">
        <h2 className="text-gray fs-md-1 text-gray">Answer:</h2>
        <div className="fs-md-5 flex-grow-1">
          <ul className="list-unstyled mb-2">
            {getSelectedItems(
              getActivityAnswer(activityWhy.id)?.checkboxAnswers,
              activityWhy.steps[0].options
            ).map((item, idx) => (
              <li key={idx}>{idx + 1}. {item}</li>
            ))}
          </ul>
          {getActivityAnswer(activityWhy.id)?.textAnswer && (
            <p className="mb-0">
              <span className="fw-bold">Other: </span>
              {getActivityAnswer(activityWhy.id)?.textAnswer}
            </p>
          )}
        </div>
        {renderFeedbackAction(activityWhy.id)}
      </div>
      {renderFeedback(activityWhy.id)}
      <hr />

      {/* Activity 4 */}
      <p className="bg-yellow py-1 px-2 py-md-3 px-md-5 text-gray d-inline-block rounded-5 fs-md-4">
        Activity 4
      </p>
      <hr />
      <div className="d-flex gap-3">
        <h2 className="text-blue fs-md-1">Questions:</h2>
        <p className="text-blue fs-md-4">{activityFutureSelf.steps[0].question}</p>
      </div>
      <div className="d-flex gap-3">
        <h2 className="text-gray fs-md-1 text-gray">Answer:</h2>
        <ul className="list-unstyled fs-md-2 flex-grow-1">
          {getSelectedItems(
            getActivityAnswer(activityFutureSelf.id)?.checkboxAnswers,
            activityFutureSelf.steps[0].options
          ).map((item, idx) => (
            <li key={idx} className="text-lg">
              {idx + 1}. {item}
            </li>
          ))}
        </ul>
        {renderFeedbackAction(activityFutureSelf.id)}
      </div>
      {renderFeedback(activityFutureSelf.id)}
      <hr />

      {/* Activity 5 */}
      <p className="bg-yellow py-1 px-2 py-md-3 px-md-5 text-gray d-inline-block rounded-5 fs-md-4">
        Activity 5
      </p>
      <hr />
      <div className="d-flex gap-3">
        <h2 className="text-blue fs-md-1">Questions:</h2>
        <p className="text-blue fs-md-4">{activityVisionBoard.steps[0].question}</p>
      </div>
      <div className="d-flex gap-3">
        <h2 className="text-gray fs-md-1 text-gray">Answer:</h2>
        <p className="fs-md-5 flex-grow-1">
          {getActivityAnswer(activityVisionBoard.id)?.textAnswer}
        </p>
        {renderFeedbackAction(activityVisionBoard.id)}
      </div>
      <div className="d-flex gap-3">
        <h2 className="text-blue fs-md-1">Questions:</h2>
        <p className="text-blue fs-md-4">{activityVisionBoard.steps[1].question}</p>
      </div>
      <div className="d-flex gap-3">
        <h2 className="text-gray fs-md-1 text-gray">Answer:</h2>
        <div className="fs-md-5 flex-grow-1">
          <p>
            <span className="fw-bold">Because: </span>
            {getActivityAnswer(activityVisionBoard.id)?.sentenceAnswer?.reason}
          </p>
          <p>
            <span className="fw-bold">Person I want to become: </span>
            {getActivityAnswer(activityVisionBoard.id)?.sentenceAnswer?.identity}
          </p>
        </div>
      </div>
      {renderFeedback(activityVisionBoard.id)}
      <hr />

      {/* Activity 6 */}
      <p className="bg-yellow py-1 px-2 py-md-3 px-md-5 text-gray d-inline-block rounded-5 fs-md-4">
        Activity 6
      </p>
      <hr />
      {getScenarioQuestionPairs(activityScenarios).map(
        ({ scenarioStep, questionStep }, idx) => (
          <div key={scenarioStep.stepId}>
            <div className="d-flex gap-3">
              <h2 className="text-blue fs-md-1 text-nowrap">
                Scenario {idx + 1}:
              </h2>
              <p className="text-blue fs-md-4">{scenarioStep.scenarioText}</p>
            </div>
            <div className="d-flex gap-3">
              <h2 className="text-blue fs-md-1 text-nowrap">The Challenge:</h2>
              <p className="text-blue fs-md-4">{questionStep?.question}</p>
            </div>
            <div className="d-flex gap-3">
              <h2 className="text-gray fs-md-1 text-gray">Answer:</h2>
              <p className="fs-md-5 flex-grow-1">
                {getActivityAnswer(activityScenarios.id)?.[questionStep?.stepId]}
              </p>
              {renderScenarioFeedbackAction(
                activityScenarios.id,
                questionStep?.stepId
              )}
            </div>
            {renderScenarioFeedback(
              activityScenarios.id,
              questionStep?.stepId
            )}
          </div>
        )
      )}
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
              // console.log(assessmentData,"AssessmentData")

              return (
                <div
                  key={index}
                  className="d-flex gap-md-2 p-0 p-md-1 mb-3 justify-content-between"
                >
                  <div className="d-flex gap-md-2 p-1">
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
              ? "You've taken your first step toward preparing for university life, and that already matters. You're beginning to understand important ideas like purpose, independence, mindset, and responsibility. However, you may still be building clarity around how these concepts apply directly to your own life. This is a great time to pause and reflect: Why are you really going to university? What kind of person do you want to become in this next chapter? How do your choices today connect to your future goals? Revisit your notes, reflect on your values, and talk through these ideas with someone you trust. Growth doesn't happen overnight, it happens through awareness and intentional effort. You're at the beginning of that journey."
              : score < 60
                ? "Good effort! You're developing a solid understanding of the transition into university life. You recognize the importance of purpose, growth mindset, financial awareness, and balancing freedom with responsibility. You're beginning to see how your mindset and values shape your decisions. To strengthen your preparation, focus on practical application: How will you manage your time weekly? What systems will help you stay disciplined? Who will be part of your support network? The more intentional you are now, the smoother your transition will be. Keep building awareness and turning insight into action."
                : score < 80
                  ? "Well done! You've shown a strong understanding of the skills needed to thrive in university. You understand how purpose fuels motivation, how a growth mindset builds resilience, and how financial and social intelligence reduce unnecessary stress. You're beginning to think strategically about your independence. To level up further, focus on consistent practice of managing your time, setting small goals, and making decisions aligned with your values even now. You're building the mindset of someone who doesn't just survive post secondary school life, but thrives in it."
                  : score < 95
                    ? "Excellent work! You demonstrate clear readiness for this next chapter. You understand the balance between freedom and responsibility and are thinking intentionally about your purpose, relationships, finances, and long-term goals. You likely have a strong awareness of your values and how they guide your decisions. Keep refining your Personal Action Plan and practicing resilience strategies. Continue developing leadership in your own life: your independence, discipline, and clarity will shape your success. You're stepping into university prepared, not just academically, but personally."
                    : score <= 100
                      ? "Outstanding achievement! You've demonstrated exceptional clarity, self-awareness, and readiness for university life. You understand your why, embrace growth challenges, think responsibly about finances and relationships, and approach independence with maturity. You're not just preparing for university; you're designing your future intentionally. Continue to reflect, adapt, and lead yourself wisely. Remember, resilience and consistency will carry you further than talent alone. You are entering this next chapter with confidence, direction, and purpose."
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

export default Week1;

