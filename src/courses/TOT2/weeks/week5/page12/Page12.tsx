import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import QuestionBox from "../../../components/QuestionBox";
import Frame from "./components/Frame";
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

function WeekFivePage12() {
  const dispatch = useDispatch(); // Initialize dispatch
  const pageData = useSelector(selectPageData);
  const currentStep = useSelector(selectCurrentStep);
  const totalSteps = pageData?.steps?.length || 0;
  const [answers, setAnswers] = useState([]); // State to hold answers
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
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
    dispatch(navigateNext()); // Navigate after closing the modal
  };

  // console.log(userAnswers)

  useEffect(() => {
    if (!userAnswers) return;
    const response = userAnswers.activities?.find(
      (item) => item.page === pageData.id,
    );
    setAnswers(Array.isArray(response?.answer) ? response.answer : []);
  }, [userAnswers, pageData.id]);

  const saveUserInput = () => {
    if (adminDatas.isAdmin) return true;

    const stepData = answers.find((item) => item.stepId === currentStep);
    if (!stepData) {
      setErrorMessage("Oops! Please select an option.");
      return false;
    }

    const value = stepData.value;
    if (!value) {
      setErrorMessage("Please select an option!");
      return false;
    }

    setErrorMessage(""); // Clear error if input is valid

    const isCorrect = (value === step.correctOption);
    const correctOptionText = step.options.find(o => o.id === step.correctOption)?.text || "";

    setFeedbackInfo({
      isCorrect,
      feedback: step.feedback || "",
      correctOptionText
    });

    const activityData = {
      page: pageData.id,
      answer: answers,
    };
    dispatch(saveActivity(activityData)); // Dispatch the saveActivity action

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
                Take a moment to look at these two profiles. For each learner,
                consider the 'Challenge' they face, and then choose the specific
                'Supports' that will unlock their potential in your classroom.
              </h2>
              {/* <h2 className="text-white px-5 d-inline-block text-start tot-week-2-question-text">
              </h2> */}
            </div>
          </QuestionBox>
        );
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
      default:
        return <div>Unknown step type</div>;
    }
  };

  return (
    <>
      {renderStep()}
      {errorMessage && (
        <div className="text-danger">{errorMessage}</div>
      )}{" "}
      {/* Display error message */}
      <StepIndicator totalSteps={totalSteps} />
      <div className="d-flex justify-content-center gap-96px mt-4 gap-4">
        <Button text="Prev" />
        <Button text="Next" customOnClick={saveUserInput} />
      </div>
      <TOTFeedbackModal show={showFeedback} onHide={handleCloseFeedback}>
       <p className="text-blue mb-3">
          {feedbackInfo.isCorrect ? (
            "Correct!"
          ) : (
            `${feedbackInfo.correctOptionText} is the right answer!`
          )}
        </p>
        <p className="text-blue">
          {feedbackInfo.feedback}
        </p>
      </TOTFeedbackModal>
    </>
  );
}

export default WeekFivePage12;
