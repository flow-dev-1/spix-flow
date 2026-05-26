import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../components/Button";
import {
  selectPageData,
  selectCurrentStep,
  navigateNext,
} from "@/store/navigationSlice";
import TOTFeedbackModal from "../../../components/TOTFeedbackModal";
import { adminData } from "@/store/adminReducer";
import {
  userAnswer,
  saveActivity,
} from "@/store/userAnswersReducer";
import Frame from "./components/Frame";
import StepIndicator from "../../../components/StepIndicator";

function Page4() {
  const dispatch = useDispatch(); // Initialize dispatch
  const pageData = useSelector(selectPageData);
  const currentStep = useSelector(selectCurrentStep);
  const totalSteps = pageData?.steps?.length || 0;
  const [answers, setAnswers] = useState([]); // State to hold answers
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackInfo, setFeedbackInfo] = useState({
    feedback: "",
  });
  const handleCloseFeedback = () => {
    setShowFeedback(false);
    dispatch(navigateNext()); // Navigate after closing the modal
  };

  const step = pageData?.steps[currentStep - 1]; // Get the current step data
  const userAnswers = useSelector(userAnswer);
  const adminDatas = useSelector(adminData);

  // console.log(pageData)

  useEffect(() => {
    if (!userAnswers) return;
    const response = userAnswers.activities?.find(
      (item) => item.page === pageData.id,
    );

    setAnswers(Array.isArray(response?.answer) ? response.answer : []);
  }, [userAnswers]);

  const saveUserInput = () => {
    if (adminDatas.isAdmin) return true;

    const stepData = answers.find((item) => item.stepId === currentStep);

    if (!stepData || !stepData.value || stepData.value.trim() === "") {
      setErrorMessage("Oops! Please enter a valid input!");
      return false;
    }
    setErrorMessage(""); // Clear error if input is valid

    const activityData = {
      page: pageData.id,
      answer: answers,
    };
    dispatch(saveActivity(activityData)); // Dispatch the saveActivity action

    if (currentStep === 1) {
      setFeedbackInfo({ feedback: "Thank you for your response." });
    } else {
      setFeedbackInfo({
        feedback: "Thank you for your response. Now let’s continue our course.",
      });
    }

    setShowFeedback(true);
    return false;
  };

  // console.log(answers, "Answers")

  const renderStep = () => {
    // const step = pageData?.steps[currentStep - 1];
    // console.log(currentStep, step, "step")
    if (!step) return <div>Invalid Step</div>;

    switch (step.type) {
      case "scenario":
        return (
          <Frame
            data={{
              step: step.stepId,
              question: step.question,
              questions: step.questions.map((q) => ({
                [q.type]: q.question,
              })),
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
      {errorMessage && <div className="text-danger">{errorMessage}</div>}{" "}
      {/* Display error message */}
      <StepIndicator totalSteps={totalSteps} />
      <div className="d-flex justify-content-center gap-96px gap-4 mt-4 ">
        <Button text="Prev" />
        <Button text="Next" customOnClick={saveUserInput} />
      </div>
      <TOTFeedbackModal show={showFeedback} onHide={handleCloseFeedback}>
        <p className="text-blue">{feedbackInfo.feedback}</p>
      </TOTFeedbackModal>
    </>
  );
}

export default Page4;
