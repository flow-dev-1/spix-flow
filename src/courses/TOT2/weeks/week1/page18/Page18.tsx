import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import QuestionBox from "../../../components/QuestionBox";
import AssessmentQuestion from "../../../components/AssessmentQuestion";
import BigTextBox from "../../../components/BigTextBox";
import Button from "../../../components/Button";
import {
  navigateNext,
  selectCurrentStep,
  selectCurrentWeek,
} from "@/store/navigationSlice";
import { getWeekAssessment } from "../../../data";
import StepIndicator from "../../../components/StepIndicator";
import {
  userAnswer,
  updateData,
  saveAssessment,
} from "@/store/userAnswersReducer";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import userService from "@/services/api/user";
import { calculateResult } from "../../../utility";
import { adminData } from "@/store/adminReducer";

function WeekOneAssessment() {
  const dispatch = useDispatch();
  const currentStep = useSelector(selectCurrentStep);
  const currentWeek = useSelector(selectCurrentWeek);
  const assessmentData = getWeekAssessment(currentWeek);
  const totalSteps = assessmentData?.questions?.length || 0;
  const [answers, setAnswers] = useState([]); // State to hold answers
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const userAnswers = useSelector(userAnswer);
  const isLastQuestion = currentStep === assessmentData.totalQuestions;
  const adminDatas = useSelector(adminData);
  const currentQuestion = assessmentData?.questions?.[currentStep - 1];
  const mcqQuestions = assessmentData?.questions?.filter(
    (q) => q.type !== "reflection",
  ) || [];

  const getCurrentAnswer = () => {
    if (!currentQuestion) return null;

    // Prefer question-id mapping; fallback to legacy step-id mapping.
    return (
      answers.find((a) => a.id === currentQuestion.id) ||
      answers.find((a) => a.id === currentStep)
    );
  };

  useEffect(() => {
    if (!userAnswers) return;
    setAnswers(userAnswers?.assessments || []);
    return () => {};
  }, [userAnswers]);

  // Mutation for saving user data
  const mutation = useMutation({
    mutationFn: (data) => userService.submitCourseData(data), // Dispatch saveAssessment action
    onSuccess: (data) => {
      toast.dismiss();
      toast.success(
        `You scored ${calculateResult(
          mcqQuestions,
          answers,
          mcqQuestions.length,
        )}% in the quiz`,
      );
      toast.success(data.message || "Answers saved successfully!"); // Show success toast
      dispatch(
        updateData({
          course: null,
          courseEnrollmentId: null,
          week: 1,
          activities: [],
          assessments: [],
        })
      );
      dispatch(navigateNext());
    },
    onError: (error) => {
      console.log(error, "errorrrr");
      toast.dismiss();
      toast.error(error?.message || error?.error || "Error saving answers"); // Show error toast
    },
  });

  const handleOptionSelect = (optionKey) => {
    setErrorMessage("");
    if (!currentQuestion) return;

    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      const stepIndex = updatedAnswers.findIndex(
        (answer) =>
          answer.id === currentQuestion.id ||
          answer.id === currentStep,
      );

      if (stepIndex !== -1) {
        updatedAnswers[stepIndex] = {
          ...updatedAnswers[stepIndex],
          id: currentQuestion.id,
          value: optionKey,
        };
      } else {
        updatedAnswers.push({
          id: currentQuestion.id,
          value: optionKey,
        });
      }

      return updatedAnswers;
    });
  };

  const saveUserData = () => {
    if (adminDatas.isAdmin) return true;
    if (!currentQuestion) return false;

    const stepData =
      answers.find((item) => item.id === currentQuestion.id) ||
      answers.find((item) => item.id === currentStep);
    if (!stepData) {
      setErrorMessage("Oops! Please choose an option to proceed.");
      return false;
    }

    setErrorMessage(""); // Clear error if input is valid

    // If its the last question submit else update answer
    dispatch(saveAssessment(answers));

    if (isLastQuestion) {
      // console.log(userAnswers.activities.length, "userAnswers.activities.length")
      // Activity count check disabled for mock/testing
      // const hasUnansweredQuestions =
      //   answers.length !== totalSteps || userAnswers.activities.length !== 9;
      // if (hasUnansweredQuestions) {
      //   setErrorMessage("Oops! Some unanswered questions have been detected. Kindly go back and review!");
      //   return false;
      // }

      const userScore = calculateResult(
        mcqQuestions,
        answers,
        mcqQuestions.length,
      );

      mutation.mutate({
        ...userAnswers,
        assessments: answers,
        rating: userScore.toString(),
      });

      // For nested questions check that all answeres were provided

      // Page 2 has nested questions
      // const selectedActivity = userAnswers.activities.find(
      //   (activity) => activity.page === 2
      // );

      // const isValidActivity =
      //   selectedActivity &&
      //   Array.isArray(selectedActivity.answer) &&
      //   selectedActivity.answer.length === 3;

      // if (isValidActivity) {
      //   const userScore = calculateResult(
      //     assessmentData.questions,
      //     answers,
      //     totalSteps
      //   );

      //   console.log(userScore, "userScore");

      //   mutation.mutate({
      //     ...userAnswers,
      //     assessments: answers,
      //     rating: userScore.toString(),
      //   });

      //   //*****************This will come in later wen the code begins to break or escape questions ******/

      //   // const isValid = selectedActivity.answer.every(item =>
      //   //   item.stepId !== undefined &&
      //   //   item.value &&
      //   //   Object.keys(item.value).length === 3
      //   // );

      //   // if (isValid) {
      //   //   const userScore = calculateResult(assessmentData.questions, answers, totalSteps)

      //   //   console.log(userScore, "userScore")

      //   //   // mutation.mutate({ ...userAnswers, assessments: answers, rating: userScore.toString() });
      //   // } else {

      //   //   setErrorMessage("Oops! Some unanswered questions have been detected. Kindly go back and review!");
      //   //   return false;
      //   // }
      // } else {
      //   setErrorMessage(
      //     "Oops! Some unanswered questions have been detected. Kindly go back and review!"
      //   );
      //   return false;
      // }
    } else {
      return true;
    }
  };

  const renderStep = () => {
    if (!assessmentData) return <div>Loading assessment...</div>;

    if (!currentQuestion) return <div>Invalid Step</div>;

    if (currentQuestion.type === "reflection") {
      return (
        <QuestionBox extraStyle="bg-custom-blue">
          <div className="d-flex gap-3 flex-column flex-md-row flex-md-nowrap align-items-start mt-4">
            <h2 className="text-blue fs-1 mb-0 flex-shrink-0 tot-question-text">
              Question:
            </h2>

            <div className="d-flex flex-column flex-grow-1 min-w-0 tot-question-text">
              <h2 className="text-gray fs-1 mb-2 ">
                {" "}
                {currentQuestion.question}
              </h2>
            </div>
          </div>
          <BigTextBox
            handleChange={(e) => handleOptionSelect(e.target.value)}
            value={getCurrentAnswer()?.value || ""}
          />
        </QuestionBox>
      );
    }

    const formattedOptions = currentQuestion.options.map((option) => ({
      [option.id]: option.text,
    }));

    return (
      <>
        <div className="text-white p-3 mb-3">
          <h2 className="fs-1 text-blue text-center tot-week-2-question-text fw-bold ">
            Week 1 Assessment
          </h2>
          <p className="text-center text-blue">{assessmentData.subtitle}</p>
        </div>
        <AssessmentQuestion
          data={{
            question: currentQuestion.question,
            options: formattedOptions,
          }}
          currentStep={currentQuestion.id}
          selectedOption={getCurrentAnswer()?.value || ""}
          onOptionSelect={handleOptionSelect}
          isPreAssessment={true}
        />
      </>
    );
  };

  if (!assessmentData) return null;

  const currentAnswer = getCurrentAnswer();
  const hasCurrentSelection = !!currentAnswer?.value;
  const shouldShowReviewButton = isLastQuestion && hasCurrentSelection;

  return (
    <>
      <QuestionBox>{renderStep()}</QuestionBox>
      {errorMessage && <div className="text-danger">{errorMessage}</div>}{" "}
      {/* Display error message */}
      <StepIndicator totalSteps={totalSteps} />
      <div className="d-flex justify-content-center gap-96px mt-4 gap-4">
        <Button text="Prev" loading={mutation.isPending} />
        <Button
          text={shouldShowReviewButton ? "Submit" : "Next"}
          customOnClick={saveUserData}
          loading={mutation.isPending}
        />
      </div>
    </>
  );
}

export default WeekOneAssessment;
