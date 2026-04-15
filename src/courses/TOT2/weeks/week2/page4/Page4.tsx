import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import QuestionBox from "../../../components/QuestionBox";
import Button from "../../../components/Button";
import TOTFeedbackModal from "../../../components/TOTFeedbackModal";
import StepIndicator from "../../../components/StepIndicator";
import {
  selectPageData,
  selectCurrentStep,
  navigateNext,
} from "@/store/navigationSlice";
import { adminData } from "@/store/adminReducer";
import {
  userAnswer,
  saveActivity,
} from "@/store/userAnswersReducer";

import checkedImage from "@/assets/checkedbox.png";
import uncheckedImage from "@/assets/uncheckedBox.png";

function Page4() {
  const dispatch = useDispatch();
  const pageData = useSelector(selectPageData);
  const currentStep = useSelector(selectCurrentStep);
  const adminDatas = useSelector(adminData);
  const userAnswers = useSelector(userAnswer);

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  useEffect(() => {
    if (!userAnswers || !pageData) return;
    const response = userAnswers?.activities?.find(
      (item) => item.page === pageData.id,
    );

    if (response?.answer && Array.isArray(response.answer)) {
      const stepAnswer = response.answer.find((a) => a.stepId === currentStep);
      setSelectedOptions(stepAnswer ? stepAnswer.value : []);
    } else {
      setSelectedOptions([]);
    }
  }, [userAnswers, pageData, currentStep]);

  const toggleOption = (option) => {
    setErrorMessage("");
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option],
    );
  };

  const saveUserInput = () => {
    const step = pageData.steps[currentStep - 1];

    if (!step) return false;

    if (step.type === "instruction") {
      return true;
    }

    if (!adminDatas.isAdmin && selectedOptions.length === 0) {
      setErrorMessage("Oops! Please select at least one option!");
      return false;
    }

    setErrorMessage("");

    if (adminDatas.isAdmin) {
      return true;
    }

    // Prepare for feedback
    setFeedbackText(step.feedback || "");
    setShowFeedback(true);

    // Save answers
    const currentActivities = userAnswers?.activities || [];
    const response = currentActivities.find(
      (item) => item.page === pageData.id,
    );
    let updatedAnswers = response?.answer ? [...response.answer] : [];

    const existingStepIndex = updatedAnswers.findIndex(
      (a) => a.stepId === currentStep,
    );
    if (existingStepIndex !== -1) {
      updatedAnswers[existingStepIndex] = {
        stepId: currentStep,
        value: selectedOptions,
      };
    } else {
      updatedAnswers.push({ stepId: currentStep, value: selectedOptions });
    }

    dispatch(
      saveActivity({
        page: pageData.id,
        answer: updatedAnswers,
      }),
    );

    return false; // Stay until modal close
  };

  const handleNext = () => {
    setShowFeedback(false);
    dispatch(navigateNext());
  };

  const renderStep = () => {
    if (!pageData?.steps) return null;
    const step = pageData.steps[currentStep - 1];

    if (!step) return null;

    if (step.type === "instruction") {
      return (
        <QuestionBox extraStyle="bg-blue">
          <div className="text-center mb-5 mt-5 mt-md-4">
            <h1 className="text-mute bg-white py-2 px-5 rounded d-inline week-2-question-text tot-text-instruction">
              Instruction
            </h1>
          </div>

          <div className="text-center mb-5 mt-3 mt-md-0">
            <h2 className="text-white py-2 px-5 rounded d-inline-block text-start tot-week-2-question-text">
              {step.challenge}
            </h2>
          </div>
        </QuestionBox>
      );
    }

    if (step.type === "checkbox") {
      return (
        <QuestionBox extraStyle="bg-custom-blue">
          <div className="px-3 px-md-5 py-4">
            <h2 className="text-blue fs-1 mb-4 fw-bold tot-question-text">
              {step.question}
            </h2>

            <div className="mt-4 ml-6">
              {step.options.map((option, index) => {
                const isChecked = selectedOptions.includes(option);
                return (
                  <div
                    key={index}
                    className="d-flex align-items-center gap-3 mb-3 p-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleOption(option)}
                  >
                    <img
                      src={isChecked ? checkedImage : uncheckedImage}
                      alt="checkbox"
                      style={{ width: 28, height: 28 }}
                    />
                    <label
                      className="fs-4 text-gray mb-0"
                      style={{ cursor: "pointer" }}
                    >
                      {option}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        </QuestionBox>
      );
    }

    return null;
  };

  return (
    <>
      {renderStep()}
      {errorMessage && (
        <div className="text-danger text-center mt-2 fw-bold">
          {errorMessage}
        </div>
      )}
      <StepIndicator totalSteps={pageData?.steps?.length || 0} />
      <div className="d-flex justify-content-center gap-96px mt-4 gap-4">
        <Button text="Prev" />
        <Button text="Next" customOnClick={saveUserInput} />
      </div>

      <TOTFeedbackModal show={showFeedback} onHide={handleNext}>
        <div className="text-center p-2">
          <p className="text-blue">{feedbackText}</p>
        </div>
      </TOTFeedbackModal>
    </>
  );
}

export default Page4;
