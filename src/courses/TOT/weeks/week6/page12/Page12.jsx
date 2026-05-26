import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import QuestionBox from "../../../components/QuestionBox";
import Button from "../../../components/Button";
import {
  selectPageData,
  navigateNext,
  selectCurrentStep,
} from "@/store/navigationSlice";
import TOTFeedbackModal from "../../../components/TOTFeedbackModal";

import StepIndicator from "../../../components/StepIndicator";
import {
  userAnswer,
  saveActivity,
} from "@/store/userAnswersReducer";
import { adminData } from "@/store/adminReducer";
import OnboardingFrame from "./components/OnboardingFrame";
import SectionFrame from "./components/SectionFrame";

function WeekSixPage10() {
  const dispatch = useDispatch();
  const pageData = useSelector(selectPageData);
  const currentStep = useSelector(selectCurrentStep);
  const totalSteps = pageData?.steps?.length || 0;
  const [answers, setAnswers] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const handleCloseFeedback = () => {
    setShowFeedback(false);
    dispatch(navigateNext()); // Navigate after closing the modal
  };

  const step = pageData?.steps[currentStep - 1];
  const userAnswers = useSelector(userAnswer);
  const adminDatas = useSelector(adminData);

  useEffect(() => {
    if (!userAnswers) return;
    const response = userAnswers.activities?.find(
      (item) => item.page === pageData.id,
    );

    if (response?.answer) {
      setAnswers(response.answer);
    }
  }, [userAnswers, pageData?.id]);

  const saveUserInput = () => {
    // Skip validation for instruction and onboarding
    if (step?.type === "instruction" || step?.type === "onboarding") {
      return true;
    }

    // Skip validation for admins
    if (adminDatas.isAdmin) return true;

    const stepKey = `step_${currentStep}`;
    const stepData = answers[stepKey];

    // Validate based on input type
    if (step?.inputType === "bigTextBox") {
      if (!stepData?.mainInput || stepData.mainInput.trim() === "") {
        setErrorMessage("Please provide your answer before proceeding.");
        return false;
      }
    }

    if (step?.inputType === "checkboxWithOther") {
      const hasSelection =
        stepData?.checkboxes && Object.keys(stepData.checkboxes).length > 0;

      if (!hasSelection) {
        setErrorMessage("Please select at least one option.");
        return false;
      }

      // Validate additional fields
      if (step.additionalFields) {
        for (let field of step.additionalFields) {
          const fieldKey = field.label.toLowerCase().replace(/[^a-z0-9]/g, "_");
          if (!stepData[fieldKey] || stepData[fieldKey].trim() === "") {
            setErrorMessage(`Please fill out: ${field.label}`);
            return false;
          }
        }
      }
    }

    if (step?.inputType === "twoSmallInputs") {
      if (!stepData?.input1 || stepData.input1.trim() === "") {
        setErrorMessage("Please fill out the first action.");
        return false;
      }
      if (!stepData?.input2 || stepData.input2.trim() === "") {
        setErrorMessage("Please fill out the second action.");
        return false;
      }

      // Validate collaboration field
      if (step.additionalFields && step.additionalFields.length > 0) {
        if (!stepData?.collaboration || stepData.collaboration.trim() === "") {
          setErrorMessage("Please answer the collaboration question.");
          return false;
        }
      }
    }

    setErrorMessage("");

    const activityData = {
      page: pageData.id,
      answer: answers,
    };
    dispatch(saveActivity(activityData));

    if (currentStep !== 9) {
      return true;
    }

    setShowFeedback(true);
    return false;
  };

  const renderStep = () => {
    if (!step) return <div>Invalid Step</div>;

    switch (step.type) {
      case "instruction":
        return (
          <QuestionBox extraStyle="bg-blue">
            <div className="text-center mb-5 mt-5 mt-md-4">
              <h1 className="text-mute bg-white py-2 px-5 rounded d-inline week-2-question-text tot-text-instruction">
                Instruction
              </h1>
            </div>

            <div className="text-center mb-5 mt-3 mt-md-0">
              {step.instructions.map((instruction, index) => (
                <React.Fragment key={index}>
                  <h2 className="text-white py-2 px-5 rounded d-inline-block text-start tot-week-2-question-text">
                    {instruction}
                  </h2>
                  {index < step.instructions.length - 1 && (
                    <>
                      <br />
                      <br />
                      <br />
                    </>
                  )}
                </React.Fragment>
              ))}
            </div>
          </QuestionBox>
        );

      case "onboarding":
        return <OnboardingFrame step={step} />;

      case "section":
        return (
          <SectionFrame
            step={step}
            currentStep={currentStep}
            answers={answers}
            setAnswers={setAnswers}
            setErrorMessage={setErrorMessage}
          />
        );

      default:
        return <div>Unknown step type</div>;
    }
  };

  return (
    <>
      {renderStep()}
      {currentStep !== 1 && errorMessage && (
        <div className="text-danger text-center mt-3 fw-bold fs-5">
          {errorMessage}
        </div>
      )}
      <StepIndicator totalSteps={totalSteps} />
      <div className="d-flex justify-content-center gap-96px mt-4 gap-4">
        <Button text="Prev" />
        <Button text="Next" customOnClick={saveUserInput} />
      </div>
      <TOTFeedbackModal show={showFeedback} onHide={handleCloseFeedback}>
        <p className="text-blue">
          {" "}
          Your implementation plan is your personal roadmap for bringing Social
          and Emotional Learning and Positive Psychology into your classroom in
          a consistent and meaningful way.
        </p>
      </TOTFeedbackModal>
    </>
  );
}

export default WeekSixPage10;
