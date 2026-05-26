import React from "react";
import QuestionBox from "../../../../components/QuestionBox";
import BigTextBox from "../../../../components/BigTextBox";
import CheckboxInput from "./CheckboxInput";
import TwoSmallInputs from "./TwoSmallInputs";

function SectionFrame({
  step,
  currentStep,
  answers,
  setAnswers,
  setErrorMessage,
}) {
  const stepKey = `step_${currentStep}`;
  const stepData = answers[stepKey] || {};

  const handleMainInputChange = (value) => {
    setErrorMessage("");
    setAnswers((prev) => ({
      ...prev,
      [stepKey]: {
        ...prev[stepKey],
        mainInput: value,
      },
    }));
  };

  const handleCheckboxChange = (optionId, checked) => {
    setErrorMessage("");
    setAnswers((prev) => {
      const currentCheckboxes = prev[stepKey]?.checkboxes || {};
      const updatedCheckboxes = { ...currentCheckboxes };

      if (checked) {
        updatedCheckboxes[optionId] = true;
      } else {
        delete updatedCheckboxes[optionId];
      }

      return {
        ...prev,
        [stepKey]: {
          ...prev[stepKey],
          checkboxes: updatedCheckboxes,
        },
      };
    });
  };

  const handleAdditionalFieldChange = (fieldLabel, value) => {
    setErrorMessage("");
    const fieldKey = fieldLabel.toLowerCase().replace(/[^a-z0-9]/g, "_");
    setAnswers((prev) => ({
      ...prev,
      [stepKey]: {
        ...prev[stepKey],
        [fieldKey]: value,
      },
    }));
  };

  const handleTwoInputsChange = (inputNumber, value) => {
    setErrorMessage("");
    setAnswers((prev) => ({
      ...prev,
      [stepKey]: {
        ...prev[stepKey],
        [`input${inputNumber}`]: value,
      },
    }));
  };

  const handleCollaborationChange = (value) => {
    setErrorMessage("");
    setAnswers((prev) => ({
      ...prev,
      [stepKey]: {
        ...prev[stepKey],
        collaboration: value,
      },
    }));
  };

  return (
    <QuestionBox extraStyle="bg-custom-blue">
      <div className="p-1 p-md-5">
        {/* Section Header */}
        <div className="text-center mb-5 mt-4 mt-md-0">
          <h2 className="text-white bg-blue py-2 px-4 fs-2 font-bold rounded-3 d-inline display-4 text-center tot-week-2-question-text">
            {step.sectionTitle}
          </h2>
        </div>

        {/* Question Focus and Question */}
        <div className="d-flex gap-lg-1 flex-column flex-md-row mb-4">
          <h2 className="text-gray fs-5 fs-md-1 tot-week-2-question-text">
            <span className="text-blue fw-bold">{step.questionFocus}</span>{" "}
          </h2>
          <h2 className="text-gray fs-5 fs-md-1 tot-week-2-question-text">
            {step.question}
          </h2>
        </div>

        {/* Cheat Sheet */}
        {step.cheatSheet && (
          <div className="bg-blue text-white px-4 py-3 mb-3">
            <p className="mb-0 fs-5">{step.cheatSheet}</p>
          </div>
        )}

        {/* Input based on type */}
        {step.inputType === "bigTextBox" && (
          <BigTextBox
            value={stepData.mainInput || ""}
            handleChange={(e) => handleMainInputChange(e.target.value)}
          />
        )}

        {step.inputType === "checkboxWithOther" && (
          <>
            <CheckboxInput
              options={step.checkboxOptions}
              selectedOptions={stepData.checkboxes || {}}
              onCheckboxChange={handleCheckboxChange}
            />

            {/* Additional Fields */}
            {step.additionalFields &&
              step.additionalFields.map((field, index) => (
                <div key={index} className="mt-4">
                  <h3 className="text-blue fw-bold fs-5 mb-2 tot-week-2-question-text">
                    {field.label}
                  </h3>
                  <BigTextBox
                    value={
                      stepData[
                        field.label.toLowerCase().replace(/[^a-z0-9]/g, "_")
                      ] || ""
                    }
                    handleChange={(e) =>
                      handleAdditionalFieldChange(field.label, e.target.value)
                    }
                  />
                </div>
              ))}
          </>
        )}

        {step.inputType === "twoSmallInputs" && (
          <>
            <TwoSmallInputs
              input1={stepData.input1 || ""}
              input2={stepData.input2 || ""}
              onInputChange={handleTwoInputsChange}
            />

            {/* Collaboration Section */}
            {step.additionalFields && step.additionalFields.length > 0 && (
              <div className="mt-5">
                <div className="d-flex gap-2 flex-column flex-md-row mb-4">
                  <h2 className="text-gray fs-5 fs-md-1 tot-week-2-question-text">
                    <span className="text-blue fw-bold">
                      {step.additionalFields[0].questionFocus}
                    </span>{" "}
                    {step.additionalFields[0].question}
                  </h2>
                </div>

                {step.additionalFields[0].cheatSheet && (
                  <div className="bg-blue text-white px-4 py-3 rounded mb-3">
                    <p className="mb-0">
                      {step.additionalFields[0].cheatSheet}
                    </p>
                  </div>
                )}

                <BigTextBox
                  value={stepData.collaboration || ""}
                  handleChange={(e) =>
                    handleCollaborationChange(e.target.value)
                  }
                />
              </div>
            )}
          </>
        )}
      </div>
    </QuestionBox>
  );
}

export default SectionFrame;
