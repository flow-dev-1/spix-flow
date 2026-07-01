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
import { adminData } from "@/store/adminReducer";
import Modal from "../../components/Modal.jsx";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";

function Week2({ enrollmentId, setWeekTwoData, isSchool, studentId }) {
  const { pages } = getWeekContentExcludingVideos(2);
  const [activityData, setActivityData] = useState([]);
  const [assessmentData, setAssessmentData] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState("");
  const [activityFeedbackId, setActivityFeedbackId] = useState(null);

  const { isAdmin, code } = useSelector(adminData);

  const { questions: assessments } = getWeekAssessment(2);

  const [
    activity1,
    activity2,
    activity3,
    activity4,
    activity5,
    activity6,
    activity7,
    activity8,
  ] = pages;

  // toDo: Fetch User assessment and Activity Data
  const { data, isPending, isError } = useQuery({
    queryKey: ["dashboard/transition2-feedback-2", enrollmentId, 2],
    queryFn: () => {
      if (isAdmin) return adminService.getUserCourseData(enrollmentId, 2, code);
      if (isSchool) return schoolService.getStudentCourseData(enrollmentId, 2, studentId);
      return userService.getUserCourseData(enrollmentId, 2);
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
        2,
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

    console.table("data", data.activity?.activities);

    setActivityData(data.activity?.activities);
    setAssessmentData(data.assessment?.assessments);
    setWeekTwoData(true);

    return () => { };
  }, [data, setWeekTwoData]);

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

  // function getActivityAnswer(activityId, itemId) {
  //   if (!activityData) return "";

  //   const activity = activityData.find((a) => a.page === activityId);
  //   if (!activity || !activity.answer) return "";

  //   const answer = activity.answer;

  //   if (!itemId) {
  //     return answer ?? "";
  //   } else {
  //     if (Array.isArray(answer)) {
  //       return answer.find((a) => a.id === itemId)?.value ?? "";
  //     } else if (typeof answer === "object") {
  //       return answer.id === itemId ? answer.value ?? "" : "";
  //     } else {
  //       return "";
  //     }
  //   }
  // }

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

  function getSelectedItems(selectedMap) {
    if (!selectedMap || typeof selectedMap !== "object") return [];

    const items = [
      { value: "Honesty" },
      { value: "Respect" },
      { value: "Kindess" },
      { value: "Responsibility" },
      { value: "Family" },
      { value: "Faith" },
      { value: "Hardwork" },
      { value: "Growth" },
      { value: "Justice" },
      { value: "Balance" },
    ];

    return Object.keys(selectedMap)
      .filter((key) => selectedMap[key])
      .map((index) => items[Number(index)]?.value)
      .filter(Boolean);
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
      const answerData = activityData.find(
        (item) => item.page === activityFeedbackId.activityId
      );

      const feedbackData = answerData?.answer?.find(
        (item) => item.id === activityFeedbackId.itemId
      );

      feedbackData.feedback = value; // Set feedback entry with key as index

      handleModalClose();
      mutation.mutate();
    }
  };

  const renderActivityFeedbackControls = (activity) => {
    if (!activity) return null;

    const feedback = activityData?.find(
      (item) => item.page === activity.id
    )?.feedback;

    return (
      <>
        {isAdmin && !feedback && (
          <Icon
            onClick={() => {
              setActivityFeedbackId({ activityId: activity.id });
              handleModalOpen();
            }}
            style={{ color: "#D6D6D6" }}
            width={35}
            icon="tabler:message-2"
          />
        )}
      </>
    );
  };

  const renderActivityFeedback = (activity) => {
    if (!activity) return null;

    const feedback = activityData?.find(
      (item) => item.page === activity.id
    )?.feedback;

    if (!feedback) return null;

    return (
      <div className="d-flex gap-3">
        <p className="text-bg-secondary rounded-4 px-1 px-md-3 fs-md-5 align-self-start">
          Feedback
        </p>
        <p className="bg-step-active text-gray fs-md-5 flex-grow-1 p-md-2 p-1 rounded">
          {getActivityFeedback(activity.id)}
        </p>
        {isAdmin && (
          <Icon
            onClick={() => {
              setModalData(getActivityFeedback(activity.id));
              setActivityFeedbackId({ activityId: activity.id });
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

  const renderActivitySection = (sn, activity, answerContent, questionText) => {
    if (!activity) return null;

    return (
      <>
        <p className="bg-yellow py-md-3 px-md-5 py-1 px-2 text-gray d-inline-block rounded-5 fs-md-4">
          Activity {sn}
        </p>
        <hr />
        <div className="d-flex gap-3">
          <h2 className="text-blue fs-md-1">Questions:</h2>
          <p className="text-blue fs-md-4" style={{ whiteSpace: "pre-line" }}>
            {questionText || activity.question || activity.instruction}
          </p>
        </div>
        <div className="d-flex gap-3">
          <h2 className="text-gray fs-md-1 text-gray">Answers:</h2>
          {answerContent}
          {renderActivityFeedbackControls(activity)}
        </div>
        {renderActivityFeedback(activity)}
        <hr />
      </>
    );
  };

  const renderPlainAnswer = (activity) => (
    <p className="fs-md-5 flex-grow-1">{getActivityAnswer(activity.id)}</p>
  );

  const renderListAnswer = (activity) => (
    <ul className="list-unstyled fs-md-2 flex-grow-1">
      {(getActivityAnswer(activity.id) || [])?.map((item, idx) => (
        <li key={idx} className="text-lg">
          {idx + 1}. {item.value}
        </li>
      ))}
    </ul>
  );

  const getDragItems = (activity, bucketId) => {
    const bucketIndexes = getActivityAnswer(activity.id)?.[bucketId] || [];
    return bucketIndexes
      .map((index) => activity.images?.[index])
      .filter(Boolean);
  };

  const renderDragAnswer = (activity) => (
    <div className="flex-grow-1 d-flex flex-column flex-md-row">
      <div className="flex-grow-1">
        <h2 className="text-center bg-green text-white py-md-3 py-0 py-md-1 fs-md-1">
          Growth Mindset
        </h2>
        <div className="px-md-5 px-2 py-md-3 py-0 py-md-1">
          {getDragItems(activity, "green").map((item, idx) => (
            <p key={item} className="fs-md-4">
              {idx + 1}. {item}
            </p>
          ))}
        </div>
      </div>
      <div className="flex-grow-1">
        <h2 className="bg-red text-center text-white py-md-3 py-0 py-md-1 fs-md-1">
          Fixed Mindset
        </h2>
        <div className="px-md-5 px-2 py-md-3 py-0 py-md-1">
          {getDragItems(activity, "red").map((item, idx) => (
            <p key={item} className="fs-md-4">
              {idx + 1}. {item}
            </p>
          ))}
        </div>
      </div>
    </div>
  );

  const renderValuesAnswer = (activity) => {
    const answer = getActivityAnswer(activity.id);
    const selectedItems = getSelectedItems(answer?.selectedValues);
    const rankedItems = Object.entries(answer?.rankValues || {})
      .sort(([, firstRank], [, secondRank]) => Number(firstRank) - Number(secondRank));

    return (
      <div className="flex-grow-1">
        <p className="fs-md-5 mb-2">Selected Values:</p>
        <ul className="list-unstyled fs-md-2">
          {selectedItems.map((item, idx) => (
            <li key={item} className="text-lg">
              {idx + 1}. {item}
            </li>
          ))}
        </ul>
        <p className="fs-md-5 mb-2">Ranked Values:</p>
        <ul className="list-unstyled fs-md-2">
          {rankedItems.map(([value, rank]) => (
            <li key={value} className="text-lg">
              {rank}. {value}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <>
      {renderActivitySection(1, activity1, renderPlainAnswer(activity1))}
      {renderActivitySection(2, activity2, renderPlainAnswer(activity2))}
      {renderActivitySection(3, activity3, renderDragAnswer(activity3))}
      {renderActivitySection(4, activity4, renderPlainAnswer(activity4))}
      {renderActivitySection(5, activity5, renderListAnswer(activity5))}
      {renderActivitySection(6, activity6, renderValuesAnswer(activity6))}
      {renderActivitySection(7, activity7, renderPlainAnswer(activity7))}
      {renderActivitySection(8, activity8, renderPlainAnswer(activity8))}

      {/* Assesment 1 */}
      <p className="bg-yellow py-md-3 px-md-5 py-1 px-2 text-gray d-inline-block rounded-5 fs-md-4">
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
                  className="d-flex gap-md-2 p-1 mb-3 justify-content-between"
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

export default Week2;
