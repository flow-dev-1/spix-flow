import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import QuestionBox from "../../../components/QuestionBox";
import DragAndDropFrame from "./components/DranAndDropFrame";
import Button from "../../../components/Button";

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

function Page6() {
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

    if (!stepData) {
      setErrorMessage("Oops! All Images must be placed in the buckects.");
      return false;
    }

    // Check total images dropped
    const totalDropped =
      (stepData.value.green?.length || 0) + (stepData.value.red?.length || 0);

    if (totalDropped !== dragDropImageLength) {
      setErrorMessage(
        `Please place all ${dragDropImageLength} images in the buckets.`,
      );
      return false;
    }

    setErrorMessage(""); // Clear error if input is valid

    const activityData = {
      page: pageData.id,
      answer: answers,
    };
    dispatch(saveActivity(activityData)); // Dispatch the saveActivity action

    // Show feedback modal instead of navigating immediately
    setShowFeedback(true);
    // return true;
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
                A number of scenarios would be shown and two boxes of <br />
                <span className="fw-bold">“Yes”</span> and{" "}
                <span className="fw-bold">“No”</span>.
              </h2>
              <br />
              <br />
              <h2 className="text-white d-inline-block text-start tot-week-2-question-text">
                Drag and drop each scenario into the{" "}
                <span className="fw-bold">Yes Box</span> if you have <br />
                experienced it or <span className="fw-bold">No Box</span> if you
                have not experienced it.
              </h2>
            </div>
          </QuestionBox>
        );
      case "imageDragAndDrop":
        return (
          <DragAndDropFrame
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
      <div className="d-flex justify-content-center mt-4 step-dots-row">
        {[...Array(totalSteps)].map((_, index) =>
          index < currentStep ? (
            <div
              key={`step-${index}`}
              className="bg-step-active step-dot"
              style={{ borderRadius: "8px" }}
            />
          ) : null,
        )}
        {currentStep >= 2 &&
          [...Array(dragDropImageLength)].map((_, index) => {
            const isActive = currentStep > 2 || index <= currentImageIndex;
            return (
              <div
                key={`img-${index}`}
                className={`${isActive ? "bg-step-active" : "bg-step"} step-dot`}
                style={{ borderRadius: "8px" }}
              />
            );
          })}
        {[...Array(totalSteps)].map((_, index) =>
          index >= currentStep ? (
            <div
              key={`step-future-${index}`}
              className="bg-step step-dot"
              style={{ borderRadius: "8px" }}
            />
          ) : null,
        )}
      </div>
      <div className="d-flex justify-content-center gap-96px mt-3 gap-4">
        <Button text="Prev" />
        <Button text="Next" customOnClick={saveUserInput} />
      </div>
      <TOTFeedbackModal show={showFeedback} onHide={handleCloseFeedback}>
        <p className="text-blue mb-3">Thank you for sharing!</p>
        <p className="text-blue">
          If you responded “Yes” to several of these statements, you are not
          alone. Teaching involves emotional challenges, and this is exactly
          where Social-Emotional Learning (SEL) can help.
        </p>
      </TOTFeedbackModal>
    </>
  );
}

export default Page6;
