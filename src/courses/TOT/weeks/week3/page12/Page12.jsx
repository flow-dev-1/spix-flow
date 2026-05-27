import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import QuestionBox from "../../../components/QuestionBox";
import BigTextBox from "../../../components/BigTextBox";
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
import Frame from "./components/Frame";
import ScenarioFrame from "./components/ScenarioFrame";
import "./page12.css";

function WeekThreePage12() {
  const dispatch = useDispatch(); // Initialize dispatch
  const pageData = useSelector(selectPageData);
  const currentStep = useSelector(selectCurrentStep);
  const totalSteps = pageData?.steps?.length || 0;
  const [answers, setAnswers] = useState([]); // State to hold answers
  const [showFeedback, setShowFeedback] = useState(false);
  const handleCloseFeedback = () => {
    setShowFeedback(false);
    dispatch(navigateNext()); // Navigate after closing the modal
  };
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const step = pageData?.steps[currentStep - 1];
  const userAnswers = useSelector(userAnswer);
  const adminDatas = useSelector(adminData);

  useEffect(() => {
    if (!userAnswers) return;
    const response = userAnswers.activities?.find(
      (item) => item.page === pageData.id,
    );

    setAnswers(Array.isArray(response?.answer) ? response.answer : []);
  }, [userAnswers]);

  const saveUserInput = () => {
    if (currentStep === 1 || currentStep === 2 || currentStep === 4)
      return true;
    if (adminDatas.isAdmin) return true;

    const stepData = answers.find((item) => item.stepId === currentStep);
    if (!stepData) {
      setErrorMessage("Oops! All inputs must be filled out.");
      return false;
    }

    const reflectValue = stepData.reflect || ""; // Access reflection value
    const explainValue = stepData.explain || ""; // Access explanation value
    const suggestionValue = stepData.suggestion || ""; // Access suggestion value

    const values = [reflectValue, explainValue, suggestionValue]; // Collect the values
    if (values.length < 3 || values.some((v) => v.trim() === "")) {
      // Check if any value is empty
      setErrorMessage("At least 3 values are required!");
      return false;
    }

    const emptyInputs = values.filter((value) => value.trim() === "");
    if (emptyInputs.length > 0) {
      setErrorMessage(
        `Please fill out all inputs. ${emptyInputs.length} input(s) are missing.`,
      );
      return false;
    }

    setErrorMessage(""); // Clear error if input is valid

    const activityData = {
      page: pageData.id,
      answer: answers,
    };
    dispatch(saveActivity(activityData)); // Dispatch the saveActivity action

    if (currentStep !== 5) {
      return true;
    }

    setShowFeedback(true);
    return false;
  };

  const handleInputChange = (e) => {
    setErrorMessage("");
    setAnswers(e.target.value);
  };

  const renderStep = () => {
    if (!step) return <div>Invalid Step</div>;

    // console.log(step);

    switch (step.type) {
      case "instruction":
        return (
          <QuestionBox extraStyle="bg-blue">
            <div className="text-center mb-5 mt-5 mt-md-4 tot-week3-page12-instruction-heading">
              <h1 className="text-mute bg-white py-2 px-5 rounded d-inline week-2-question-text tot-text-instruction">
                Instruction
              </h1>
            </div>

            <div className="text-center mb-5 mt-3 mt-md-0 tot-week3-page12-instruction-body">
              <h2 className="text-white py-2 px-5 rounded d-inline-block text-start tot-week-2-question-text">
                Read the following scenario and write a response that encourages
                reflection (what was happening for you when you were talking out
                of turn?), responsibility (when you talk out of turn, it
                disrupts everyone’s learning), and repairing (what can we do to
                ensure everyone has a chance to speak during the lesson?) the
                relationship with the student. praise statement that reinforces
                this behavior. <br /> <br />
                Think about how your response can guide the student toward
                understanding the impact of their actions, taking
                responsibility, and making amends.
              </h2>
            </div>
          </QuestionBox>
        );
      case "question":
        return (
          <Frame
            data={{
              step: step.stepId,
              // question: step.questions[0].question,
              questions: step.questions,
            }}
            setErrorMessage={setErrorMessage}
            answers={answers}
            setAnswers={setAnswers}
            type={step.type}
          />
        );
      case "scenario":
        return (
          <ScenarioFrame
            data={{
              step: step.stepId,
              question: step.questions[0].question,
              questions: step.questions.map((q) => ({
                [q.type]: q.question,
              })),
            }}
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
      <StepIndicator totalSteps={totalSteps} />
      <div className="d-flex justify-content-center gap-96px mt-4 gap-4">
        <Button text="Prev" />
        <Button text="Next" customOnClick={saveUserInput} />
      </div>
      <TOTFeedbackModal show={showFeedback} onHide={handleCloseFeedback}>
        <p className="text-blue">
          Restorative responses help students reflect, repair harm, and rebuild
          trust in the classroom community.
        </p>
      </TOTFeedbackModal>
    </>
  );
}

export default WeekThreePage12;
