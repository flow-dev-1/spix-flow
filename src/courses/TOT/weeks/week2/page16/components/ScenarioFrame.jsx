import React from "react";
import QuestionBox from "../../../../components/QuestionBox";

function ScenarioFrame({ data }) {
  const { scenarioNumber, question } = data;

  return (
    <QuestionBox extraStyle="bg-custom-blue">
      <div className="p-1 p-md-5">
        <div className="text-center mb-5 mt-4 mt-md-0">
          <h2 className="text-white bg-blue py-2 px-4 fs-2 font-bold rounded-3 d-inline display-4 text-center tot-week-2-question-text">
            Scenario {scenarioNumber}
          </h2>
        </div>
        <div className="">
          <h2 className="text-center text-gray fs-3 fs-md-1 tot-week-2-question-text text-center fw-bolder">
            {question}
          </h2>
        </div>
      </div>
    </QuestionBox>
  );
}

export default ScenarioFrame;
