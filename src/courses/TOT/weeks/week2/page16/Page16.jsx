import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import QuestionBox from "../../../components/QuestionBox";
import BigTextBox from "../../../components/BigTextBox";
import Button from "../../../components/Button";
import {
  selectPageData,
  selectCurrentStep,
} from "@/store/navigationSlice";
import StepIndicator from "../../../components/StepIndicator";
import {
  userAnswer,
  saveActivity,
} from "@/store/userAnswersReducer";
import { adminData } from "@/store/adminReducer";
import ScenarioFrame from "./components/ScenarioFrame";
import RankingDragDrop from "./components/RankingDragDrop";

function WeekTwoPage12() {
  const dispatch = useDispatch();
  const pageData = useSelector(selectPageData);
  const currentStep = useSelector(selectCurrentStep);
  const totalSteps = pageData?.steps?.length || 0;
  const [answers, setAnswers] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const step = pageData?.steps[currentStep - 1];
  const userAnswers = useSelector(userAnswer);
  const adminDatas = useSelector(adminData);

  useEffect(() => {
    if (!userAnswers) return;
    const response = userAnswers.activities?.find(
      (item) => item.page === pageData.id
    );

    if (response?.answer) {
      setAnswers(response.answer);
    }
  }, [userAnswers, pageData?.id]);

  const saveUserInput = () => {
    // Skip validation for instruction and scenario display
    if (step?.type === "instruction" || step?.type === "scenario") {
      return true;
    }

    // Skip validation for admins
    if (adminDatas.isAdmin) return true;

    const stepKey = `step_${currentStep}`;

    // Validate drag and drop ranking
    if (step?.type === "dragAndDropRanking") {
      const stepData = answers[stepKey];

      if (!stepData || !stepData.rankings) {
        setErrorMessage("Please rank all responses before proceeding.");
        return false;
      }

      // Check if all 4 slots are filled
      const filledSlots = Object.keys(stepData.rankings).length;
      if (filledSlots !== 4) {
        setErrorMessage("Please place all 4 responses in the ranking slots.");
        return false;
      }
    }

    // Validate reflection questions
    if (step?.type === "reflection") {
      const stepData = answers[stepKey];

      if (!stepData?.answer || stepData.answer.trim() === "") {
        setErrorMessage("Please provide your answer before proceeding.");
        return false;
      }
    }

    setErrorMessage("");

    const activityData = {
      page: pageData.id,
      answer: answers,
    };
    dispatch(saveActivity(activityData));

    return true;
  };

  const handleReflectionChange = (value) => {
    setErrorMessage("");
    const stepKey = `step_${currentStep}`;
    setAnswers((prev) => ({
      ...prev,
      [stepKey]: {
        answer: value,
      },
    }));
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

      case "scenario":
        return (
          <ScenarioFrame
            data={{
              step: step.stepId,
              scenarioNumber: step.scenarioNumber,
              question: step.scenarioText,
            }}
          />
        );

      case "dragAndDropRanking":
        return (
          <RankingDragDrop
            step={step}
            currentStep={currentStep}
            answers={answers}
            setAnswers={setAnswers}
            setErrorMessage={setErrorMessage}
          />
        );

      case "reflection":
        const stepKey = `step_${currentStep}`;
        return (
          <QuestionBox extraStyle="bg-custom-blue">
            <div className="p-1 p-md-5">
              <div className="d-flex gap-3 flex-column flex-md-row flex-md-nowrap align-items-start mt-4">
                <h2 className="text-blue fs-1 mb-0 flex-shrink-0 tot-question-text">
                  Question:
                </h2>

                <div className="d-flex flex-column flex-grow-1 min-w-0 tot-question-text">
                  <h2 className="text-gray fs-1 mb-4">{step.question}</h2>
                </div>
              </div>
              <BigTextBox
                handleChange={(e) => handleReflectionChange(e.target.value)}
                value={answers[stepKey]?.answer || ""}
              />
            </div>
          </QuestionBox>
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
    </>
  );
}

export default WeekTwoPage12;
