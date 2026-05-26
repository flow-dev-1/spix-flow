import React, { useState, useEffect } from "react";
import QuestionBox from "../../../../components/QuestionBox";
import BigTextBox from "../../../../components/BigTextBox";

function SonarModal({
  step,
  scenarioNumber,
  answers,
  setAnswers,
  onClose,
  setErrorMessage,
}) {
  const [localAnswer, setLocalAnswer] = useState("");

  useEffect(() => {
    // Initialize local answer from props
    const scenarioKey = `scenario_${scenarioNumber}`;
    const sonarAnswers = answers[scenarioKey]?.sonar || {};
    const existingAnswer = sonarAnswers[step.id] || "";
    setLocalAnswer(existingAnswer);
  }, [answers, scenarioNumber, step.id]);

  const handleInputChange = (e) => {
    setLocalAnswer(e.target.value);
  };

  const handleSubmit = () => {
    // Validate answer
    if (!localAnswer || localAnswer.trim() === "") {
      setErrorMessage("Please provide an answer before submitting.");
      return;
    }

    // Update global answers
    const scenarioKey = `scenario_${scenarioNumber}`;
    setAnswers((prev) => ({
      ...prev,
      [scenarioKey]: {
        ...prev[scenarioKey],
        sonar: {
          ...prev[scenarioKey]?.sonar,
          [step.id]: localAnswer,
        },
      },
    }));

    setErrorMessage("");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Close Button */}
        <button className="modal-close-btn mt-4" onClick={onClose}>
          ✕
        </button>

        {/* Modal Content */}
        <QuestionBox extraStyle="bg-custom-blue">
          <div className="p-3 p-md-4">
            {/* Question */}
            <div className="d-flex gap-3 flex-column flex-md-row flex-md-nowrap align-items-start mt-4">
              <div className="d-flex flex-column flex-grow-1 min-w-0 tot-question-text">
                <h2 className="text-gray fs-5 fs-md-1 mb-2 text-center">
                  <span className="text-blue fw-bold">Prompt: </span>
                  {step.question}
                </h2>
              </div>
            </div>

            {/* Input */}
            <BigTextBox handleChange={handleInputChange} value={localAnswer} />
          </div>
        </QuestionBox>

        {/* Submit Button */}
        <div className="d-flex justify-content-center gap-3 mt-4">
          <button
            className="btn fs-5 rounded w-200px h-40px d-flex align-items-center justify-content-center bg-button text-white border-0 hover-prev"
            onClick={handleSubmit}
            disabled={!localAnswer || localAnswer.trim() === ""}
          >
            Submit {">>>"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SonarModal;
