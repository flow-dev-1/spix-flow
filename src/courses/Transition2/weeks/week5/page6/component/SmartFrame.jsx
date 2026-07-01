import React from "react";
import QuestionBox from "../../../../components/QuestionBox";
import SmartTextBox from "../../../../components/SmartTextBox";

function SmartFrame({ data, answers, setAnswers, setErrorMessage }) {
  const { step, question, config } = data;

  const handleInputChange = (textBoxIndex, value) => {
    setErrorMessage("");
    setAnswers((prevAnswers) => {
      const updatedAnswers = Array.isArray(prevAnswers) ? [...prevAnswers] : [];
      const stepIndex = updatedAnswers.findIndex(
        (answer) => answer.stepId === step
      );

      if (stepIndex !== -1) {
        updatedAnswers[stepIndex] = {
          ...updatedAnswers[stepIndex],
          value: {
            ...updatedAnswers[stepIndex].value,
            [textBoxIndex]: value, // Update specific index
          },
        };
      } else {
        updatedAnswers.push({
          stepId: step,
          value: {
            [textBoxIndex]: value,
          },
        });
      }

      return updatedAnswers;
    });
  };

  return (
    <QuestionBox>
      <div className="d-flex gap-2 justify-content-center flex-column flex-md-row">
        <h2 className="text-blue fs-1">Question: </h2>
        <h2 className="text-gray fs-1">{question}</h2>
      </div>
      <div className="mb-2">
        <div className="gap-2">
          {config.map((item, textBoxIndex) => (
            <SmartTextBox
              key={textBoxIndex}
              label={item.title}
              value={
                (Array.isArray(answers)
                  ? answers.find((answer) => answer.stepId === step)?.value?.[
                      textBoxIndex
                    ]
                  : "") || ""
              }
              onChange={(e) => handleInputChange(textBoxIndex, e.target.value)}
            />
          ))}
        </div>
      </div>
    </QuestionBox>
  );
}

export default SmartFrame;
