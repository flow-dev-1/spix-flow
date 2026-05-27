import React, { useState } from "react";
import QuestionBox from "../../../../components/QuestionBox";
import MediumTextBox from "../../../../components/MediumTextBox";
import futureMe from "@/assets/dearFutureMe.png";

function Frame({ data, answers, setAnswers, setErrorMessage }) {
  const { step, title, questions } = data;

  const handleInputChange = (index, value) => {
    setErrorMessage("");
    // Update answers state with the new value
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
            [index]: value, // Update the specific index with the new value
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
    <QuestionBox>
      <div className="d-flex flex-column align-items-center text-start text-md-center w-100">
        <img src={futureMe} alt="Future Me" className="mb-3" />

        {questions.map((q, index) => (
          <div
            key={index}
            className="mb-2 w-100 d-flex flex-column align-items-center"
          >
            <h2 className="text-gray text-star text-md-center">{q.question}</h2>
            <MediumTextBox
              value={
                answers.find((answer) => answer.stepId === step)?.value?.[
                  index
                ] || ""
              }
              handleChange={(e) => handleInputChange(index, e.target.value)}
            />
          </div>
        ))}
      </div>
    </QuestionBox>
  );
}

export default Frame;
