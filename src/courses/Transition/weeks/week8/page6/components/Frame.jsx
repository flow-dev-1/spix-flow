import React from "react";
import QuestionBox from "../../../../components/QuestionBox";
import ColoredHeartTextBox from "../../../../components/ColoredHeartTextBox";

import ColoredStarTextBox from "../../../../components/ColoredStarTextBox";

function Frame({ data, answers, setAnswers, setErrorMessage }) {
  const { step, question, config } = data;

  const handleInputChange = (index, value) => {
    setErrorMessage("");
    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      const stepIndex = updatedAnswers.findIndex(
        (answer) => answer.stepId === step
      );

      if (stepIndex !== -1) {
        updatedAnswers[stepIndex] = {
          ...updatedAnswers[stepIndex],
          value: {
            ...updatedAnswers[stepIndex].value,
            [index]: value,
          },
        };
      } else {
        updatedAnswers.push({
          stepId: step,
          value: {
            [index]: value,
          },
        });
      }

      return updatedAnswers;
    });
  };

  return (
    <>
      <QuestionBox>
        <div className="d-flex gap-2 flex-column flex-md-row">
          <h2 className="text-blue fs-1">Question: </h2>
          <h2 className="text-gray fs-1">{question}</h2>
        </div>
        <div className="mb-2">
          <div className="d-flex gap-2 flex-column flex-md-row">
            {config.map((textBoxConfig, index) => (
              <ColoredHeartTextBox
                key={index}
                color={textBoxConfig.color}
                value={
                  answers.find((answer) => answer.stepId === step)?.value?.[
                    index
                  ] || ""
                }
                handleChange={(e) => handleInputChange(index, e.target.value)}
              />
            ))}
          </div>
        </div>
      </QuestionBox>
    </>
  );
}

export default Frame;
