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
import { useMutation, useQuery } from "@tanstack/react-query";
import userService from "@/services/api/user";
import { calculateResult } from "../../../utility.js";
import { adminData } from "@/store/adminReducer";
import { useSelector } from "react-redux";
import adminService from "@/services/api/admin";
import Modal from "../../components/Modal.jsx";

export function mapSelectedOptions(selectedObj = {}) {
  const masterOptions = [
    { id: "morning-check-ins", label: "Morning check-ins" },
    {
      id: "emotional-vocabulary-in-lessons",
      label: "Emotional vocabulary in lessons",
    },
    { id: "gratitude-journals", label: "Gratitude journals" },
    { id: "relationship_skills", label: "Relationship Skills" },
    {
      id: "breathing_or_grounding_exercises",
      label: "Breathing or grounding exercises",
    },
    { id: "weekly_class_meetings", label: "Weekly class meetings" },
    {
      id: "praise_for_effort,_not_just_results",
      label: "Praise for effort, not just results",
    },
    {
      id: "growth_mindset_reflections",
      label: "Growth mindset reflections",
    },
    {
      id: "cooperative_learning_tasks",
      label: "Cooperative learning tasks",
    },
    {
      id: "storytelling_or_character_analysis",
      label: "Storytelling or character analysis",
    },
  ];
  const normalizedSelected =
    selectedObj && typeof selectedObj === "object" ? selectedObj : {};

  return masterOptions.map((option) => ({
    ...option,
    selected: !!normalizedSelected[option.id],
  }));
}

