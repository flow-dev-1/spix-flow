import React, { useState } from "react";
import QuestionBox from "../../../../components/QuestionBox";
import SonarModal from "./SonarModal";
import "./SonarStaircase.css";
import { getAssetUrl } from "../../../../assetUrls";

function SonarStaircase({ scenario, answers, setAnswers, setErrorMessage }) {
  const [selectedStep, setSelectedStep] = useState(null);
  const { scenarioNumber, sonarSteps } = scenario;

  const handleStepClick = (step) => {
    // Check if previous steps are completed
    const previousIncomplete = sonarSteps.some(
      (s) => s.id < step.id && !isStepCompleted(s.id)
    );

    if (previousIncomplete) {
      const lastIncomplete = Math.min(
        ...sonarSteps.filter((s) => !isStepCompleted(s.id)).map((s) => s.id)
      );
      const requiredStep = sonarSteps.find((s) => s.id === lastIncomplete);
      setErrorMessage(`Please complete "${requiredStep.stepName}" first.`);
      return;
    }

    setErrorMessage("");
    setSelectedStep(step);
  };

  const handleCloseModal = () => {
    setSelectedStep(null);
  };

  const isStepCompleted = (stepId) => {
    const scenarioKey = `scenario_${scenarioNumber}`;
    const sonarAnswers = answers[scenarioKey]?.sonar || {};
    const answer = sonarAnswers[stepId];
    return answer && answer.trim() !== "";
  };
  const imagePath = getAssetUrl("tot-images/week2/page10/trophy.png");

  return (
    <>
      <QuestionBox extraStyle="bg-custom-blue">
        <div className="sonar-container p-1 p-md-5">
          {/* Trophy Image */}
          <div className="d-flex justify-content-end mb-4">
            <img src={imagePath} alt="" />
          </div>

          {/* Staircase */}
          <div className="sonar-staircase">
            {[...sonarSteps].reverse().map((step, index) => (
              <div
                key={step.id}
                className="sonar-step-wrapper"
                style={{
                  width: step.width,
                  marginLeft: "auto",
                }}
                onClick={() => handleStepClick(step)}
              >
                <div
                  className={`sonar-step d-flex  ${
                    isStepCompleted(step.id) ? "completed" : ""
                  }`}
                  style={{
                    // backgroundColor: step.color,
                    cursor: "pointer",
                  }}
                >
                  <div
                    className="sonar-step-name fw-bold text-black px-3 py-3"
                    style={{
                      backgroundColor: step.stepBgColor,
                      cursor: "pointer",
                    }}
                  >
                    {step.id}. {step.stepName}
                  </div>
                  <div
                    className="sonar-step-description text-white px-1 py-3"
                    style={{
                      backgroundColor: step.desBgColor,
                      cursor: "pointer",
                    }}
                  >
                    {step.stepDescription}{" "}
                    <span className="">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15.042 21.672L13.684 16.6M13.684 16.6L11.174 18.825L11.743 9.355L16.97 17.272L13.684 16.6ZM12 2.25V4.5M17.834 4.666L16.243 6.257M20.25 10.5H18M7.757 14.743L6.167 16.333M6 10.5H3.75M7.757 6.257L6.167 4.667"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>

                  {/* <div className="sonar-step-content">
                    <div className="sonar-step-text"></div>
                  </div> */}

                  {isStepCompleted(step.id) && (
                    <span className="completion-check">✓</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </QuestionBox>

      {/* Modal */}
      {selectedStep && (
        <SonarModal
          step={selectedStep}
          scenarioNumber={scenarioNumber}
          answers={answers}
          setAnswers={setAnswers}
          onClose={handleCloseModal}
          setErrorMessage={setErrorMessage}
        />
      )}
    </>
  );
}

export default SonarStaircase;
