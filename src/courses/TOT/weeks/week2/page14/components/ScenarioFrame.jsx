import React from "react";
import QuestionBox from "../../../../components/QuestionBox";
import BigTextBox from "../../../../components/BigTextBox";

function ScenarioFrame({ scenario, answers, setAnswers, setErrorMessage }) {
  const { scenarioNumber, scenarioTitle, scenarioType, mainInputQuestion } =
    scenario;

  const handleInputChange = (value) => {
    setErrorMessage("");

    setAnswers((prev) => ({
      ...prev,
      [`scenario_${scenarioNumber}`]: {
        ...prev[`scenario_${scenarioNumber}`],
        scenarioText: value,
      },
    }));
  };

  const isWithInput = scenarioType === "withInput";
  const scenarioKey = `scenario_${scenarioNumber}`;
  const currentValue = answers[scenarioKey]?.scenarioText || "";

  return (
    <QuestionBox extraStyle="bg-custom-blue">
      <div className="p-1 p-md-5">
        <div className="text-center mb-5 mt-4 mt-md-0">
          <h2 className="text-white bg-blue py-2 px-4 fs-2 font-bold rounded-3 d-inline display-4 text-center tot-week-2-question-text">
            Scenario {scenarioNumber}
          </h2>
        </div>

        <div className="d-flex gap-2 flex-column flex-md-row mb-4">
          <h2 className="text-gray fs-1 fs-md-1 tot-week-2-question-text text-center fw-bold">
            {scenarioTitle}
          </h2>
        </div>

        {isWithInput && (
          <>
            {mainInputQuestion && (
              <div className="mb-3">
                <h3 className="text-white fs-4 text-center tot-week-2-question-text">
                  {mainInputQuestion}
                </h3>
              </div>
            )}
            <BigTextBox
              value={currentValue}
              handleChange={(e) => handleInputChange(e.target.value)}
            />
          </>
        )}
      </div>
    </QuestionBox>
  );
}

export default ScenarioFrame;
