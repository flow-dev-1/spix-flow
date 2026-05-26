import React, { useState } from "react";
import QuestionBox from "../../../../components/QuestionBox";
import BigTextBox from "../../../../components/BigTextBox";

function Frame({ data, answers, setAnswers, setErrorMessage }) {
  const { step, title, questions } = data;

  const handleInputChange = (index, value) => {
    setErrorMessage("");
    // Update answers state with the new value
    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      const stepIndex = updatedAnswers.findIndex(
        (answer) => answer.stepId === step,
      );

      if (stepIndex !== -1) {
        updatedAnswers[stepIndex] = {
          ...updatedAnswers[stepIndex],
          stepId: step,
          value,
        };
      } else {
        updatedAnswers.push({
          stepId: step,
          value,
        });
      }

      return updatedAnswers;
    });
  };

  return (
    <QuestionBox extraStyle="bg-custom-blue">
      {/* <h2 className="text-blue text-center fs-1">{title}</h2> */}

      {questions.map((question, index) => {
        const [key, value] = Object.entries(question)[0]; // extract the key value pair
        return (
          <div key={index} className="mt-5">
            <div className="d-flex gap-2 flex-column flex-md-row">
              <h2 className="text-blue tot-question-text">{value}</h2>
            </div>
            <BigTextBox
              value={
                answers.find((answer) => answer.stepId === step)?.value || ""
              } // Pass the current answer
              handleChange={(e) => handleInputChange(index, e.target.value)} // Handle input change
            />
          </div>
        );
      })}
    </QuestionBox>
  );
}

export default Frame;
