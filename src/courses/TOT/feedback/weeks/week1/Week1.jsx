import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import checkedImage from "@/assets/checkedbox.png";
import unCheckedImage from "@/assets/uncheckedBox.png";
import correct from "@/assets/correct.png";
import wrong from "@/assets/wrong.png";
import {
  getWeekAssessment,
  getWeekContentExcludingVideos,
  getWeekPreAssessment,
} from "../../../data/index.js";
import { useQuery } from "@tanstack/react-query";
import userService from "@/services/api/user";
import adminService from "@/services/api/admin";
import { calculateResult } from "../../../utility.js";
import { useSelector } from "react-redux";
import { adminData } from "@/store/adminReducer";
import Modal from "../../components/Modal.jsx";
import { useMutation } from "@tanstack/react-query";

function Week1({ enrollmentId, setWeekOneData }) {
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState("");
  const [activityFeedbackId, setActivityFeedbackId] = useState(null);
  const { pages } = getWeekContentExcludingVideos(1);

  const [
    _,
    __,
    activity2,
    activity3,
    activity4,
    activity5,
    activity6,
    activity7,
    activity8,
    activity9,
    activity10,
  ] = pages;

  const [activityData, setActivityData] = useState([]);
  const [assessmentData, setAssessmentData] = useState([]);
  const [preAssessmentData, setPreAssessmentData] = useState([]);
  const { isAdmin, code } = useSelector(adminData);

  const [F1, F2] = activityData?.[3]?.feedback?.map((a) => a.value) || [];
  const { questions: assessments } = getWeekAssessment(1);
  const { questions: preAssessments } = getWeekPreAssessment(1);
  // toDo: Fetch User assessment and Activity Data
  const { data, isPending, status, isError } = useQuery({
    queryKey: ["dashboard/tot-feedback-1", enrollmentId, 1],
    queryFn: () =>
      isAdmin
        ? adminService.getUserCourseData(enrollmentId, 1, code)
        : userService.getUserCourseData(enrollmentId, 1),
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

    setActivityData(data.activity?.activities);
    setAssessmentData(data.assessment?.assessments);
    setPreAssessmentData(
      data.activity?.activities.find((p) => p.page == 2).answer
    );
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
      ).value;

      // return answerObject ? answerObject[index] : null;
      return answerObject ? answerObject : null;
    }
  }

  // Utility function to get the emoji based on feeling value
  // todo: map the emojis correctly, couldnt copy from figma
  function getFeelingEmoji(feeling) {
    switch (feeling) {
      case "feeling1":
        return "😄";
      case "feeling2":
        return "🙂";
      case "feeling3":
        return "😊";
      case "feeling4":
        return "😁";
      case "feeling5":
        return "🤩";
      default:
        return "";
    }
  }
  function drag1(type) {
    console.log(activityData, "Activity Data");
    if (!activityData || !activityData[2] || !activityData[2].answer) return [];

    const indices =
      type === "yes"
        ? activityData[2]?.answer?.[0]?.value?.green
        : activityData[2]?.answer?.[0]?.value?.red;

    return indices?.map((index) => activity2?.steps?.[1].images[index]) || [];
  }

  function drag2(type, pairId) {
    console.log(activityData, "Activity Data");
    if (!activityData || !activityData[4] || !activityData[4].answer) return [];

    const values = activityData[4]?.answer?.[0]?.value;
    if (!values) return [];

    // Get indices array based on type ("sel" → green, otherwise red)
    const indices = type === "sel" ? values.green : values.red;
    if (!Array.isArray(indices)) return [];

    // Determine which values to look for based on pairId
    const pairMap = {
      1: [0, 1],
      2: [2, 3],
      3: [4, 5],
    };

    const targetValues = pairMap[pairId] || [];

    // console.log(indices, "Indices");

    // console.log(activity4, "Activity 2");

    // Filter images in this pair whose id matches one of the target values present in indices
    const images =
      activity4?.steps[1].imagePairs[pairId - 1]?.images?.filter(
        (image) => indices.includes(image.id) && targetValues.includes(image.id)
      ) || [];

    return images;
  }
  function getOptionDetails(option) {
    const options = [
      {
        id: "A",
        text: "Self Awareness",
        subText: "(Recognizing emotions & strengths)",
      },
      {
        id: "B",
        text: "Self Management",
        subText: "(Regulating emotions & stress)",
      },
      {
        id: "C",
        text: "Social Awareness",
        subText: "(Empathy & understanding perspectives)",
      },
      {
        id: "D",
        text: "Relationship Skills",
        subText: "(Building positive interactions)",
      },
      {
        id: "E",
        text: "Responsible Decision Making",
        subText: "(Making ethical and safe choices)",
      },
    ];

    return options.find((item) => item.id === option) || null;
  }

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (data?.status === "failed" || isError) {
    return <div>{data?.message || "Internal server error!"}</div>;
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

  return (
    <>
      {/* PreAssesment 1 */}
      <p className="bg-blue py-1 px-1 py-md-3 px-md-2 text-white d-inline-block rounded-5 fs-md-4">
        Pre-Assessment
      </p>
      <hr />
      {preAssessments.map(({ id, question, options, correctOption }, i) => {
        // todo:  fetch preassesment data from backend and switch
        const selectedAnswer = Array.isArray(preAssessmentData)
          ? preAssessmentData.find((answer) => answer.id === id)?.value
          : undefined;
        return (
          <>
            <div className="d-flex gap-3" key={i}>
              <p
                className="text-blue fs-md-1 text-nowrap week-2-question-text fw-bold"
                style={{ fontSize: 1 + "em" }}
              >
                Questions {i + 1}:
              </p>
              <p
                className="text-blue fs-md-4 week-2-question-text"
                style={{ fontSize: 1 + "em" }}
              >
                {question}
              </p>
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
                    <div
                      className="week-2-question-text text-gray"
                      style={{ fontSize: 1 + "em" }}
                    >{`${optionText}. ${option.text}`}</div>
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
      {/* Activity 1 */}
      <p className="bg-blue py-md-3 px-md-5 py-1 px-2 text-white d-inline-block rounded-5 fs-md-4">
        Activity 1 Mood Checker
      </p>
      <hr />
      <div className="d-flex gap-3">
        <p
          className="text-blue fs-md-1 week-2-question-text fw-bold"
          style={{ fontSize: 1 + "em" }}
        >
          Questions:
        </p>
        <p
          className="text-blue fs-md-4 week-2-question-text"
          style={{ fontSize: 1 + "em" }}
        >
          How are we feeling today?
        </p>
      </div>
      <div className="d-flex gap-3">
        <p
          className="fw-bold text-gray fs-md-1 text-gray week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          Answers:
        </p>
        <p className="fs-md-5 flex-grow-1">
          {(() => {
            const answers = getActivityAnswer(4);
            if (!Array.isArray(answers)) return "";

            const feelingAnswer = answers.find((a) => a.name === "feeling");
            if (!feelingAnswer || !feelingAnswer.value) return "";

            return getFeelingEmoji(feelingAnswer.value);
          })()}
        </p>

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
            <p className="text-bg-secondary rounded-4 px-1 px-md-3 fs-md-5 align-self-start">
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
      <hr />
      {/* Activity 2 */}
      <p className="bg-blue py-md-3 px-md-5 py-1 px-2 text-white d-inline-block rounded-5 fs-md-4">
        Activity 2
      </p>
      <hr />
      <div className="d-flex gap-3">
        <p
          className="text-blue fs-md-1 week-2-question-text fw-bold"
          style={{ fontSize: 1 + "em" }}
        >
          Questions:
        </p>
        <p
          className="text-blue fs-md-4 week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          {activity2.steps[1].instruction}
        </p>
      </div>
      <div className="d-flex gap-3">
        <p
          className="text-gray fs-md-1 text-gray week-2-question-text"
          style={{ fontSize: 1 + "em" }}
        >
          Answers:
        </p>
        <div className="flex-grow-1 d-flex">
          <div className="flex-grow-1">
            <p
              className="text-center bg-green text-white py-md-3 py-1 fs-md-1 week-2-question-text"
              style={{ fontSize: 1 + "em" }}
            >
              YES
            </p>
            <div className="px-2 py-1 px-md-5 py-md-3">
              {drag1("yes")?.map((item, idx) => (
                <p className="fs-md-4">
                  {idx + 1}. {item}
                </p>
              ))}
            </div>
          </div>
          <div className="flex-grow-1">
            <p
              className="bg-red text-center text-white py-md-3 py-1 fs-md-1 week-2-question-text"
              style={{ fontSize: 1 + "em" }}
            >
              NO
            </p>
            <div className="px-2 py-1 px-md-5 py-md-3">
              {drag1("no")?.map((item, idx) => (
                <p className="fs-md-4">
                  {idx + 1}. {item}
                </p>
              ))}
            </div>
          </div>
        </div>

        {
          //This is only Visible for Flow Admins
          isAdmin &&
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
          )
        }
      </div>
      {
        // Show this only id theres a feedback
        activityData?.find((activity) => activity.page === activity2.id)
          ?.feedback && (
          <div className="d-flex gap-3">
            <p className="text-bg-secondary rounded-4 px-1 px-md-3 fs-md-5 align-self-start">
              Feedback
            </p>
            <p className="bg-step-active text-gray fs-md-5 flex-grow-1 p-1 p-md-2 rounded">
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
      <hr />

      {/* Activity 3 */}
      <p className="bg-blue py-md-3 px-md-5 py-1 px-2 text-white d-inline-block rounded-5 fs-md-4">
        Activity 3
      </p>
      <hr />
      <div className="d-flex gap-3">
        <p
          className="text-blue fs-md-1 week-2-question-text fw-bold"
          style={{ fontSize: 1 + "em" }}
        >
          Questions:
        </p>
        <p
          className="text-blue fs-md-4 week-2-question-text"
          style={{ fontSize: 1 + "em" }}
        >
          {activity3.question}
        </p>
      </div>
      <div className="d-flex gap-3">
        <p
          className="fw-bold text-gray fs-md-1 text-gray week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          Answers:
        </p>
        <p className="fs-md-5 flex-grow-1">{getActivityAnswer(activity3.id)}</p>
        {isAdmin &&
          !activityData?.find((activity) => activity.page === activity3.id)
            ?.feedback && (
            <Icon
              onClick={() => {
                setActivityFeedbackId({ activityId: activity3.id });
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
        activityData?.find((activity) => activity.page === activity3.id)
          ?.feedback && (
          <div className="d-flex gap-3">
            <p className="text-bg-secondary rounded-4 px-1 px-md-3 fs-md-5 align-self-start">
              Feedback
            </p>
            <p className="bg-step-active text-gray fs-md-5 flex-grow-1 p-md-2 p-1 rounded">
              {getActivityFeedback(activity3.id)}
            </p>
            {isAdmin && (
              <Icon
                onClick={() => {
                  setModalData(getActivityFeedback(activity3.id));
                  setActivityFeedbackId({ activityId: activity3.id });
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

      {/* Activity 4 */}
      <p className="bg-blue py-md-3 px-md-5 py-1 px-2 text-white d-inline-block rounded-5 fs-md-4">
        Activity 4
      </p>
      <hr />
      <div className="d-flex gap-3">
        <p
          className="text-blue fs-md-1 week-2-question-text fw-bold"
          style={{ fontSize: 1 + "em" }}
        >
          Questions:
        </p>
        <p
          className="text-blue fs-md-4 week-2-question-text"
          style={{ fontSize: 1 + "em" }}
        >
          {activity3.question}
        </p>
      </div>
      <div className="d-flex gap-3">
        <p
          className="fw-bold text-gray fs-md-1 text-gray week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          Answers:
        </p>
        <p className="fs-md-5 flex-grow-1">{getActivityAnswer(activity3.id)}</p>
        {isAdmin &&
          !activityData?.find((activity) => activity.page === activity3.id)
            ?.feedback && (
            <Icon
              onClick={() => {
                setActivityFeedbackId({ activityId: activity3.id });
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
        activityData?.find((activity) => activity.page === activity3.id)
          ?.feedback && (
          <div className="d-flex gap-3">
            <p className="text-bg-secondary rounded-4 px-1 px-md-3 fs-md-5 align-self-start">
              Feedback
            </p>
            <p className="bg-step-active text-gray fs-md-5 flex-grow-1 p-md-2 p-1 rounded">
              {getActivityFeedback(activity3.id)}
            </p>
            {isAdmin && (
              <Icon
                onClick={() => {
                  setModalData(getActivityFeedback(activity3.id));
                  setActivityFeedbackId({ activityId: activity3.id });
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
      {/* Activity 5 */}
      <p className="bg-blue py-md-3 px-md-5 py-1 px-2 text-white d-inline-block rounded-5 fs-md-4">
        Activity 5
      </p>
      <hr />
      <div className="d-flex gap-3">
        <p
          className="text-blue fs-md-1 week-2-question-text fw-bold"
          style={{ fontSize: 1 + "em" }}
        >
          Scenario 1:
        </p>
        <p
          className="text-blue fs-md-4 week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          {activity4.steps[1].imagePairs[0].decisionText}
        </p>
      </div>
      <div className="d-flex gap-3">
        <p
          className="text-gray fs-md-1 text-gray week-2-question-text"
          style={{ fontSize: 1 + "em" }}
        >
          Answers:
        </p>
        <div className="flex-grow-1 d-flex">
          <div className="flex-grow-1">
            <p
              className="text-center bg-green text-white py-md-3 py-1 fs-md-1 week-2-question-text"
              style={{ fontSize: 1 + "em" }}
            >
              SEL
            </p>
            <div className="px-2 py-1 px-md-5 py-md-3">
              {drag2("sel", 1)?.map((item, idx) => (
                <p className="fs-md-4">
                  {idx + 1}. {item.text}
                </p>
              ))}
            </div>
          </div>
          <div className="flex-grow-1">
            <p
              className="bg-red text-center text-white py-md-3 py-1 fs-md-1 week-2-question-text"
              style={{ fontSize: 1 + "em" }}
            >
              NOT SEL
            </p>
            <div className="px-2 py-1 px-md-5 py-md-3">
              {drag2("not-sel", 1)?.map((item, idx) => (
                <p className="fs-md-4">
                  {idx + 1}. {item.text}
                </p>
              ))}
            </div>
          </div>
        </div>

        {
          //This is only Visible for Flow Admins
          isAdmin &&
          !activityData?.find((activity) => activity.page === activity4.id)
            ?.feedback && (
            <Icon
              onClick={() => {
                setActivityFeedbackId({ activityId: activity4.id });
                handleModalOpen();
              }}
              style={{ color: "#D6D6D6" }}
              width={35}
              icon="tabler:message-2"
            />
          )
        }
      </div>
      {
        // Show this only id theres a feedback
        activityData?.find((activity) => activity.page === activity4.id)
          ?.feedback && (
          <div className="d-flex gap-3">
            <p className="text-bg-secondary rounded-4 px-1 px-md-3 fs-md-5 align-self-start">
              Feedback
            </p>
            <p className="bg-step-active text-gray fs-md-5 flex-grow-1 p-1 p-md-2 rounded">
              {getActivityFeedback(activity4.id)}
            </p>
            {isAdmin && (
              <Icon
                onClick={() => {
                  setModalData(getActivityFeedback(activity4.id));
                  setActivityFeedbackId({ activityId: activity4.id });
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
      <div className="d-flex gap-3">
        <p
          className="text-blue fs-md-1 week-2-question-text fw-bold"
          style={{ fontSize: 1 + "em" }}
        >
          Scenario 2:
        </p>
        <p
          className="text-blue fs-md-4 week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          {activity4.steps[1].imagePairs[1].decisionText}
        </p>
      </div>
      <div className="d-flex gap-3">
        <p
          className="text-gray fs-md-1 text-gray week-2-question-text"
          style={{ fontSize: 1 + "em" }}
        >
          Answers:
        </p>
        <div className="flex-grow-1 d-flex">
          <div className="flex-grow-1">
            <p
              className="text-center bg-green text-white py-md-3 py-1 fs-md-1 week-2-question-text"
              style={{ fontSize: 1 + "em" }}
            >
              SEL
            </p>
            <div className="px-2 py-1 px-md-5 py-md-3">
              {drag2("sel", 2)?.map((item, idx) => (
                <p className="fs-md-4">
                  {idx + 1}. {item.text}
                </p>
              ))}
            </div>
          </div>
          <div className="flex-grow-1">
            <p
              className="bg-red text-center text-white py-md-3 py-1 fs-md-1 week-2-question-text"
              style={{ fontSize: 1 + "em" }}
            >
              NOT SEL
            </p>
            <div className="px-2 py-1 px-md-5 py-md-3">
              {drag2("not-sel", 2)?.map((item, idx) => (
                <p className="fs-md-4">
                  {idx + 1}. {item.text}
                </p>
              ))}
            </div>
          </div>
        </div>

        {
          //This is only Visible for Flow Admins
          isAdmin &&
          !activityData?.find((activity) => activity.page === activity4.id)
            ?.feedback && (
            <Icon
              onClick={() => {
                setActivityFeedbackId({ activityId: activity4.id });
                handleModalOpen();
              }}
              style={{ color: "#D6D6D6" }}
              width={35}
              icon="tabler:message-2"
            />
          )
        }
      </div>
      {
        // Show this only id theres a feedback
        activityData?.find((activity) => activity.page === activity4.id)
          ?.feedback && (
          <div className="d-flex gap-3">
            <p className="text-bg-secondary rounded-4 px-1 px-md-3 fs-md-5 align-self-start">
              Feedback
            </p>
            <p className="bg-step-active text-gray fs-md-5 flex-grow-1 p-1 p-md-2 rounded">
              {getActivityFeedback(activity4.id)}
            </p>
            {isAdmin && (
              <Icon
                onClick={() => {
                  setModalData(getActivityFeedback(activity4.id));
                  setActivityFeedbackId({ activityId: activity4.id });
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
      <div className="d-flex gap-3">
        <p
          className="text-blue fs-md-1 week-2-question-text fw-bold"
          style={{ fontSize: 1 + "em" }}
        >
          Scenario 3:
        </p>
        <p
          className="text-blue fs-md-4 week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          {activity4.steps[1].imagePairs[2].decisionText}
        </p>
      </div>
      <div className="d-flex gap-3">
        <p
          className="text-gray fs-md-1 text-gray week-2-question-text"
          style={{ fontSize: 1 + "em" }}
        >
          Answers:
        </p>
        <div className="flex-grow-1 d-flex">
          <div className="flex-grow-1">
            <p
              className="text-center bg-green text-white py-md-3 py-1 fs-md-1 week-2-question-text"
              style={{ fontSize: 1 + "em" }}
            >
              SEL
            </p>
            <div className="px-2 py-1 px-md-5 py-md-3">
              {drag2("sel", 3)?.map((item, idx) => (
                <p className="fs-md-4">
                  {idx + 1}. {item.text}
                </p>
              ))}
            </div>
          </div>
          <div className="flex-grow-1">
            <p
              className="bg-red text-center text-white py-md-3 py-1 fs-md-1 week-2-question-text"
              style={{ fontSize: 1 + "em" }}
            >
              NOT SEL
            </p>
            <div className="px-2 py-1 px-md-5 py-md-3">
              {drag2("not-sel", 3)?.map((item, idx) => (
                <p className="fs-md-4">
                  {idx + 1}. {item.text}
                </p>
              ))}
            </div>
          </div>
        </div>

        {
          //This is only Visible for Flow Admins
          isAdmin &&
          !activityData?.find((activity) => activity.page === activity4.id)
            ?.feedback && (
            <Icon
              onClick={() => {
                setActivityFeedbackId({ activityId: activity4.id });
                handleModalOpen();
              }}
              style={{ color: "#D6D6D6" }}
              width={35}
              icon="tabler:message-2"
            />
          )
        }
      </div>
      {
        // Show this only id theres a feedback
        activityData?.find((activity) => activity.page === activity4.id)
          ?.feedback && (
          <div className="d-flex gap-3">
            <p className="text-bg-secondary rounded-4 px-1 px-md-3 fs-md-5 align-self-start">
              Feedback
            </p>
            <p className="bg-step-active text-gray fs-md-5 flex-grow-1 p-1 p-md-2 rounded">
              {getActivityFeedback(activity4.id)}
            </p>
            {isAdmin && (
              <Icon
                onClick={() => {
                  setModalData(getActivityFeedback(activity4.id));
                  setActivityFeedbackId({ activityId: activity4.id });
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
      {/* Activity 6 */}
      <p className="bg-blue py-md-3 px-md-5 py-1 px-2 text-white d-inline-block rounded-5 fs-md-4">
        Activity 6
      </p>
      <hr />
      <div className="d-flex gap-3">
        <p
          className="text-blue fs-md-1 week-2-question-text fw-bold"
          style={{ fontSize: 1 + "em" }}
        >
          Questions:
        </p>
        <p
          className="text-blue fs-md-4 week-2-question-text"
          style={{ fontSize: 1 + "em" }}
        >
          {activity5.question}
        </p>
      </div>
      <div className="d-flex gap-3">
        <p
          className="fw-bold text-gray fs-md-1 text-gray week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          Answers:
        </p>
        <p className="fs-md-5 flex-grow-1">{getActivityAnswer(activity5.id)}</p>
        {isAdmin &&
          !activityData?.find((activity) => activity.page === activity5.id)
            ?.feedback && (
            <Icon
              onClick={() => {
                setActivityFeedbackId({ activityId: activity5.id });
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
        activityData?.find((activity) => activity.page === activity5.id)
          ?.feedback && (
          <div className="d-flex gap-3">
            <p className="text-bg-secondary rounded-4 px-1 px-md-3 fs-md-5 align-self-start">
              Feedback
            </p>
            <p className="bg-step-active text-gray fs-md-5 flex-grow-1 p-md-2 p-1 rounded">
              {getActivityFeedback(activity5.id)}
            </p>
            {isAdmin && (
              <Icon
                onClick={() => {
                  setModalData(getActivityFeedback(activity5.id));
                  setActivityFeedbackId({ activityId: activity5.id });
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
      {/* Activity 7 */}
      <p className="bg-blue py-md-3 px-md-5 py-1 px-2 text-white d-inline-block rounded-5 fs-md-4">
        Activity 7
      </p>
      <hr />
      <div className="d-flex gap-3">
        <p
          className="text-blue fs-md-1 week-2-question-text fw-bold"
          style={{ fontSize: 1 + "em" }}
        >
          Scenario 1:
        </p>
        <p
          className="text-blue fs-md-4 week-2-question-text"
          style={{ fontSize: 1 + "em" }}
        >
          {activity6.steps[1].question}
        </p>
      </div>
      <div className="d-flex gap-3">
        <p
          className="fw-bold text-gray fs-md-1 text-gray week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          Answers:
        </p>
        <div>
          {(() => {
            const answers = getActivityAnswer(14);
            if (!Array.isArray(answers))
              return <p className="text-gray">Loading...</p>;

            const step = answers.find(
              (a) => a.stepId === activity6.steps[1].stepId
            );
            if (!step || !step.value)
              return <p className="text-gray">Loading...</p>;

            const details = getOptionDetails(step.value);
            if (!details) return <p className="text-gray">Loading...</p>;

            return (
              <>
                <p className="text-gray">{details.text}</p>
                <p className="text-blue">{details.subText}</p>
              </>
            );
          })()}
        </div>

        {isAdmin &&
          !activityData?.find((activity) => activity.page === activity6.id)
            ?.feedback && (
            <Icon
              onClick={() => {
                setActivityFeedbackId({ activityId: activity6.id });
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
        activityData?.find((activity) => activity.page === activity6.id)
          ?.feedback && (
          <div className="d-flex gap-3">
            <p className="text-bg-secondary rounded-4 px-1 px-md-3 fs-md-5 align-self-start">
              Feedback
            </p>
            <p className="bg-step-active text-gray fs-md-5 flex-grow-1 p-md-2 p-1 rounded">
              {getActivityFeedback(activity6.id)}
            </p>
            {isAdmin && (
              <Icon
                onClick={() => {
                  setModalData(getActivityFeedback(activity6.id));
                  setActivityFeedbackId({ activityId: activity6.id });
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
      <div className="d-flex gap-3">
        <p
          className="text-blue fs-md-1 week-2-question-text fw-bold"
          style={{ fontSize: 1 + "em" }}
        >
          Scenario 2:
        </p>
        <p
          className="text-blue fs-md-4 week-2-question-text"
          style={{ fontSize: 1 + "em" }}
        >
          {activity6.steps[2].question}
        </p>
      </div>
      <div className="d-flex gap-3">
        <p
          className="fw-bold text-gray fs-md-1 text-gray week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          Answers:
        </p>
        <div>
          {(() => {
            const answers = getActivityAnswer(14);
            if (!Array.isArray(answers))
              return <p className="text-gray">Loading...</p>;

            const step = answers.find(
              (a) => a.stepId === activity6.steps[2].stepId
            );
            if (!step || !step.value)
              return <p className="text-gray">Loading...</p>;

            const details = getOptionDetails(step.value);
            if (!details) return <p className="text-gray">Loading...</p>;

            return (
              <>
                <p className="text-gray">{details.text}</p>
                <p className="text-blue">{details.subText}</p>
              </>
            );
          })()}
        </div>
        {isAdmin &&
          !activityData?.find((activity) => activity.page === activity6.id)
            ?.feedback && (
            <Icon
              onClick={() => {
                setActivityFeedbackId({ activityId: activity6.id });
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
        activityData?.find((activity) => activity.page === activity6.id)
          ?.feedback && (
          <div className="d-flex gap-3">
            <p className="text-bg-secondary rounded-4 px-1 px-md-3 fs-md-5 align-self-start">
              Feedback
            </p>
            <p className="bg-step-active text-gray fs-md-5 flex-grow-1 p-md-2 p-1 rounded">
              {getActivityFeedback(activity6.id)}
            </p>
            {isAdmin && (
              <Icon
                onClick={() => {
                  setModalData(getActivityFeedback(activity6.id));
                  setActivityFeedbackId({ activityId: activity6.id });
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
      <div className="d-flex gap-3">
        <p
          className="text-blue fs-md-1 week-2-question-text fw-bold"
          style={{ fontSize: 1 + "em" }}
        >
          Scenario 3:
        </p>
        <p
          className="text-blue fs-md-4 week-2-question-text"
          style={{ fontSize: 1 + "em" }}
        >
          {activity6.steps[3].question}
        </p>
      </div>
      <div className="d-flex gap-3">
        <p
          className="fw-bold text-gray fs-md-1 text-gray week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          Answers:
        </p>
        <div>
          {(() => {
            const answers = getActivityAnswer(14);
            if (!Array.isArray(answers))
              return <p className="text-gray">Loading...</p>;

            const step = answers.find(
              (a) => a.stepId === activity6.steps[3].stepId
            );
            if (!step || !step.value)
              return <p className="text-gray">Loading...</p>;

            const details = getOptionDetails(step.value);
            if (!details) return <p className="text-gray">Loading...</p>;

            return (
              <>
                <p className="text-gray">{details.text}</p>
                <p className="text-blue">{details.subText}</p>
              </>
            );
          })()}
        </div>
        {isAdmin &&
          !activityData?.find((activity) => activity.page === activity6.id)
            ?.feedback && (
            <Icon
              onClick={() => {
                setActivityFeedbackId({ activityId: activity6.id });
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
        activityData?.find((activity) => activity.page === activity6.id)
          ?.feedback && (
          <div className="d-flex gap-3">
            <p className="text-bg-secondary rounded-4 px-1 px-md-3 fs-md-5 align-self-start">
              Feedback
            </p>
            <p className="bg-step-active text-gray fs-md-5 flex-grow-1 p-md-2 p-1 rounded">
              {getActivityFeedback(activity6.id)}
            </p>
            {isAdmin && (
              <Icon
                onClick={() => {
                  setModalData(getActivityFeedback(activity6.id));
                  setActivityFeedbackId({ activityId: activity6.id });
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
      <div className="d-flex gap-3">
        <p
          className="text-blue fs-md-1 week-2-question-text fw-bold"
          style={{ fontSize: 1 + "em" }}
        >
          Scenario 4:
        </p>
        <p
          className="text-blue fs-md-4 week-2-question-text"
          style={{ fontSize: 1 + "em" }}
        >
          {activity6.steps[4].question}
        </p>
      </div>
      <div className="d-flex gap-3">
        <p
          className="fw-bold text-gray fs-md-1 text-gray week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          Answers:
        </p>
        <div>
          {(() => {
            const answers = getActivityAnswer(14);
            if (!Array.isArray(answers))
              return <p className="text-gray">Loading...</p>;

            const step = answers.find(
              (a) => a.stepId === activity6.steps[4].stepId
            );
            if (!step || !step.value)
              return <p className="text-gray">Loading...</p>;

            const details = getOptionDetails(step.value);
            if (!details) return <p className="text-gray">Loading...</p>;

            return (
              <>
                <p className="text-gray">{details.text}</p>
                <p className="text-blue">{details.subText}</p>
              </>
            );
          })()}
        </div>
        {isAdmin &&
          !activityData?.find((activity) => activity.page === activity6.id)
            ?.feedback && (
            <Icon
              onClick={() => {
                setActivityFeedbackId({ activityId: activity6.id });
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
        activityData?.find((activity) => activity.page === activity6.id)
          ?.feedback && (
          <div className="d-flex gap-3">
            <p className="text-bg-secondary rounded-4 px-1 px-md-3 fs-md-5 align-self-start">
              Feedback
            </p>
            <p className="bg-step-active text-gray fs-md-5 flex-grow-1 p-md-2 p-1 rounded">
              {getActivityFeedback(activity6.id)}
            </p>
            {isAdmin && (
              <Icon
                onClick={() => {
                  setModalData(getActivityFeedback(activity6.id));
                  setActivityFeedbackId({ activityId: activity6.id });
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
      <div className="d-flex gap-3">
        <p
          className="text-blue fs-md-1 week-2-question-text fw-bold"
          style={{ fontSize: 1 + "em" }}
        >
          Scenario 5:
        </p>
        <p
          className="text-blue fs-md-4 week-2-question-text"
          style={{ fontSize: 1 + "em" }}
        >
          {activity6.steps[5].question}
        </p>
      </div>
      <div className="d-flex gap-3">
        <p
          className="fw-bold text-gray fs-md-1 text-gray week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          Answers:
        </p>
        <div>
          {(() => {
            const answers = getActivityAnswer(14);
            if (!Array.isArray(answers))
              return <p className="text-gray">Loading...</p>;

            const step = answers.find(
              (a) => a.stepId === activity6.steps[5].stepId
            );
            if (!step || !step.value)
              return <p className="text-gray">Loading...</p>;

            const details = getOptionDetails(step.value);
            if (!details) return <p className="text-gray">Loading...</p>;

            return (
              <>
                <p className="text-gray">{details.text}</p>
                <p className="text-blue">{details.subText}</p>
              </>
            );
          })()}
        </div>
        {isAdmin &&
          !activityData?.find((activity) => activity.page === activity6.id)
            ?.feedback && (
            <Icon
              onClick={() => {
                setActivityFeedbackId({ activityId: activity6.id });
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
        activityData?.find((activity) => activity.page === activity6.id)
          ?.feedback && (
          <div className="d-flex gap-3">
            <p className="text-bg-secondary rounded-4 px-1 px-md-3 fs-md-5 align-self-start">
              Feedback
            </p>
            <p className="bg-step-active text-gray fs-md-5 flex-grow-1 p-md-2 p-1 rounded">
              {getActivityFeedback(activity6.id)}
            </p>
            {isAdmin && (
              <Icon
                onClick={() => {
                  setModalData(getActivityFeedback(activity6.id));
                  setActivityFeedbackId({ activityId: activity6.id });
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
      <div className="d-flex gap-3">
        <p
          className="text-blue fs-md-1 week-2-question-text fw-bold"
          style={{ fontSize: 1 + "em" }}
        >
          Scenario 6:
        </p>
        <p
          className="text-blue fs-md-4 week-2-question-text"
          style={{ fontSize: 1 + "em" }}
        >
          {activity6.steps[6].question}
        </p>
      </div>
      <div className="d-flex gap-3">
        <p
          className="fw-bold text-gray fs-md-1 text-gray week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          Answers:
        </p>
        <div>
          {(() => {
            const answers = getActivityAnswer(14);
            if (!Array.isArray(answers))
              return <p className="text-gray">Loading...</p>;

            const step = answers.find(
              (a) => a.stepId === activity6.steps[6].stepId
            );
            if (!step || !step.value)
              return <p className="text-gray">Loading...</p>;

            const details = getOptionDetails(step.value);
            if (!details) return <p className="text-gray">Loading...</p>;

            return (
              <>
                <p className="text-gray">{details.text}</p>
                <p className="text-blue">{details.subText}</p>
              </>
            );
          })()}
        </div>
        {isAdmin &&
          !activityData?.find((activity) => activity.page === activity6.id)
            ?.feedback && (
            <Icon
              onClick={() => {
                setActivityFeedbackId({ activityId: activity6.id });
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
        activityData?.find((activity) => activity.page === activity6.id)
          ?.feedback && (
          <div className="d-flex gap-3">
            <p className="text-bg-secondary rounded-4 px-1 px-md-3 fs-md-5 align-self-start">
              Feedback
            </p>
            <p className="bg-step-active text-gray fs-md-5 flex-grow-1 p-md-2 p-1 rounded">
              {getActivityFeedback(activity6.id)}
            </p>
            {isAdmin && (
              <Icon
                onClick={() => {
                  setModalData(getActivityFeedback(activity6.id));
                  setActivityFeedbackId({ activityId: activity6.id });
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
      <div className="d-flex gap-3">
        <p
          className="text-blue fs-md-1 week-2-question-text fw-bold"
          style={{ fontSize: 1 + "em" }}
        >
          Scenario 7:
        </p>
        <p
          className="text-blue fs-md-4 week-2-question-text"
          style={{ fontSize: 1 + "em" }}
        >
          {activity6.steps[7].question}
        </p>
      </div>
      <div className="d-flex gap-3">
        <p
          className="fw-bold text-gray fs-md-1 text-gray week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          Answers:
        </p>
        <div>
          {(() => {
            const answers = getActivityAnswer(14);
            if (!Array.isArray(answers))
              return <p className="text-gray">Loading...</p>;

            const step = answers.find(
              (a) => a.stepId === activity6.steps[7].stepId
            );
            if (!step || !step.value)
              return <p className="text-gray">Loading...</p>;

            const details = getOptionDetails(step.value);
            if (!details) return <p className="text-gray">Loading...</p>;

            return (
              <>
                <p className="text-gray">{details.text}</p>
                <p className="text-blue">{details.subText}</p>
              </>
            );
          })()}
        </div>
        {isAdmin &&
          !activityData?.find((activity) => activity.page === activity6.id)
            ?.feedback && (
            <Icon
              onClick={() => {
                setActivityFeedbackId({ activityId: activity6.id });
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
        activityData?.find((activity) => activity.page === activity6.id)
          ?.feedback && (
          <div className="d-flex gap-3">
            <p className="text-bg-secondary rounded-4 px-1 px-md-3 fs-md-5 align-self-start">
              Feedback
            </p>
            <p className="bg-step-active text-gray fs-md-5 flex-grow-1 p-md-2 p-1 rounded">
              {getActivityFeedback(activity6.id)}
            </p>
            {isAdmin && (
              <Icon
                onClick={() => {
                  setModalData(getActivityFeedback(activity6.id));
                  setActivityFeedbackId({ activityId: activity6.id });
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
      <div className="d-flex gap-3">
        <p
          className="text-blue fs-md-1 week-2-question-text fw-bold"
          style={{ fontSize: 1 + "em" }}
        >
          Scenario 8:
        </p>
        <p
          className="text-blue fs-md-4 week-2-question-text"
          style={{ fontSize: 1 + "em" }}
        >
          {activity6.steps[8].question}
        </p>
      </div>
      <div className="d-flex gap-3">
        <p
          className="fw-bold text-gray fs-md-1 text-gray week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          Answers:
        </p>
        <div>
          {(() => {
            const answers = getActivityAnswer(14);
            if (!Array.isArray(answers))
              return <p className="text-gray">Loading...</p>;

            const step = answers.find(
              (a) => a.stepId === activity6.steps[8].stepId
            );
            if (!step || !step.value)
              return <p className="text-gray">Loading...</p>;

            const details = getOptionDetails(step.value);
            if (!details) return <p className="text-gray">Loading...</p>;

            return (
              <>
                <p className="text-gray">{details.text}</p>
                <p className="text-blue">{details.subText}</p>
              </>
            );
          })()}
        </div>
        {isAdmin &&
          !activityData?.find((activity) => activity.page === activity6.id)
            ?.feedback && (
            <Icon
              onClick={() => {
                setActivityFeedbackId({ activityId: activity6.id });
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
        activityData?.find((activity) => activity.page === activity6.id)
          ?.feedback && (
          <div className="d-flex gap-3">
            <p className="text-bg-secondary rounded-4 px-1 px-md-3 fs-md-5 align-self-start">
              Feedback
            </p>
            <p className="bg-step-active text-gray fs-md-5 flex-grow-1 p-md-2 p-1 rounded">
              {getActivityFeedback(activity6.id)}
            </p>
            {isAdmin && (
              <Icon
                onClick={() => {
                  setModalData(getActivityFeedback(activity6.id));
                  setActivityFeedbackId({ activityId: activity6.id });
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
      <div className="d-flex gap-3">
        <p
          className="text-blue fs-md-1 week-2-question-text fw-bold"
          style={{ fontSize: 1 + "em" }}
        >
          Scenario 9:
        </p>
        <p
          className="text-blue fs-md-4 week-2-question-text"
          style={{ fontSize: 1 + "em" }}
        >
          {activity6.steps[9].question}
        </p>
      </div>
      <div className="d-flex gap-3">
        <p
          className="fw-bold text-gray fs-md-1 text-gray week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          Answers:
        </p>
        <div>
          {(() => {
            const answers = getActivityAnswer(14);
            if (!Array.isArray(answers))
              return <p className="text-gray">Loading...</p>;

            const step = answers.find(
              (a) => a.stepId === activity6.steps[9].stepId
            );
            if (!step || !step.value)
              return <p className="text-gray">Loading...</p>;

            const details = getOptionDetails(step.value);
            if (!details) return <p className="text-gray">Loading...</p>;

            return (
              <>
                <p className="text-gray">{details.text}</p>
                <p className="text-blue">{details.subText}</p>
              </>
            );
          })()}
        </div>
        {isAdmin &&
          !activityData?.find((activity) => activity.page === activity6.id)
            ?.feedback && (
            <Icon
              onClick={() => {
                setActivityFeedbackId({ activityId: activity6.id });
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
        activityData?.find((activity) => activity.page === activity6.id)
          ?.feedback && (
          <div className="d-flex gap-3">
            <p className="text-bg-secondary rounded-4 px-1 px-md-3 fs-md-5 align-self-start">
              Feedback
            </p>
            <p className="bg-step-active text-gray fs-md-5 flex-grow-1 p-md-2 p-1 rounded">
              {getActivityFeedback(activity6.id)}
            </p>
            {isAdmin && (
              <Icon
                onClick={() => {
                  setModalData(getActivityFeedback(activity6.id));
                  setActivityFeedbackId({ activityId: activity6.id });
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
      <div className="d-flex gap-3">
        <p
          className="text-blue fs-md-1 week-2-question-text fw-bold"
          style={{ fontSize: 1 + "em" }}
        >
          Scenario 10:
        </p>
        <p
          className="text-blue fs-md-4 week-2-question-text"
          style={{ fontSize: 1 + "em" }}
        >
          {activity6.steps[10].question}
        </p>
      </div>
      <div className="d-flex gap-3">
        <p
          className="fw-bold text-gray fs-md-1 text-gray week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          Answers:
        </p>
        <div>
          {(() => {
            const answers = getActivityAnswer(14);
            if (!Array.isArray(answers))
              return <p className="text-gray">Loading...</p>;

            const step = answers.find(
              (a) => a.stepId === activity6.steps[10].stepId
            );
            if (!step || !step.value)
              return <p className="text-gray">Loading...</p>;

            const details = getOptionDetails(step.value);
            if (!details) return <p className="text-gray">Loading...</p>;

            return (
              <>
                <p className="text-gray">{details.text}</p>
                <p className="text-blue">{details.subText}</p>
              </>
            );
          })()}
        </div>
        {isAdmin &&
          !activityData?.find((activity) => activity.page === activity6.id)
            ?.feedback && (
            <Icon
              onClick={() => {
                setActivityFeedbackId({ activityId: activity6.id });
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
        activityData?.find((activity) => activity.page === activity6.id)
          ?.feedback && (
          <div className="d-flex gap-3">
            <p className="text-bg-secondary rounded-4 px-1 px-md-3 fs-md-5 align-self-start">
              Feedback
            </p>
            <p className="bg-step-active text-gray fs-md-5 flex-grow-1 p-md-2 p-1 rounded">
              {getActivityFeedback(activity6.id)}
            </p>
            {isAdmin && (
              <Icon
                onClick={() => {
                  setModalData(getActivityFeedback(activity6.id));
                  setActivityFeedbackId({ activityId: activity6.id });
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
      {/* Activity 8 */}
      <p className="bg-blue py-md-3 px-md-5 py-1 px-2 text-white d-inline-block rounded-5 fs-md-4">
        Activity 8
      </p>
      <hr />
      <div className="d-flex gap-3">
        <p
          className="text-blue fs-md-1 week-2-question-text fw-bold"
          style={{ fontSize: 1 + "em" }}
        >
          Questions:
        </p>
        <p
          className="text-blue fs-md-4 week-2-question-text"
          style={{ fontSize: 1 + "em" }}
        >
          {activity7.question}
        </p>
      </div>
      <div className="d-flex gap-3">
        <p
          className="fw-bold text-gray fs-md-1 text-gray week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          Answers:
        </p>
        <div>
          {(() => {
            const answers = getActivityAnswer(activity7.id);
            if (!Array.isArray(answers) || answers.length === 0)
              return <p className="fs-md-4">No answers yet.</p>;

            return answers.map((item, idx) => (
              <p key={idx} className="fs-md-4">
                {idx + 1}. {item.value}
              </p>
            ));
          })()}
        </div>
        {isAdmin &&
          !activityData?.find((activity) => activity.page === activity7.id)
            ?.feedback && (
            <Icon
              onClick={() => {
                setActivityFeedbackId({ activityId: activity7.id });
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
        activityData?.find((activity) => activity.page === activity7.id)
          ?.feedback && (
          <div className="d-flex gap-3">
            <p className="text-bg-secondary rounded-4 px-1 px-md-3 fs-md-5 align-self-start">
              Feedback
            </p>
            <p className="bg-step-active text-gray fs-md-5 flex-grow-1 p-md-2 p-1 rounded">
              {getActivityFeedback(activity7.id)}
            </p>
            {isAdmin && (
              <Icon
                onClick={() => {
                  setModalData(getActivityFeedback(activity7.id));
                  setActivityFeedbackId({ activityId: activity7.id });
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
      {/* Activity 9 */}
      <p className="bg-blue py-md-3 px-md-5 py-1 px-2 text-white d-inline-block rounded-5 fs-md-4">
        Activity 9
      </p>
      <hr />
      <div className="d-flex gap-3">
        <p
          className="text-blue fs-md-1 week-2-question-text fw-bold"
          style={{ fontSize: 1 + "em" }}
        >
          Scenario 1:
        </p>
        <p
          className="text-blue fs-md-4 week-2-question-text"
          style={{ fontSize: 1 + "em" }}
        >
          {activity8.steps[1].questions[0].question}
        </p>
      </div>
      <div className="d-flex gap-3">
        <p
          className="fw-bold text-gray fs-md-1 text-gray week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          Answers:
        </p>
        <p className="fs-md-5 flex-grow-1">
          {(() => {
            const answers = getActivityAnswer(activity8.id);
            if (!Array.isArray(answers)) return "";

            const stepId = activity8?.steps?.[1]?.stepId;
            if (!stepId) return "";

            const stepAnswer = answers.find((a) => a.stepId === stepId);
            if (!stepAnswer || !stepAnswer.value) return "";

            return stepAnswer.value;
          })()}
        </p>

        {isAdmin &&
          !activityData?.find((activity) => activity.page === activity8.id)
            ?.feedback && (
            <Icon
              onClick={() => {
                setActivityFeedbackId({ activityId: activity8.id });
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
        activityData?.find((activity) => activity.page === activity8.id)
          ?.feedback && (
          <div className="d-flex gap-3">
            <p className="text-bg-secondary rounded-4 px-1 px-md-3 fs-md-5 align-self-start">
              Feedback
            </p>
            <p className="bg-step-active text-gray fs-md-5 flex-grow-1 p-md-2 p-1 rounded">
              {getActivityFeedback(activity8.id)}
            </p>
            {isAdmin && (
              <Icon
                onClick={() => {
                  setModalData(getActivityFeedback(activity8.id));
                  setActivityFeedbackId({ activityId: activity8.id });
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
      <div className="d-flex gap-3">
        <p
          className="text-blue fs-md-1 week-2-question-text fw-bold"
          style={{ fontSize: 1 + "em" }}
        >
          Scenario 2:
        </p>
        <p
          className="text-blue fs-md-4 week-2-question-text"
          style={{ fontSize: 1 + "em" }}
        >
          {activity8.steps[2].questions[0].question}
        </p>
      </div>
      <div className="d-flex gap-3">
        <p
          className="fw-bold text-gray fs-md-1 text-gray week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          Answers:
        </p>
        <p className="fs-md-5 flex-grow-1">
          {(() => {
            const answers = getActivityAnswer(activity8.id);
            if (!Array.isArray(answers)) return "";

            const stepId = activity8?.steps?.[2]?.stepId;
            if (!stepId) return "";

            const stepAnswer = answers.find((a) => a.stepId === stepId);
            if (!stepAnswer || !stepAnswer.value) return "";

            return stepAnswer.value;
          })()}
        </p>

        {isAdmin &&
          !activityData?.find((activity) => activity.page === activity8.id)
            ?.feedback && (
            <Icon
              onClick={() => {
                setActivityFeedbackId({ activityId: activity8.id });
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
        activityData?.find((activity) => activity.page === activity8.id)
          ?.feedback && (
          <div className="d-flex gap-3">
            <p className="text-bg-secondary rounded-4 px-1 px-md-3 fs-md-5 align-self-start">
              Feedback
            </p>
            <p className="bg-step-active text-gray fs-md-5 flex-grow-1 p-md-2 p-1 rounded">
              {getActivityFeedback(activity8.id)}
            </p>
            {isAdmin && (
              <Icon
                onClick={() => {
                  setModalData(getActivityFeedback(activity8.id));
                  setActivityFeedbackId({ activityId: activity8.id });
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
      <div className="d-flex gap-3">
        <p
          className="text-blue fs-md-1 week-2-question-text fw-bold"
          style={{ fontSize: 1 + "em" }}
        >
          Scenario 3:
        </p>
        <p
          className="text-blue fs-md-4 week-2-question-text"
          style={{ fontSize: 1 + "em" }}
        >
          {activity8.steps[3].questions[0].question}
        </p>
      </div>
      <div className="d-flex gap-3">
        <p
          className="fw-bold text-gray fs-md-1 text-gray week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          Answers:
        </p>
        <p className="fs-md-5 flex-grow-1">
          {(() => {
            const answers = getActivityAnswer(activity8.id);
            if (!Array.isArray(answers)) return "";

            const stepId = activity8?.steps?.[3]?.stepId;
            if (!stepId) return "";

            const stepAnswer = answers.find((a) => a.stepId === stepId);
            if (!stepAnswer || !stepAnswer.value) return "";

            return stepAnswer.value;
          })()}
        </p>

        {isAdmin &&
          !activityData?.find((activity) => activity.page === activity8.id)
            ?.feedback && (
            <Icon
              onClick={() => {
                setActivityFeedbackId({ activityId: activity8.id });
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
        activityData?.find((activity) => activity.page === activity8.id)
          ?.feedback && (
          <div className="d-flex gap-3">
            <p className="text-bg-secondary rounded-4 px-1 px-md-3 fs-md-5 align-self-start">
              Feedback
            </p>
            <p className="bg-step-active text-gray fs-md-5 flex-grow-1 p-md-2 p-1 rounded">
              {getActivityFeedback(activity8.id)}
            </p>
            {isAdmin && (
              <Icon
                onClick={() => {
                  setModalData(getActivityFeedback(activity8.id));
                  setActivityFeedbackId({ activityId: activity8.id });
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
      {/* Activity 10 */}
      <p className="bg-blue py-md-3 px-md-5 py-1 px-2 text-white d-inline-block rounded-5 fs-md-4">
        Activity 10
      </p>
      <hr />
      <div className="d-flex gap-3">
        <p
          className="text-blue fs-md-1 week-2-question-text fw-bold"
          style={{ fontSize: 1 + "em" }}
        >
          Questions:
        </p>
        <p
          className="text-blue fs-md-4 week-2-question-text"
          style={{ fontSize: 1 + "em" }}
        >
          {activity9.question}
        </p>
      </div>
      <div className="d-flex gap-3">
        <p
          className="fw-bold text-gray fs-md-1 text-gray week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          Answers:
        </p>
        <div>
          {(() => {
            const answers = getActivityAnswer(activity9.id);
            if (!Array.isArray(answers) || answers.length === 0)
              return <p className="fs-md-4">No answers yet.</p>;

            return answers.map((item, idx) => (
              <p key={idx} className="fs-md-4">
                {idx + 1}. {item.value}
              </p>
            ));
          })()}
        </div>
        {isAdmin &&
          !activityData?.find((activity) => activity.page === activity9.id)
            ?.feedback && (
            <Icon
              onClick={() => {
                setActivityFeedbackId({ activityId: activity9.id });
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
        activityData?.find((activity) => activity.page === activity9.id)
          ?.feedback && (
          <div className="d-flex gap-3">
            <p className="text-bg-secondary rounded-4 px-1 px-md-3 fs-md-5 align-self-start">
              Feedback
            </p>
            <p className="bg-step-active text-gray fs-md-5 flex-grow-1 p-md-2 p-1 rounded">
              {getActivityFeedback(activity9.id)}
            </p>
            {isAdmin && (
              <Icon
                onClick={() => {
                  setModalData(getActivityFeedback(activity9.id));
                  setActivityFeedbackId({ activityId: activity9.id });
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
      {/* Activity 11 */}
      <p className="bg-blue py-md-3 px-md-5 py-1 px-2 text-white d-inline-block rounded-5 fs-md-4">
        Activity 11
      </p>
      <hr />
      <div className="d-flex gap-3">
        <p
          className="text-blue fs-md-1 week-2-question-text fw-bold"
          style={{ fontSize: 1 + "em" }}
        >
          Scenario 1:
        </p>
        <p
          className="text-blue fs-md-4 week-2-question-text"
          style={{ fontSize: 1 + "em" }}
        >
          {activity10.steps[1].questions[0].question}
        </p>
      </div>
      <div className="d-flex gap-3">
        <p
          className="fw-bold text-gray fs-md-1 text-gray week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          Answers:
        </p>
        <p className="fs-md-5 flex-grow-1">
          {(() => {
            const answers = getActivityAnswer(activity10.id);
            if (!Array.isArray(answers)) return "";

            const stepId = activity8?.steps?.[1]?.stepId;
            if (!stepId) return "";

            const stepAnswer = answers.find((a) => a.stepId === stepId);
            if (!stepAnswer || !stepAnswer.value) return "";

            return stepAnswer.value;
          })()}
        </p>
        {isAdmin &&
          !activityData?.find((activity) => activity.page === activity10.id)
            ?.feedback && (
            <Icon
              onClick={() => {
                setActivityFeedbackId({ activityId: activity10.id });
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
        activityData?.find((activity) => activity.page === activity10.id)
          ?.feedback && (
          <div className="d-flex gap-3">
            <p className="text-bg-secondary rounded-4 px-1 px-md-3 fs-md-5 align-self-start">
              Feedback
            </p>
            <p className="bg-step-active text-gray fs-md-5 flex-grow-1 p-md-2 p-1 rounded">
              {getActivityFeedback(activity10.id)}
            </p>
            {isAdmin && (
              <Icon
                onClick={() => {
                  setModalData(getActivityFeedback(activity10.id));
                  setActivityFeedbackId({ activityId: activity10.id });
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
      <div className="d-flex gap-3">
        <p
          className="text-blue fs-md-1 week-2-question-text fw-bold"
          style={{ fontSize: 1 + "em" }}
        >
          Scenario 2:
        </p>
        <p
          className="text-blue fs-md-4 week-2-question-text"
          style={{ fontSize: 1 + "em" }}
        >
          {activity10.steps[2].questions[0].question}
        </p>
      </div>
      <div className="d-flex gap-3">
        <p
          className="fw-bold text-gray fs-md-1 text-gray week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          Answers:
        </p>
        <p className="fs-md-5 flex-grow-1">
          {(() => {
            const answers = getActivityAnswer(activity10.id);
            if (!Array.isArray(answers)) return "";

            const stepId = activity8?.steps?.[2]?.stepId;
            if (!stepId) return "";

            const stepAnswer = answers.find((a) => a.stepId === stepId);
            if (!stepAnswer || !stepAnswer.value) return "";

            return stepAnswer.value;
          })()}
        </p>
        {isAdmin &&
          !activityData?.find((activity) => activity.page === activity10.id)
            ?.feedback && (
            <Icon
              onClick={() => {
                setActivityFeedbackId({ activityId: activity10.id });
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
        activityData?.find((activity) => activity.page === activity10.id)
          ?.feedback && (
          <div className="d-flex gap-3">
            <p className="text-bg-secondary rounded-4 px-1 px-md-3 fs-md-5 align-self-start">
              Feedback
            </p>
            <p className="bg-step-active text-gray fs-md-5 flex-grow-1 p-md-2 p-1 rounded">
              {getActivityFeedback(activity10.id)}
            </p>
            {isAdmin && (
              <Icon
                onClick={() => {
                  setModalData(getActivityFeedback(activity10.id));
                  setActivityFeedbackId({ activityId: activity10.id });
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
      {/* Assesment 1 */}
      <p className="bg-blue py-1 px-1 py-md-3 px-md-2 text-white d-inline-block rounded-5 fs-md-4">
        Posst-Assessment
      </p>
      <hr />
      {assessments.map(({ id, question, options, correctOption }, i) => {
        const selectedAnswer = assessmentData?.find(
          (answer) => answer.id === id
        )?.value;
        return (
          <>
            <div className="d-flex gap-3" key={i}>
              <p
                className="text-blue fs-md-1 text-nowrap week-2-question-text fw-bold"
                style={{ fontSize: 1 + "em" }}
              >
                Questions {i + 1}:
              </p>
              <p
                className="text-blue fs-md-4 week-2-question-text"
                style={{ fontSize: 1 + "em" }}
              >
                {question}
              </p>
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
                    <div
                      className="week-2-question-text text-gray"
                      style={{ fontSize: 1 + "em" }}
                    >{`${optionText}. ${option.text}`}</div>
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
              ? "You’ve taken an important first step in exploring Social and Emotional Learning and Positive Psychology. You’ve started to understand the value of emotional awareness, relationship skills, and teacher wellbeing. However, it seems you may still be building a full grasp of how SEL connects to classroom practice. Revisit the lessons and take time to reflect on how self-awareness and self-management can shape your approach to teaching. Don’t hesitate to ask questions or discuss ideas with your peers; collaboration is one of the best ways to deepen understanding. Every teacher starts somewhere, and your willingness to learn is already a sign of growth"
              : score < 60
                ? "Good effort! You’re beginning to grasp key SEL and Positive Psychology principles such as self-awareness, empathy, and the importance of wellbeing in the classroom. You have a fair understanding of how emotional intelligence supports both teachers and students, but there’s room to strengthen your practical application. Try focusing on mindfulness and emotional regulation strategies in your daily teaching routine. Reflect after each class, ‘How did your emotional state affect your students' responses?’ The more intentional you are, the more confident and balanced you’ll become in integrating SEL principles effectively."
                : score < 80
                  ? "Well done! You’ve shown a strong understanding of SEL and Positive Psychology concepts and are starting to connect them meaningfully to your classroom practice. You recognize how empathy, relationship-building, and emotional regulation influence learning outcomes. To keep improving, aim to apply SEL more consistently, model calm responses to challenges, and build structured moments for reflection or gratitude in your lessons. You’re well on your way to creating a classroom culture rooted in care, connection, and emotional growth."
                  : score < 95
                    ? "Excellent work! You’ve demonstrated a clear understanding of SEL and Positive Psychology competencies and how its principles can transform both teaching and learning. You’ve likely developed effective strategies for fostering empathy, self-regulation, and resilience in your students, and you understand the importance of teacher wellbeing in sustaining those practices. Keep refining your skills by mentoring peers or sharing SEL practices in team meetings. Continue to model emotional intelligence in every interaction, and you will build the kind of classroom where students feel safe, motivated, and valued."
                    : score <= 100
                      ? "Outstanding achievement! You’ve shown exceptional mastery of Social and Emotional Learning. You not only understand the theory but also demonstrate how to live it out in your teaching, balancing self-awareness, empathy, and resilience with skill. Your approach likely fosters deep trust, engagement, and growth in your students. Continue to inspire others by leading discussions on SEL implementation and supporting colleagues who are just beginning their journey. Your dedication to nurturing emotional wellbeing in education sets a powerful example. Keep shining, the ripple effect of your work will last far beyond the classroom."
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
