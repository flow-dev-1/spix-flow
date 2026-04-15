import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import QuestionBox from "../../../components/QuestionBox";
import Frame from "./components/Frame";
import Button from "../../../components/Button";
import BigTextBox from "../../../components/BigTextBox";
import {
  selectPageData,
  selectCurrentStep,
  navigateNext,
} from "@/store/navigationSlice";
import TOTFeedbackModal from "../../../components/TOTFeedbackModal";
import StepIndicator from "../../../components/StepIndicator";
import {
  userAnswer,
  saveActivity,
} from "@/store/userAnswersReducer";
import { adminData } from "@/store/adminReducer";

function WeekTwoPage10() {
  const dispatch = useDispatch();
  const pageData = useSelector(selectPageData);
  const currentStep = useSelector(selectCurrentStep);
  const totalSteps = pageData?.steps?.length || 0;
  const [answers, setAnswers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [myAnswer, setMyAnswer] = useState("");
  const step = pageData?.steps[currentStep - 1];
  const userAnswers = useSelector(userAnswer);
  const adminDatas = useSelector(adminData);

  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackInfo, setFeedbackInfo] = useState({
    isCorrect: false,
    feedback: "",
    correctOptionText: "",
  });

  const handleCloseFeedback = () => {
    setShowFeedback(false);
    dispatch(navigateNext());
  };

  useEffect(() => {
    if (!userAnswers || !pageData.id) return;
    const response = userAnswers.activities?.find(
      (item) => item.page === pageData.id,
    );
    const existingAnswers = Array.isArray(response?.answer)
      ? response.answer
      : [];
    setAnswers(existingAnswers);

    // Sync myAnswer for reflection step
    if (step?.type === "question") {
      const stepAnswer = existingAnswers.find((a) => a.stepId === currentStep);
      setMyAnswer(stepAnswer ? stepAnswer.value : "");
    }
  }, [userAnswers, pageData.id, currentStep, step?.type]);

  const saveUserInput = () => {
    if (adminDatas.isAdmin) return true;

    if (!step) return true;

    if (step.type === "dropdownScenario") {
      const stepData = answers.find((item) => item.stepId === currentStep);
      if (!stepData || !stepData.value) {
        setErrorMessage("Oops! Please select an option.");
        return false;
      }

      setErrorMessage("");

      const isCorrect = stepData.value === step.correctOption;
      const correctOptionText =
        step.options.find((o) => o.id === step.correctOption)?.text || "";

      setFeedbackInfo({
        isCorrect,
        feedback: step.feedback || "",
        correctOptionText,
      });

      dispatch(
        saveActivity({
          page: pageData.id,
          answer: answers,
        }),
      );

      setShowFeedback(true);
      return false;
    }

    if (step.type === "question") {
      if (!myAnswer) {
        setErrorMessage("Oops! Please enter a valid input!");
        return false;
      }

      setErrorMessage("");

      const updatedAnswers = [...answers];
      const existingStepIndex = updatedAnswers.findIndex(
        (a) => a.stepId === currentStep,
      );
      if (existingStepIndex !== -1) {
        updatedAnswers[existingStepIndex] = {
          ...updatedAnswers[existingStepIndex],
          value: myAnswer,
        };
      } else {
        updatedAnswers.push({ stepId: currentStep, value: myAnswer });
      }

      dispatch(
        saveActivity({
          page: pageData.id,
          answer: updatedAnswers,
        }),
      );

      return true; // Go to next page
    }

    return true;
  };

  const renderStep = () => {
    if (!step) return <div className="text-center p-5">Invalid Step</div>;

    switch (step.type) {
      case "dropdownScenario":
        return (
          <Frame
            data={{
              step: step.stepId,
              question: step.question,
              options: step.options,
            }}
            setErrorMessage={setErrorMessage}
            answers={answers}
            setAnswers={setAnswers}
          />
        );
      case "question":
        return (
          <QuestionBox extraStyle="bg-custom-blue">
            <div className="d-flex gap-3 flex-column flex-md-row flex-md-nowrap align-items-start mt-4">
              <h2 className="text-blue fs-1 mb-0 flex-shrink-0 tot-question-text">
                Question :
              </h2>
              <div className="d-flex flex-column flex-grow-1 min-w-0 tot-question-text">
                <h2 className="text-gray fs-1 mb-2 ">{step.question}</h2>
              </div>
            </div>
            <div className="mt-4">
              <BigTextBox
                handleChange={(e) => {
                  setErrorMessage("");
                  setMyAnswer(e.target.value);
                }}
                value={myAnswer}
              />
            </div>
          </QuestionBox>
        );
      default:
        return (
          <div className="text-center p-5 text-white">Unknown step type</div>
        );
    }
  };

  return (
    <>
      {renderStep()}
      {errorMessage && (
        <div className="text-danger text-center mt-2 fw-bold">
          {errorMessage}
        </div>
      )}
      <StepIndicator totalSteps={totalSteps} />
      <div className="d-flex justify-content-center gap-96px mt-4 gap-4">
        <Button text="Prev" />
        <Button text="Next" customOnClick={saveUserInput} />
      </div>
      <TOTFeedbackModal show={showFeedback} onHide={handleCloseFeedback}>
        <div className="text-center">
          <p className="text-blue mb-3">
            {feedbackInfo.isCorrect
              ? "Correct!"
              : `${feedbackInfo.correctOptionText} is the right answer!`}
          </p>
          <p className="text-blue">{feedbackInfo.feedback}</p>
        </div>
      </TOTFeedbackModal>
    </>
  );
}

export default WeekTwoPage10;
