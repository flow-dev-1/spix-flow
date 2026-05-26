import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import QuestionBox from "../../../components/QuestionBox";
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
import ScenarioFrame from "./components/ScenarioFrame";
import SonarStaircase from "./components/SonarStaircase";

function Page10() {
  const dispatch = useDispatch();
  const pageData = useSelector(selectPageData);
  const currentStep = useSelector(selectCurrentStep);
  const [answers, setAnswers] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const userAnswers = useSelector(userAnswer);
  const adminDatas = useSelector(adminData);
  const [showFeedback, setShowFeedback] = useState(false);
  const handleCloseFeedback = () => {
    setShowFeedback(false);
    dispatch(navigateNext()); // Navigate after closing the modal
  };

  // Calculate total steps: 1 instruction + scenarios (each has scenario page + sonar page)
  const totalSteps = pageData?.steps
    ? 1 + (pageData.steps.length - 1) * 2 // -1 for instruction, *2 for scenario + sonar
    : 0;

  useEffect(() => {
    if (!userAnswers) return;
    const response = userAnswers.activities?.find(
      (item) => item.page === pageData.id,
    );

    if (response?.answer) {
      setAnswers(response.answer);
    }
  }, [userAnswers, pageData?.id]);

  // Helper to determine current view
  const getCurrentStepInfo = () => {
    if (currentStep === 1) {
      return { type: "instruction" };
    }

    const adjustedStep = currentStep - 2; // -1 for instruction, -1 for 0-indexing
    const scenarioIndex = Math.floor(adjustedStep / 2);
    const isScenarioPage = adjustedStep % 2 === 0;

    const scenarios =
      pageData?.steps.filter((s) => s.type === "scenario") || [];

    if (scenarioIndex >= scenarios.length) {
      return { type: "invalid" };
    }

    return {
      type: isScenarioPage ? "scenario" : "sonar",
      scenario: scenarios[scenarioIndex],
      scenarioNumber: scenarios[scenarioIndex].scenarioNumber,
    };
  };

  const saveUserInput = () => {
    const stepInfo = getCurrentStepInfo();

    // Skip validation for instruction
    if (stepInfo.type === "instruction") {
      return true;
    }

    // Skip validation for admins
    if (adminDatas.isAdmin) return true;

    // For scenario page with input
    if (stepInfo.type === "scenario") {
      if (stepInfo.scenario?.scenarioType === "withInput") {
        const scenarioAnswer = answers[`scenario_${stepInfo.scenarioNumber}`];

        if (!scenarioAnswer) {
          setErrorMessage("Please describe your scenario before proceeding.");
          return false;
        }
      }
      setErrorMessage("");
      return true;
    }

    // For sonar staircase - check all steps are completed
    if (stepInfo.type === "sonar") {
      const sonarSteps = stepInfo.scenario?.sonarSteps || [];
      const scenarioKey = `scenario_${stepInfo.scenarioNumber}`;
      const sonarAnswers = answers[scenarioKey]?.sonar || {};

      const allCompleted = sonarSteps.every((step) => {
        const answer = sonarAnswers[step.id];
        return answer && answer.trim() !== "";
      });

      if (!allCompleted) {
        setErrorMessage("Please complete all SONAR steps before proceeding.");
        return false;
      }
    }

    setErrorMessage("");

    const activityData = {
      page: pageData.id,
      answer: answers,
    };
    dispatch(saveActivity(activityData));

    if (currentStep !== 7) {
      return true;
    }

    setShowFeedback(true);
    return false;
  };

  const renderStep = () => {
    const stepInfo = getCurrentStepInfo();

    if (stepInfo.type === "invalid") {
      return <div>Invalid Step</div>;
    }

    switch (stepInfo.type) {
      case "instruction":
        return (
          <QuestionBox extraStyle="bg-blue">
            <div className="text-center mb-5 mt-5 mt-md-4">
              <h1 className="text-mute bg-white py-2 px-5 rounded d-inline week-2-question-text tot-text-instruction mt-5">
                Instruction
              </h1>
            </div>

            <div className="mb-5 mt-3 mt-md-0">
              <h2 className="text-white py-2 px-5 rounded text-start tot-week-2-question-text">
                Welcome to the <span className="fw-bold">SONAR</span> staircase.
              </h2>
              <h2 className="text-white py-2 px-5 rounded text-start tot-week-2-question-text">
                You will be presented with a 5 step staircase labeled with{" "}
                <br />
                the words{" "}
                <span className="fw-bold">STOP, OBSERVE, NAME, ASK </span> and
                <span className="fw-bold"> REGULATE.</span>
              </h2>
              <h2 className="text-white py-2 px-5 rounded text-start tot-week-2-question-text">
                You will also be shown 3 scenarios. For each stressful <br />
                classroom scenario, use the{" "}
                <span className="fw-bold">SONAR</span> pathway to walk <br />
                through your response. Reflect on each step by answering <br />
                the prompts below.
              </h2>
            </div>
          </QuestionBox>
        );

      case "scenario":
        return (
          <ScenarioFrame
            scenario={stepInfo.scenario}
            answers={answers}
            setAnswers={setAnswers}
            setErrorMessage={setErrorMessage}
          />
        );

      case "sonar":
        return (
          <SonarStaircase
            scenario={stepInfo.scenario}
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
          Practicing emotional regulation helps build awareness and improves how
          teachers respond during challenging classroom moments.
        </p>
      </TOTFeedbackModal>
    </>
  );
}

export default Page10;
