import React, { useState } from "react";
import QuestionBox from "../../../../components/QuestionBox";
import SmallTextBox from "../../../../components/SmallTextBox";
import SmallSelectBox from "../../../../components/SmallSelectBox";

function Frame({ data, answers, setAnswers, setErrorMessage }) {
  const { step, title, questions } = data;

  console.log(questions, "questions");

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
    <QuestionBox>
      <h2 className="text-gray fs-1">
        <joe className="text-blue ">
          Situation {step}:<br className="d-md-none" />
        </joe>{" "}
        {title}
      </h2>

      {questions.map((q, index) => (
        <div key={index} className="mb-2">
          <>
            <h2 className="text-gray">{q.question}</h2>
            {q?.type === "smallSelect" ? (
              <SmallSelectBox
                value={
                  answers.find((answer) => answer.stepId === step)?.value?.[
                    index
                  ] || ""
                }
                onChange={(e) => handleInputChange(index, e.target.value)}
              />
            ) : (
              <SmallTextBox
                value={
                  answers.find((answer) => answer.stepId === step)?.value?.[
                    index
                  ] || ""
                }
                onChange={(e) => handleInputChange(index, e.target.value)}
              />
            )}
          </>
        </div>
      ))}
    </QuestionBox>
  );
}

export default Frame;
