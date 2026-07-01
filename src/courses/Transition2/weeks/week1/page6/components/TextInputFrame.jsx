import React from "react";
import QuestionBox from "../../../../components/QuestionBox";
import BigTextBox from "../../../../components/BigTextBox";

function TextInputFrame({ step, textAnswer, setTextAnswer, setErrorMessage }) {
  const handleInputChange = (e) => {
    setTextAnswer(e.target.value);
    setErrorMessage("");
  };

  return (
    <QuestionBox extraStyle="bg-custom-blue">
      <div className="d-flex gap-3 flex-column flex-md-row flex-md-nowrap align-items-start mt-5 text-center transition2-week1-page6-other-question">
        <h2 className="text-blue fs-1 mb-0 flex-shrink-0">Question:</h2>
        <div className="d-flex flex-column flex-grow-1 min-w-0">
          <h2 className="text-gray fs-1 mb-1">{step.question}</h2>
        </div>
      </div>
      <BigTextBox handleChange={handleInputChange} value={textAnswer} />
    </QuestionBox>
  );
}

export default TextInputFrame;
