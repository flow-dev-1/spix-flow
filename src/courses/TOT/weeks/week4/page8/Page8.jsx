import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon } from "@iconify/react";
import QuestionBox from "../../../components/QuestionBox";
import DragAndDropFrame from "./components/DranAndDropFrame";
import Button from "../../../components/Button";
import {
  selectPageData,
  navigateNext,
  selectCurrentStep,
} from "@/store/navigationSlice";
import TOTFeedbackModal from "../../../components/TOTFeedbackModal";
import {
  userAnswer,
  saveActivity,
} from "@/store/userAnswersReducer";
import { adminData } from "@/store/adminReducer";
import Frame from "./components/Frame";

function WeekFourPage4() {
  const dispatch = useDispatch(); // Initialize dispatch
  const pageData = useSelector(selectPageData);
  const currentStep = useSelector(selectCurrentStep);
  const totalSteps = pageData?.steps?.length || 0;
  const [answers, setAnswers] = useState([]); // State to hold answers
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const step = pageData?.steps[currentStep - 1];
  const userAnswers = useSelector(userAnswer);
  const adminDatas = useSelector(adminData);
  const [dragDropImageLength, setDragDropImageLength] = useState(4);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [dndResetKey, setDndResetKey] = useState(0);
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

  const saveUserInput = () => {
    if (adminDatas.isAdmin) return true;
    if (currentStep === 1) return true;

    const stepData = answers.find((item) => item.stepId === currentStep);

    if (currentStep === 3) {
      if (!stepData) {
        setErrorMessage("Oops! Please fill the input field.");
        return false;
      }
    } else {
      // Check total images dropped
      const totalDropped =
        (stepData.value.green?.length || 0) + (stepData.value.red?.length || 0);

      if (totalDropped !== dragDropImageLength) {
        setErrorMessage(
          `Please place all ${dragDropImageLength} images in the buckets.`,
        );
        return false;
      }
    }

    setErrorMessage(""); // Clear error if input is valid

    const activityData = {
      page: pageData.id,
      answer: answers,
    };
    dispatch(saveActivity(activityData)); // Dispatch the saveActivity action

    if (currentStep !== 3) {
      return true;
    }

    setShowFeedback(true);
    return false;
  };

  const handleReset = () => {
    if (step?.type !== "imageDragAndDrop") return;
    setErrorMessage("");
    setDndResetKey((key) => key + 1);
    setCurrentImageIndex(0);
    setAnswers((prev) => prev.filter((answer) => answer.stepId !== 2));
  };

  // console.log(answers, "Answers")

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
              <h2 className="text-white py-2 px-5 rounded d-inline-block text-start tot-week-2-question-text">
                Drag the statements that show a fixed mindset into the fixed
                mindset box and the statements that show a growth mindset to the
                appropriate box. <br /> <br />
                This activity will help you practice how to identify fixed and
                growth mindset thinking patterns in everyday scenarios.
              </h2>
            </div>
          </QuestionBox>
        );
      case "imageDragAndDrop":
        return (
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
        );
      case "question":
        return (
          <Frame
            data={{
              step: step.stepId,
              question: step.question,
            }}
            setErrorMessage={setErrorMessage}
            answers={answers}
            setAnswers={setAnswers}
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
        <div className="text-danger">{errorMessage}</div>
      )}{" "}
      {/* Display error message */}
      <div className="d-flex flex-column align-items-center mt-4" style={{ gap: "6px" }}>
        <div className="d-flex justify-content-center step-dots-row">
          {[...Array(totalSteps - 1)].map((_, index) =>
            index < currentStep ? (
              <div
                key={`step-${index}`}
                className="bg-step-active step-dot"
                style={{ borderRadius: "8px" }}
              />
            ) : null,
          )}
          {currentStep >= 2 &&
            [...Array(dragDropImageLength + 1)].map((_, index) => {
              const isActive = currentStep > 2 || index <= currentImageIndex;
              return (
                <div
                  key={`img-${index}`}
                  className={`${isActive ? "bg-step-active" : "bg-step"} step-dot`}
                  style={{ borderRadius: "8px" }}
                />
              );
            })}
          {[...Array(totalSteps - 1)].map((_, index) =>
            index >= currentStep ? (
              <div
                key={`step-future-${index}`}
                className="bg-step step-dot"
                style={{ borderRadius: "8px" }}
              />
            ) : null,
          )}
        </div>
        {step?.type === "imageDragAndDrop" && (
          <div
            onClick={handleReset}
            className="d-flex align-items-center gap-1"
            style={{ cursor: "pointer", color: "#6c757d", userSelect: "none" }}
          >
            <Icon icon="teenyicons:refresh-solid" width={18} />
            <span style={{ fontSize: "14px" }}>Reset</span>
          </div>
        )}
      </div>
      <div className="d-flex justify-content-center gap-96px mt-3 gap-4">
        <Button text="Prev" />
        <Button text="Next" customOnClick={saveUserInput} />
      </div>
      <TOTFeedbackModal show={showFeedback} onHide={handleCloseFeedback}>
        <p className="text-blue">
          Recognizing the difference between fixed and growth mindset thinking
          helps educators guide students toward perseverance and improvement.
        </p>
      </TOTFeedbackModal>
    </>
  );
}

export default WeekFourPage4;
