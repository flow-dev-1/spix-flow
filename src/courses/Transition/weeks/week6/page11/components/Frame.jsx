import React from "react";
import QuestionBox from "../../../../components/QuestionBox";
import CustomDropDown from "../../../../components/CustomDropDown";

function Frame({ data, answers, setAnswers, setErrorMessage }) {
  const { step, question, options } = data;

  const handleInputChange = (value) => {
    setErrorMessage("");
    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      const stepIndex = updatedAnswers.findIndex(
        (answer) => answer.stepId === step
      );

      if (stepIndex !== -1) {
        updatedAnswers[stepIndex] = {
          ...updatedAnswers[stepIndex],
          value: value, // Store single value directly
        };
      } else {
        updatedAnswers.push({
          stepId: step,
          value: value,
        });
      }

      return updatedAnswers;
    });
  };

  return (
    <QuestionBox>
      <div className="d-flex gap-2 flex-column flex-md-row">
        <h2 className="text-blue fs-1 d-flex gap-2 ">
          Question: <h2 className="d-md-none text-blue">{step - 1}</h2>{" "}
        </h2>
        <h2 className="text-gray fs-1">{question}</h2>
      </div>

      <div className="mt-2">
        <CustomDropDown
          value={answers.find((answer) => answer.stepId === step)?.value || ""}
          onChange={handleInputChange}
          options={options} // Pass options here
        />
      </div>
    </QuestionBox>
  );
}

export default Frame;
