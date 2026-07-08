import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import QuestionBox from "../../../components/QuestionBox";
import AssessmentQuestion from "../../../components/AssessmentQuestion";
import Button from "../../../components/Button";
import {
  navigateNext,
  selectCurrentStep,
  selectCurrentWeek,
  showReviewPopup,
} from "@/store/navigationSlice";
import { getWeekAssessment } from "../../../data";
import StepIndicator from "../../../components/StepIndicator";
import {
  userAnswer,
  saveAssessment,
} from "@/store/userAnswersReducer";
import { toast } from "react-toastify";
import { calculateResult } from "../../../utility";
import { adminData } from "@/store/adminReducer";

function WeekFourAssessment() {
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

  useEffect(() => {
    if (!userAnswers) return;
    setAnswers(userAnswers?.assessments || []);
    return () => {};
  }, [userAnswers]);

  const handleOptionSelect = (optionKey) => {
    setErrorMessage("");
    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      const stepIndex = updatedAnswers.findIndex(
        (answer) => answer.id === currentStep
      );

      if (stepIndex !== -1) {
        updatedAnswers[stepIndex] = {
          ...updatedAnswers[stepIndex],
          value: optionKey,
        };
      } else {
        updatedAnswers.push({
          id: currentStep,
          value: optionKey,
        });
      }

      return updatedAnswers;
    });
  };

  const saveUserData = () => {
    if (adminDatas.isAdmin) return true;

    const stepData = answers.find((item) => item.id === currentStep);
    if (!stepData) {
      setErrorMessage("Oops! Please choose an option to proceed.");
      return false;
    }

    setErrorMessage(""); // Clear error if input is valid

    // If its the last question submit else update answer
    dispatch(saveAssessment(answers));


    if (isLastQuestion) {
      const hasUnansweredQuestions = answers.length !== totalSteps;
      if (hasUnansweredQuestions) {
        setErrorMessage(
          "Oops! Some unanswered questions have been detected. Kindly go back and review!"
        );
        return false;
      }

      const userScore = calculateResult(
        assessmentData.questions,
        answers,
        totalSteps
      );

      toast.dismiss();
      toast.success(`You scored ${userScore}% in the quiz`);
      dispatch(navigateNext());

      //   const selectedActivity = userAnswers.activities.find(activity => activity.page === 6);
      //   const isValidActivity = selectedActivity && Array.isArray(selectedActivity.answer) && selectedActivity.answer.length === 5;

      //   if (isValidActivity) {
      //     const isValid = selectedActivity.answer.every(item =>
      //       item.stepId !== undefined &&
      //       item.value &&
      //       Object.keys(item.value).length === 3
      //     );

      //     if (isValid) {
      //       const userScore = calculateResult(assessmentData.questions, answers, totalSteps)

      //       mutation.mutate({ ...userAnswers, assessments: answers, rating: userScore.toString() });
      //     } else {

      //       setErrorMessage("Oops! Some unanswered questions have been detected. Kindly go back and review!");
      //       return false;
      //     }
      //   } else {
      //     setErrorMessage("Oops! Some unanswered questions have been detected. Kindly go back and review!");
      //     return false;
      //   }
    } else {
      return true;
    }
    // Dispatch the saveActivity action
  };

  const renderStep = () => {
    if (!assessmentData) return <div>Loading assessment...</div>;

    const currentQuestion = assessmentData.questions[currentStep - 1];
    if (!currentQuestion) return <div>Invalid Step</div>;

    const formattedOptions = currentQuestion.options.map((option) => ({
      [option.id]: option.text,
    }));

    return (
      <AssessmentQuestion
        data={{
          question: currentQuestion.question,
          options: formattedOptions,
        }}
        currentStep={currentStep}
        selectedOption={answers[currentStep - 1]?.value || ""}
        onOptionSelect={handleOptionSelect}
      />
    );
  };

  if (!assessmentData) return null;

  // If we're on the last question and user has made a selection,
  // show the review popup instead of the next button

  const hasCurrentSelection = !!answers[currentStep];
  const shouldShowReviewButton = isLastQuestion && hasCurrentSelection;

  return (
    <>
      <QuestionBox>
        <div className="bg-blue text-white p-3 mb-3 assessment-header">
          <h2 className="fs-1 text-white text-center">
            {assessmentData.title}
          </h2>
          <p className="text-center">{assessmentData.subtitle}</p>
        </div>

        {renderStep()}
      </QuestionBox>
      {errorMessage && <div className="text-danger">{errorMessage}</div>}{" "}
      {/* Display error message */}
      <StepIndicator totalSteps={totalSteps} />
      <div className="d-flex justify-content-center gap-96px mt-4 gap-4">
        <Button text="Prev" />
        {shouldShowReviewButton ? (
          <Button
            text="Review"
            customOnClick={() => dispatch(showReviewPopup())}
          />
        ) : (
          <Button
            text="Next"
            customOnClick={saveUserData}
          />
        )}
      </div>
    </>
  );
}

export default WeekFourAssessment;