function Week6({ enrollmentId, setWeekSixData }) {
  const { pages } = getWeekContentExcludingVideos(6);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState("");

  const [activity1, activity2, activity3, activity4, activity5] = pages;

  const [activityData, setActivityData] = useState([]);
  const [assessmentData, setAssessmentData] = useState([]);
  const [activityFeedbackId, setActivityFeedbackId] = useState(null);
  const { isAdmin, code } = useSelector(adminData);

  const { questions: assessments } = getWeekAssessment(6);

  // toDo: Fetch User assessment and Activity Data
  const { data, isPending, status, isError } = useQuery({
    queryKey: ["dashboard/tot-feedback-6", enrollmentId, 6],
    queryFn: () =>
      isAdmin
        ? adminService.getUserCourseData(enrollmentId, 6, code)
        : userService.getUserCourseData(enrollmentId, 6),
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
        6,
        data?.activity?.user,
        code
      ),
    onSuccess: (data) => {
      setModalData("");
    },
    onError: (error) => {
      console.error("Registration error:", error);
      setModalData("");
    },
  });

  useEffect(() => {
    if (!data) return;

    setActivityData(data.activity?.activities);
    setAssessmentData(data.assessment?.assessments);
    setWeekSixData(true);

    return () => { };
  }, [data]);

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

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setActivityFeedbackId(null);
    setShowModal(false);
  };

  function getOptionDetails(option) {
    const options = [
      {
        id: "A",
        text: "Never",
      },
      {
        id: "B",
        text: "Occasionally",
      },
      {
        id: "C",
        text: "Frequently",
      },
      {
        id: "D",
        text: "Always",
      },
    ];

    return options.find((item) => item.id === option) || null;
  }

  function drag1(type) {
    console.log(activityData, "Activity Data");
    if (!activityData || !activityData[3] || !activityData[3].answer) return [];

    const indices =
      type === "inner"
        ? activityData[3]?.answer?.[0]?.value?.green
        : type === "middle"
          ? activityData[3]?.answer?.[0]?.value?.orange
          : activityData[3]?.answer?.[0]?.value?.red;
    return indices?.map((index) => activity4?.steps?.[1].images[index]) || [];
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
      {/* Activity 1 */}
      <p className="bg-blue py-md-3 px-md-5 py-1 px-2 text-white d-inline-block rounded-5 fs-md-4">
        Activity 1
      </p>
      <p
        className="text-gray fs-md-4 week-2-question-text"
        accordion
        style={{ fontSize: 1 + "em" }}
      >
        {activity1.steps[0].instructions.map((text) => (
          <>
            <span className="text-gray">{text}</span>
            <br />
          </>
        ))}
      </p>
      <hr />
      <div className="d-flex gap-3">
        <p
          className="text-blue fs-md-1 week-2-question-text fw-bold"
          style={{ fontSize: 1 + "em" }}
        >
          Statement 1:
        </p>
        <p
          className="text-blue fs-md-4 week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          {activity1.steps[1].question}
        </p>
      </div>
      <div className="d-flex gap-3">
        <p
          className="text-gray fs-md-1 text-gray week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          Answers:
        </p>
        {(() => {
          const answers = getActivityAnswer(activity1.id);
          if (!Array.isArray(answers))
            return <p className="text-gray">Loading...</p>;

          const step = answers.find(
            (a) => a.stepId === activity1.steps[1].stepId
          );
          if (!step || !step.value)
            return <p className="text-gray">Loading...</p>;

          const details = getOptionDetails(step.value);
          if (!details) return <p className="text-gray">Loading...</p>;

          return (
            <>
              <p className="text-gray">
                {details.id}. {details.text}
              </p>
            </>
          );
        })()}
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
      <div className="d-flex gap-3">
        <p
          className="text-blue fs-md-1 week-2-question-text fw-bold"
          style={{ fontSize: 1 + "em" }}
        >
          Statement 2:
        </p>
        <p
          className="text-blue fs-md-4 week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          {activity1.steps[2].question}
        </p>
      </div>
      <div className="d-flex gap-3">
        <p
          className="text-gray fs-md-1 text-gray week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          Answers:
        </p>
        {(() => {
          const answers = getActivityAnswer(activity1.id);
          if (!Array.isArray(answers))
            return <p className="text-gray">Loading...</p>;

          const step = answers.find(
            (a) => a.stepId === activity1.steps[2].stepId
          );
          if (!step || !step.value)
            return <p className="text-gray">Loading...</p>;

          const details = getOptionDetails(step.value);
          if (!details) return <p className="text-gray">Loading...</p>;

          return (
            <>
              <p className="text-gray">
                {details.id}. {details.text}
              </p>
            </>
          );
        })()}
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
      <div className="d-flex gap-3">
        <p
          className="text-blue fs-md-1 week-2-question-text fw-bold"
          style={{ fontSize: 1 + "em" }}
        >
          Statement 3:
        </p>
        <p
          className="text-blue fs-md-4 week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          {activity1.steps[3].question}
        </p>
      </div>
      <div className="d-flex gap-3">
        <p
          className="text-gray fs-md-1 text-gray week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          Answers:
        </p>
        {(() => {
          const answers = getActivityAnswer(activity1.id);
          if (!Array.isArray(answers))
            return <p className="text-gray">Loading...</p>;

          const step = answers.find(
            (a) => a.stepId === activity1.steps[3].stepId
          );
          if (!step || !step.value)
            return <p className="text-gray">Loading...</p>;

          const details = getOptionDetails(step.value);
          if (!details) return <p className="text-gray">Loading...</p>;

          return (
            <>
              <p className="text-gray">
                {details.id}. {details.text}
              </p>
            </>
          );
        })()}
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
      <div className="d-flex gap-3">
        <p
          className="text-blue fs-md-1 week-2-question-text fw-bold"
          style={{ fontSize: 1 + "em" }}
        >
          Statement 4:
        </p>
        <p
          className="text-blue fs-md-4 week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          {activity1.steps[4].question}
        </p>
      </div>
      <div className="d-flex gap-3">
        <p
          className="text-gray fs-md-1 text-gray week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          Answers:
        </p>
        {(() => {
          const answers = getActivityAnswer(activity1.id);
          if (!Array.isArray(answers))
            return <p className="text-gray">Loading...</p>;

          const step = answers.find(
            (a) => a.stepId === activity1.steps[4].stepId
          );
          if (!step || !step.value)
            return <p className="text-gray">Loading...</p>;

          const details = getOptionDetails(step.value);
          if (!details) return <p className="text-gray">Loading...</p>;

          return (
            <>
              <p className="text-gray">
                {details.id}. {details.text}
              </p>
            </>
          );
        })()}
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
      <div className="d-flex gap-3">
        <p
          className="text-blue fs-md-1 week-2-question-text fw-bold"
          style={{ fontSize: 1 + "em" }}
        >
          Statement 5:
        </p>
        <p
          className="text-blue fs-md-4 week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          {activity1.steps[5].question}
        </p>
      </div>
      <div className="d-flex gap-3">
        <p
          className="text-gray fs-md-1 text-gray week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          Answers:
        </p>
        {(() => {
          const answers = getActivityAnswer(activity1.id);
          if (!Array.isArray(answers))
            return <p className="text-gray">Loading...</p>;

          const step = answers.find(
            (a) => a.stepId === activity1.steps[5].stepId
          );
          if (!step || !step.value)
            return <p className="text-gray">Loading...</p>;

          const details = getOptionDetails(step.value);
          if (!details) return <p className="text-gray">Loading...</p>;

          return (
            <>
              <p className="text-gray">
                {details.id}. {details.text}
              </p>
            </>
          );
        })()}
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
      <div className="d-flex gap-3">
        <p
          className="text-blue fs-md-1 week-2-question-text fw-bold"
          style={{ fontSize: 1 + "em" }}
        >
          Statement 6:
        </p>
        <p
          className="text-blue fs-md-4 week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          {activity1.steps[6].question}
        </p>
      </div>
      <div className="d-flex gap-3">
        <p
          className="text-gray fs-md-1 text-gray week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          Answers:
        </p>
        {(() => {
          const answers = getActivityAnswer(activity1.id);
          if (!Array.isArray(answers))
            return <p className="text-gray">Loading...</p>;

          const step = answers.find(
            (a) => a.stepId === activity1.steps[6].stepId
          );
          if (!step || !step.value)
            return <p className="text-gray">Loading...</p>;

          const details = getOptionDetails(step.value);
          if (!details) return <p className="text-gray">Loading...</p>;

          return (
            <>
              <p className="text-gray">
                {details.id}. {details.text}
              </p>
            </>
          );
        })()}
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
      <p className="bg-blue py-md-3 px-md-5 py-1 px-2 text-white d-inline-block rounded-5 fs-md-4">
        Activity 2
      </p>
      <hr />
      <div className="d-flex gap-3">
        <p
          className="text-blue fs-md-1 week-2-question-text fw-bold"
          style={{ fontSize: 1 + "em" }}
        >
          Question 1:
        </p>
        <p
          className="text-blue fs-md-4 week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          {activity2.question}
        </p>
      </div>
      <div className="d-flex gap-3">
        <p
          className="text-gray fs-md-1 text-gray week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          Answers:
        </p>
        <p className="fs-md-5 flex-grow-1">{getActivityAnswer(activity2.id)}</p>
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
          Question 1:
        </p>
        <p
          className="text-blue fs-md-4 week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          {activity3.question}
        </p>
      </div>
      <div className="d-flex gap-3">
        <p
          className="text-gray fs-md-1 text-gray week-2-question-text"
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
      <p
        className="text-gray fs-md-4 week-2-question-text"
        accordion
        style={{ fontSize: 1 + "em" }}
      >
        {[activity4.steps[0].challenge].map((text) => (
          <>
            <span className="text-gray">{text}</span>
            <br />
          </>
        ))}
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
          {activity4.steps[1].instruction}
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
              INNER CIRCLE
            </p>
            <div className="px-2 py-1 px-md-5 py-md-3">
              {drag1("inner")?.map((item, idx) => (
                <p className="fs-md-4">
                  {idx + 1}. {item}
                </p>
              ))}
            </div>
          </div>
          <div className="flex-grow-1">
            <p
              className="text-center bg-orange text-white py-md-3 py-1 fs-md-1 week-2-question-text"
              style={{ fontSize: 1 + "em" }}
            >
              MIDDLE CIRCLE
            </p>
            <div className="px-2 py-1 px-md-5 py-md-3">
              {drag1("middle")?.map((item, idx) => (
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
              OUTER CIRCLE
            </p>
            <div className="px-2 py-1 px-md-5 py-md-3">
              {drag1("outer")?.map((item, idx) => (
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
      {/* Activity 5 */}
      <p className="bg-blue py-md-3 px-md-5 py-1 px-2 text-white d-inline-block rounded-5 fs-md-4">
        Activity 5
      </p>
      <p
        className="text-gray fs-md-4 week-2-question-text mb-3"
        accordion
        style={{ fontSize: 1 + "em" }}
      >
        Now that you’ve reflected on your own well-being and support systems,
        it’s time to create your own SEL and Positive Psychology Implementation
        Plan.
      </p>
      <p
        className="text-gray fs-md-4 week-2-question-text mb-3"
        accordion
        style={{ fontSize: 1 + "em" }}
      >
        This plan will help you bring SEL to life in your classroom consistently
        and sustainably. It’s not about perfection, it’s about purpose!
      </p>
      <p
        className="text-gray fs-md-4 week-2-question-text fw-bolder"
        accordion
        style={{ fontSize: 1 + "em" }}
      >
        SEL & Positive Psychology Implementation Plan Worksheet.
      </p>
      <p
        className="text-gray fs-md-4 week-2-question-text"
        accordion
        style={{ fontSize: 1 + "em" }}
      >
        Your personal roadmap to building an emotionally intelligent and
        thriving classroom.
      </p>
      <hr />
      <div className="d-flex gap-3">
        <p
          className="text-blue fs-md-1 week-2-question-text fw-bold"
          style={{ fontSize: 1 + "em" }}
        >
          {activity5.steps[2].questionFocus}
        </p>
        <p
          className="text-blue fs-md-4 week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          {activity5.steps[2].question}
        </p>
      </div>
      <p
        className="text-gray text-bg-secondary fs-md-4 week-2-question-text px-3 rounded-2"
        accordion
        style={{ fontSize: 1 + "em" }}
      >
        {activity5.steps[2].cheatSheet}
      </p>
      <div className="d-flex gap-3">
        <p
          className="text-gray fs-md-1 text-gray week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          Answers:
        </p>
        <p className="fs-md-5 flex-grow-1">
          {(() => {
            const activity = getActivityAnswer(activity5.id);
            if (!activity || !activity.step_3 || !activity.step_3.mainInput)
              return "";
            return activity.step_3.mainInput;
          })()}
        </p>

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
      <div className="d-flex gap-3">
        <p
          className="text-blue fs-md-1 week-2-question-text fw-bold"
          style={{ fontSize: 1 + "em" }}
        >
          {activity5.steps[3].questionFocus}
        </p>
        <p
          className="text-blue fs-md-4 week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          {activity5.steps[3].question}
        </p>
      </div>
      <p
        className="text-gray text-bg-secondary fs-md-4 week-2-question-text px-3 rounded-2"
        accordion
        style={{ fontSize: 1 + "em" }}
      >
        {activity5.steps[3].cheatSheet}
      </p>
      <div className="d-flex gap-3">
        <p
          className="text-gray fs-md-1 text-gray week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          Answers:
        </p>
        <p className="fs-md-5 flex-grow-1">
          {(() => {
            const activity = getActivityAnswer(activity5.id);
            if (!activity || !activity.step_4 || !activity.step_4.mainInput)
              return "";
            return activity.step_4.mainInput;
          })()}
        </p>

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
      <div className="d-flex gap-3">
        <p
          className="text-blue fs-md-1 week-2-question-text fw-bold"
          style={{ fontSize: 1 + "em" }}
        >
          {activity5.steps[4].questionFocus}
        </p>
        <p
          className="text-blue fs-md-4 week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          {activity5.steps[4].question}
        </p>
      </div>
      <p
        className="text-gray text-bg-secondary fs-md-4 week-2-question-text px-3 rounded-2"
        accordion
        style={{ fontSize: 1 + "em" }}
      >
        {activity5.steps[4].cheatSheet}
      </p>
      {/* Chekboxes comes in here */}
      {(() => {
        const selected =
          getActivityAnswer(activity5.id)?.step_5?.checkboxes || {};
        const mapped = mapSelectedOptions(selected);

        return mapped.map((item) => (
          <div className="d-flex gap-1 gap-md-2 p-1" key={item.id}>
            <img
              src={item.selected ? checkedImage : unCheckedImage}
              alt={item.label}
              style={{ width: 20, height: 20 }}
            />
            <div
              className="week-2-question-text text-gray"
              style={{ fontSize: 1 + "em" }}
            >
              {item.label}
            </div>
          </div>
        ));
      })()}

      <div className="d-flex gap-3">
        <p
          className="px-2 text-gray fs-md-1 text-gray week-2-question-text fw-bolder"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          Others:
        </p>
        <p className="fs-md-5 flex-grow-1">
          {(() => {
            const activity = getActivityAnswer(activity5.id);
            if (!activity || !activity.step_5 || !activity.step_5.others_)
              return "";
            return activity.step_5.others_;
          })()}
        </p>
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
      <p
        className="text-gray fs-md-1 text-gray week-2-question-text"
        accordion
        style={{ fontSize: 1 + "em" }}
      >
        My integration plan (brief description):
      </p>
      <p className="fs-md-5 flex-grow-1">
        {(() => {
          const activity = getActivityAnswer(activity5.id);
          if (
            !activity ||
            !activity.step_5 ||
            !activity.step_5.my_integration_plan__brief_description__
          )
            return "";
          return activity.step_5.my_integration_plan__brief_description__;
        })()}
      </p>

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
      <div className="d-flex gap-3">
        <p
          className="text-blue fs-md-1 week-2-question-text fw-bold"
          style={{ fontSize: 1 + "em" }}
        >
          {activity5.steps[5].questionFocus}
        </p>
        <p
          className="text-blue fs-md-4 week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          {activity5.steps[5].question}
        </p>
      </div>
      <p
        className="text-gray text-bg-secondary fs-md-4 week-2-question-text px-3 rounded-2"
        accordion
        style={{ fontSize: 1 + "em" }}
      >
        {activity5.steps[5].cheatSheet}
      </p>
      <div className="d-flex gap-3">
        <p
          className="text-gray fs-md-1 text-gray week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          Answers:
        </p>
        <p className="fs-md-5 flex-grow-1">
          {(() => {
            const activity = getActivityAnswer(activity5.id);
            if (!activity || !activity.step_6 || !activity.step_6.mainInput)
              return "";
            return activity.step_6.mainInput;
          })()}
        </p>

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
      <div className="d-flex gap-3">
        <p
          className="text-blue fs-md-1 week-2-question-text fw-bold"
          style={{ fontSize: 1 + "em" }}
        >
          {activity5.steps[6].questionFocus}
        </p>
        <p
          className="text-blue fs-md-4 week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          {activity5.steps[6].question}
        </p>
      </div>
      <p
        className="text-gray text-bg-secondary fs-md-4 week-2-question-text px-3 rounded-2"
        accordion
        style={{ fontSize: 1 + "em" }}
      >
        {activity5.steps[6].cheatSheet}
      </p>
      <div className="d-flex gap-3">
        <p
          className="text-gray fs-md-1 text-gray week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          Answers:
        </p>
        <p className="fs-md-5 flex-grow-1">
          {(() => {
            const activity = getActivityAnswer(activity5.id);
            if (!activity || !activity.step_7 || !activity.step_7.mainInput)
              return "";
            return activity.step_7.mainInput;
          })()}
        </p>

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
      <div className="d-flex gap-3">
        <p
          className="text-blue fs-md-1 week-2-question-text fw-bold"
          style={{ fontSize: 1 + "em" }}
        >
          {activity5.steps[7].questionFocus}
        </p>
        <p
          className="text-blue fs-md-4 week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          {activity5.steps[7].question}
        </p>
      </div>
      <p
        className="text-gray text-bg-secondary fs-md-4 week-2-question-text px-3 rounded-2"
        accordion
        style={{ fontSize: 1 + "em" }}
      >
        {activity5.steps[7].cheatSheet}
      </p>
      <div className="d-flex gap-3">
        <p
          className="text-gray fs-md-1 text-gray week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          Answers:
        </p>
        <div>
          <p className="fs-md-5 flex-grow-1">
            1.{" "}
            {(() => {
              const activity = getActivityAnswer(activity5.id);
              if (!activity || !activity.step_8 || !activity.step_8.input1)
                return "";
              return activity.step_8.input1;
            })()}
          </p>
          <p className="fs-md-5 flex-grow-1">
            2.{" "}
            {(() => {
              const activity = getActivityAnswer(activity5.id);
              if (!activity || !activity.step_8 || !activity.step_8.input2)
                return "";
              return activity.step_8.input2;
            })()}
          </p>
        </div>

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
      <div className="d-flex gap-3">
        <p
          className="text-blue fs-md-1 week-2-question-text fw-bold"
          style={{ fontSize: 1 + "em" }}
        >
          {activity5.steps[7].additionalFields[0].questionFocus}
        </p>
        <p
          className="text-blue fs-md-4 week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          {activity5.steps[7].additionalFields[0].question}
        </p>
      </div>
      <p
        className="text-gray text-bg-secondary fs-md-4 week-2-question-text px-3 rounded-2"
        accordion
        style={{ fontSize: 1 + "em" }}
      >
        {activity5.steps[7].additionalFields[0].cheatSheet}
      </p>
      <div className="d-flex gap-3">
        <p
          className="text-gray fs-md-1 text-gray week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          Answers:
        </p>
        <p className="fs-md-5 flex-grow-1">
          {(() => {
            const activity = getActivityAnswer(activity5.id);
            if (!activity || !activity.step_8 || !activity.step_8.collaboration)
              return "";
            return activity.step_8.collaboration;
          })()}
        </p>

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
      <div className="d-flex gap-3">
        <p
          className="text-blue fs-md-1 week-2-question-text fw-bold"
          style={{ fontSize: 1 + "em" }}
        >
          {activity5.steps[8].questionFocus}
        </p>
        <p
          className="text-blue fs-md-4 week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          {activity5.steps[8].question}
        </p>
      </div>
      <p
        className="text-gray text-bg-secondary fs-md-4 week-2-question-text px-3 rounded-2"
        accordion
        style={{ fontSize: 1 + "em" }}
      >
        {activity5.steps[8].cheatSheet}
      </p>
      <div className="d-flex gap-3">
        <p
          className="text-gray fs-md-1 text-gray week-2-question-text"
          accordion
          style={{ fontSize: 1 + "em" }}
        >
          Answers:
        </p>
        <p className="fs-md-5 flex-grow-1">
          {(() => {
            const activity = getActivityAnswer(activity5.id);
            if (!activity || !activity.step_9 || !activity.step_9.mainInput)
              return "";
            return activity.step_9.mainInput;
          })()}
        </p>

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
      {/* Assesment 1 */}
      <p className="bg-blue py-1 px-1 py-md-3 px-md-2 text-white d-inline-block rounded-5 fs-md-4">
        Post-Assessment
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

export default Week6;
