import React, { useState } from "react";
import QuestionBox from "../../../../components/QuestionBox";
import BigTextBox from "../../../../components/BigTextBox";
import SmallTextBox from "./SmallInputTextBox";
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
            Example
          </h2>
        </div>
        <div className="d-flex gap-2 flex-column flex-md-row">
          <h2 className="text-blue fw-bold fs-4 fs-md-1 tot-week-2-question-text">
            {question}
          </h2>
        </div>
        <h2 className="text-gray fw-bold fs-4 fs-md-1 tot-week-2-question-text">
          Strength:
        </h2>
        <div className="mx-4">
          {type === "example" ? (
            <SmallTextBox
              disabled={type === "example"}
              value={"Perseverance"}
            />
          ) : (
            <SmallTextBox
              value={
                answers.find((answer) => answer.stepId === step)?.strength || ""
              }
              onChange={(e) => handleInputChange("strength", e.target.value)}
            />
          )}
        </div>

        <h2 className="text-gray fw-bold fs-4 fs-md-1 tot-week-2-question-text">
          Praise Example:
        </h2>
        <div className="mx-4">
          {type === "example" ? (
            <MediumTextBox
              disabled={type === "example"}
              value={
                "I really admire the persistence you’ve shown in tackling this task. Your effort is inspiring, and it’s paying off"
              }
            />
          ) : (
            <MediumTextBox
              value={
                answers.find((answer) => answer.stepId === step)
                  ?.praiseExample || ""
              }
              handleChange={(e) =>
                handleInputChange("praiseExample", e.target.value)
              }
            />
          )}
        </div>

        {/* <BigTextBox handleChange={handleInputChange} value={myAnswer} /> */}
      </div>
    </QuestionBox>
  );
}

export default Frame;
