import React from "react";
import CustomDropDown from "./CustomDropDown";
import QuestionBox from "../../../../components/QuestionBox";

function DropdownFrame({ step, answers, setAnswers, setErrorMessage }) {
  const selectedValue =
    answers.find((a) => a.stepId === step.stepId)?.value || "";

  const handleChange = (value) => {
    setErrorMessage("");

    setAnswers((prev) => {
      const idx = prev.findIndex((a) => a.stepId === step.stepId);

      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], value };
        return updated;
      }

      return [...prev, { stepId: step.stepId, value }];
    });
  };

  return (
    <QuestionBox extraStyle="bg-custom-blue">
      <div className="p-5">
        <h2 className="text-gray fw-bold tot-question-text text-center mb-4">
          {step.question}
        </h2>

        <CustomDropDown
          value={selectedValue}
          options={step.options}
          onChange={handleChange}
        />
      </div>
    </QuestionBox>
  );
}

export default DropdownFrame;
