import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon } from "@iconify/react";
import QuestionBox from "../../../components/QuestionBox";
import DragAndDropFrame from "./components/DragAndDropFrame";
import DropdownFrame from "./components/DropdownFrame";
import Button from "../../../components/Button";
import StepIndicator from "../../../components/StepIndicator";
import "./page8.css";

import {
  selectPageData,
  selectCurrentStep,
  navigateNext,
} from "@/store/navigationSlice";
import TOTFeedbackModal from "../../../components/TOTFeedbackModal";

import {
  userAnswer,
  saveActivity,
} from "@/store/userAnswersReducer";
import { adminData } from "@/store/adminReducer";

const InternalStepIndicator = ({ totalSteps, currentStep }) => {
  return (
    <div
      className="d-flex justify-content-center mt-2"
      style={{ gap: "6px", flexWrap: "nowrap", overflowX: "auto" }}
    >
      {[...Array(totalSteps)].map((_, index) => (
        <div
          key={index}
          className={`${
            index + 2 <= currentStep ? "bg-step-active" : "bg-step"
          }`}
          style={{
            // flexBasis: "35px",
            width: "35px",
            height: "17px",
            borderRadius: "8px",
            cursor: index <= currentStep ? "pointer" : "default",
          }}
        />
      ))}
    </div>
  );
};

function Page8() {
  const dispatch = useDispatch();
  const pageData = useSelector(selectPageData);
  const currentStep = useSelector(selectCurrentStep);
  const totalSteps = pageData?.steps?.length || 0;
  const [dragDropImageLength, setDragDropImageLength] = useState(3);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [answers, setAnswers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [dndResetKey, setDndResetKey] = useState(0);

  const step = pageData?.steps[currentStep - 1];
  const userAnswers = useSelector(userAnswer);
  const adminDatas = useSelector(adminData);

  const [showFeedback, setShowFeedback] = useState(false);
  const handleCloseFeedback = () => {
    setShowFeedback(false);
    dispatch(navigateNext()); // Navigate after closing the modal
  };

  useEffect(() => {
    if (!userAnswers) return;

    const response = userAnswers.activities?.find(
      (item) => item.page === pageData.id,
    );

    setAnswers(Array.isArray(response?.answer) ? response.answer : []);
  }, [userAnswers]);

  const handleReset = () => {
    setErrorMessage("");
    if (step?.type === "imageDragAndDrop") {
      setDndResetKey((k) => k + 1);
      setCurrentImageIndex(0);
      setAnswers((prev) => prev.filter((a) => a.stepId !== 2));
    } else if (step?.type === "dropdownScenario") {
      setAnswers((prev) => prev.filter((a) => a.stepId !== step.stepId));
    }
  };

  const saveUserInput = () => {
    if (adminDatas.isAdmin) return true;
    if (currentStep === 1) return true;

    const stepData = answers.find((item) => item.stepId === currentStep);

    if (!stepData) {
      setErrorMessage("Oops! This step is required.");
      return false;
    }

    // Validation per step type
    if (step.type === "imageDragAndDrop") {
      const totalDropped =
        (stepData.value.green?.length || 0) +
        (stepData.value.red?.length || 0) +
        (stepData.value.orange?.length || 0);

      if (totalDropped !== step.images.length) {
        setErrorMessage("Please place all images in the buckets.");
        return false;
      }
    }

    if (step.type === "dropdownScenario") {
      if (!stepData.value) {
        setErrorMessage("Please select an option.");
        return false;
      }
    }

    setErrorMessage("");

    dispatch(
      saveActivity({
        page: pageData.id,
        answer: answers,
      }),
    );

    // Show feedback modal instead of navigating immediately
    if (step.type === "dropdownScenario") {
      setShowFeedback(true);
    } else {
      dispatch(navigateNext());
    }
    // return true;
  };

  const renderStep = () => {
    if (!step) return null;

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
              <h2 className="text-white py-2 px-5 rounded d-inline-block text-start tot-week-2-question-text">
                {step.text}
              </h2>
            </div>
          </QuestionBox>
        );

      case "imageDragAndDrop":
        return (
          <div className="mb-4">
            <DragAndDropFrame
              key={dndResetKey}
              info={{
                images: step.images,
                buckets: step.buckets,
                instruction: step.instruction,
              }}
              setErrorMessage={setErrorMessage}
              answers={answers}
              setAnswers={setAnswers}
              setCurrentImageIndex1={setCurrentImageIndex}
              setDragDropImageLength={setDragDropImageLength}
            />
          </div>
        );

      case "dropdownScenario":
        return (
          <DropdownFrame
            step={step}
            answers={answers}
            setAnswers={setAnswers}
            setErrorMessage={setErrorMessage}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      {renderStep()}

      {errorMessage && (
        <div className="text-danger text-center mt-3">{errorMessage}</div>
      )}

      <div className="d-flex flex-column align-items-center mt-4" style={{ gap: "6px" }}>
        {/* Dots row centred */}
        <div className="d-flex justify-content-center step-dots-row" style={{ gap: "4px", flexWrap: "nowrap", overflowX: "auto" }}>
          {[...Array(totalSteps)].map((_, i) =>
            i < currentStep ? (
              <div key={`step-${i}`} className="bg-step-active step-dot" style={{ borderRadius: "8px" }} />
            ) : null
          )}
          {currentStep >= 2 && [...Array(dragDropImageLength)].map((_, i) => {
            const isActive = currentStep > 2 ? true : i <= currentImageIndex;
            return (
              <div key={`img-${i}`} className={`${isActive ? "bg-step-active" : "bg-step"} step-dot`} style={{ borderRadius: "8px" }} />
            );
          })}
          {[...Array(totalSteps)].map((_, i) =>
            i >= currentStep ? (
              <div key={`step-future-${i}`} className="bg-step step-dot" style={{ borderRadius: "8px" }} />
            ) : null
          )}
        </div>

        {/* Reset — below the dot row */}
        {(step?.type === "imageDragAndDrop" || step?.type === "dropdownScenario") && (
          <div
            onClick={handleReset}
            className="d-flex align-items-center gap-1"
            style={{
              cursor: "pointer",
              color: "#6c757d",
              userSelect: "none",
            }}
          >
            <Icon icon="teenyicons:refresh-solid" width={18} />
            <span style={{ fontSize: "14px" }}>Reset</span>
          </div>
        )}
      </div>

      <div className="d-flex justify-content-center gap-4 mt-4">
        <Button text="Prev" />
        <Button text="Next" customOnClick={saveUserInput} />
      </div>

      <TOTFeedbackModal show={showFeedback} onHide={handleCloseFeedback}>
        <p className="text-blue mb-3">
          Many classrooms operate somewhere between integration and inclusion
        </p>
        <p className="text-blue">
          Over the next few weeks, you will learn strategies to help move your
          classroom closer to true inclusive practice.
        </p>
      </TOTFeedbackModal>
    </>
  );
}

export default Page8;
