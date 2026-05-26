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
import StepIndicator from "../../../components/StepIndicator";
import {
  userAnswer,
  saveActivity,
} from "@/store/userAnswersReducer";
import { adminData } from "@/store/adminReducer";

const InternalStepIndicator = ({ totalSteps, currentStep }) => {
  return (
    <div className="d-flex justify-content-center mt-4" style={{ gap: "10px" }}>
      {[...Array(totalSteps)].map((_, index) => (
        <div
          key={index}
          className={`${
            index + 2 <= currentStep ? "bg-step-active" : "bg-step"
          }`}
          style={{
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

function Page10() {
  const dispatch = useDispatch();
  const pageData = useSelector(selectPageData);
  const currentStep = useSelector(selectCurrentStep);
  const totalSteps = pageData?.steps?.length || 0;
  const [answers, setAnswers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
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
      setErrorMessage("Oops! All Images must be placed in the buckets.");
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

    setErrorMessage("");

    const activityData = {
      page: pageData.id,
      answer: answers,
    };
    dispatch(saveActivity(activityData));

    // Show feedback modal instead of navigating immediately
    setShowFeedback(true);
    // return true;
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
              <h2 className="text-white py-2 px-5 rounded d-inline-block text-start tot-week-2-question-text">
                You will be shown some classroom scenarios with two <br />
                decisions and two boxes labelled{" "}
                <span className="fw-bold">"SEL"</span> and{" "}
                <span className="fw-bold">"Not SEL"</span>.
              </h2>
              <br />
              <br />
              <h2 className="text-white px-5 d-inline-block text-start tot-week-2-question-text">
                Drag and drop your decisions in the appropriate decision box.
              </h2>
            </div>
          </QuestionBox>
        );
      case "imageDragAndDrop":
        return (
          <DragAndDropFrame
            info={{
              imagePairs: step.imagePairs,
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
        <div className="text-danger text-center mt-2 fw-bold">
          {errorMessage}
        </div>
      )}
      <div className="d-flex justify-content-center align-items-center gap-2">
        <StepIndicator totalSteps={totalSteps} />
        <InternalStepIndicator
          totalSteps={dragDropImageLength}
          currentStep={currentImageIndex + 1}
        />
      </div>

      <div className="d-flex justify-content-center gap-96px mt-3 gap-4">
        <Button text="Prev" />
        <Button text="Next" customOnClick={saveUserInput} />
      </div>

      <TOTFeedbackModal show={showFeedback} onHide={handleCloseFeedback}>
        <p className="text-blue mb-3">
          SEL responses focus on understanding behaviour, supporting emotions,
          and guiding growth.
        </p>
        <p className="text-blue">
          This means that your responses in the classrooms should aim to achieve
          any of this. If it doesn’t, then it simply isn’t SEL.
        </p>
      </TOTFeedbackModal>
    </>
  );
}

export default Page10;
