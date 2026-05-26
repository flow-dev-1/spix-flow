import React from "react";
import QuestionBox from "../../../../components/QuestionBox";

function OnboardingFrame({ step }) {
  return (
    <QuestionBox extraStyle="bg-custom-blue">
      <div className="p-1 p-md-5">
        <div className="mb-4 mt-4 mt-md-0">
          <h2 className="text-center text-blue fs-2 fw-bold tot-week-2-question-text">
            {step.title}
          </h2>
        </div>

        <div className="text-center">
          <h3 className="text-gray fs-4 tot-week-2-question-text">
            {step.subtitle}
          </h3>
        </div>
      </div>
    </QuestionBox>
  );
}

export default OnboardingFrame;
