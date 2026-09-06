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

  useEffect(() => {
    if (!userAnswers) return;
    setAnswers(userAnswers?.assessments || []);
    return () => {};
  }, [userAnswers]);

  const handleOptionSelect = (optionKey) => {
    setErrorMessage("");
    const updatedAnswers = [
      ...answers.filter((answer) => answer.id !== currentStep),
      { id: currentStep, value: optionKey },
    ];
    setAnswers(updatedAnswers);
    dispatch(saveAssessment(updatedAnswers));
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

    return true;
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
        selectedOption={answers.find((answer) => answer.id === currentStep)?.value || ""}
        onOptionSelect={handleOptionSelect}
        isPreAssessment={true}
      />
    );
  };

  if (!assessmentData) return null;

  // If we're on the last question and user has made a selection,
  // show the review popup instead of the next button

  const hasCurrentSelection = answers.some((answer) => answer.id === currentStep);
  const shouldShowReviewButton = isLastQuestion && hasCurrentSelection;

  return (
    <>
      <QuestionBox>
        <div className="text-white p-3 mb-3">
          <h2 className="fs-1 text-blue text-center tot-week-2-question-text fw-bold ">
            {assessmentData.title}
          </h2>
          <p className="text-center text-blue">{assessmentData.subtitle}</p>
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

export default WeekOneAssessment;
