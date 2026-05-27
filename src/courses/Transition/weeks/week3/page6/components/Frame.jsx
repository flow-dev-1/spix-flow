import React, { useState } from "react";
import QuestionBox from "../../../../components/QuestionBox";
import SmallTextBox from "../../../../components/SmallTextBox";
import ColoredSmallSquaredTextBox from "../../../../components/ColoredSmallSquaredTextBox";
import ColoredSmallCircledTextBox from "../../../../components/ColoredSmallCircledTextBox";

function Frame({ data, answers, setAnswers, setErrorMessage }) {
  const { step, title, questions } = data;

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
      <h2 className="text-blue text-center fs-1">Situation: {title}</h2>

      {/* For circle and square components, use a horizontal row */}
      {questions.some((q) => q.type === "circle" || q.type === "square") && (
        <div className="d-flex flex-column flex-md-row justify-content-center gap-2 gap-md-5 mb-3">
          {questions.map(
            (q, index) =>
              (q.type === "circle" || q.type === "square") && (
                <div
                  key={index}
                  className="d-flex flex-column align-items-center"
                >
                  {q.type === "circle" ? (
                    <ColoredSmallCircledTextBox
                      color={q.colorCode}
                      value={
                        answers.find((answer) => answer.stepId === step)
                          ?.value?.[index] || ""
                      }
                      onChange={(e) => handleInputChange(index, e.target.value)}
                    />
                  ) : (
                    <div className="">
                      <ColoredSmallSquaredTextBox
                        color={q.colorCode}
                        className="p-2"
                        value={
                          answers.find((answer) => answer.stepId === step)
                            ?.value?.[index] || ""
                        }
                        onChange={(e) =>
                          handleInputChange(index, e.target.value)
                        }
                      />
                    </div>
                  )}
                  <h2 className="text-gray">{q.question}</h2>
                </div>
              )
          )}
        </div>
      )}

      {/* For other components like smallText, use a column layout */}
      {questions.map(
        (q, index) =>
          q.type !== "circle" &&
          q.type !== "square" && (
            <div key={index} className="mb-2">
              {q.type === "smallText" && (
                <>
                  <h2 className="text-gray">{q.question}</h2>
                  <SmallTextBox
                    value={
                      answers.find((answer) => answer.stepId === step)?.value?.[
                        index
                      ] || ""
                    }
                    onChange={(e) => handleInputChange(index, e.target.value)}
                  />
                </>
              )}
            </div>
          )
      )}
    </QuestionBox>
  );
}

export default Frame;
