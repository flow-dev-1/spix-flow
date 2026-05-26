import React, { useState } from "react";
import QuestionBox from "../../../../components/QuestionBox";
import MediumTextBox from "./MediumTextBox";

function Frame({ data, answers, setAnswers, setErrorMessage, type }) {
  const { step, question } = data;

  const handleInputChange = (inputType, value) => {
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
          stepId: step,
          [inputType]: value, // dynamically set property based on input type
        };
      } else {
        updatedAnswers.push({
          stepId: step,
          [inputType]: value,
        });
      }

      return updatedAnswers;
    });
  };

  return (
    <QuestionBox extraStyle="bg-custom-blue">
      <div className="p-1 p-md-5">
        <div className="text-center mb-5 mt-4 mt-md-0">
          <h2 className="text-white bg-blue py-2 px-4 fs-2 font-bold rounded-3 d-inline display-4 text-center tot-week-2-question-text">
            {type === "example" ? "Example" : `Scenario ${step - 2}`}
          </h2>
        </div>

        {type === "example" && (
          <>
            <div className="d-flex gap-4 flex-column flex-md-row">
              <div className="text-white bg-gray rounded-4 px-3 py-1  fs-2 fs-md-1 fs-lg-1 tot-week-2-question-text ">
                Statement:{" "}
              </div>
              <div className="fw-bolder fs-2 fs-md-1 fs-lg-1 tot-week-2-question-text">
                You are so smart!
              </div>
            </div>

            <div className="d-flex gap-4 flex-column flex-md-row mt-3">
              <div className="text-white bg-green rounded-4 px-3 py-1  fs-2 fs-md-1 fs-lg-1 tot-week-2-question-text ">
                Reframe:
              </div>
              <div className="fw-bolder fs-3 fs-md-1 fs-lg-1 tot-week-2-question-text">
                I can see how much effort you put into solving that problem!
              </div>
            </div>
          </>
        )}

        {type === "scenario" && (
          <>
            <div className="d-flex gap-4 flex-column flex-md-row mb-2">
              <div className="text-white bg-gray rounded-4 px-3 py-1  fs-2 fs-md-1 fs-lg-1 tot-week-2-question-text ">
                Statement:{" "}
              </div>
              <div className="fw-bolder fs-2 fs-md-1 fs-lg-1 tot-week-2-question-text">
                {question}
              </div>
            </div>
            <div className="mb-2">
              <div className="text-white bg-green rounded-4 px-3 py-1  fs-2 fs-md-1 fs-lg-1 tot-week-2-question-text mb-2 d-inline">
                Reframe:
              </div>
            </div>

            <MediumTextBox
              value={
                answers.find((answer) => answer.stepId === step)?.reframe || ""
              }
              handleChange={(e) => handleInputChange("reframe", e.target.value)}
            />
          </>
        )}

        {/* <BigTextBox handleChange={handleInputChange} value={myAnswer} /> */}
      </div>
    </QuestionBox>
  );
}

export default Frame;
