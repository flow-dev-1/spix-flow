import React, { useState, useEffect } from "react";
import QuestionBox from "../../../../components/QuestionBox";
import BigTextBox from "../../../../components/BigTextBox";
import "./CareerLadder.css";

function LadderModal({ box, answers, setAnswers, onClose, setErrorMessage }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [localAnswers, setLocalAnswers] = useState({});

  useEffect(() => {
    // Initialize local answers from props
    if (answers[box.id]) {
      setLocalAnswers(answers[box.id]);
    }
  }, [answers, box.id]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    const questionId = box.questions[currentQuestion].id;

    setLocalAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleNext = () => {
    const questionId = box.questions[currentQuestion].id;
    const currentAnswer = localAnswers[questionId];

    // Validate current question
    if (!currentAnswer || currentAnswer.trim() === "") {
      return; // Don't proceed if empty
    }

    // Update global answers
    setAnswers((prev) => ({
      ...prev,
      [box.id]: {
        ...prev[box.id],
        [questionId]: currentAnswer,
      },
    }));

    if (currentQuestion < box.questions.length - 1) {
      // Move to next question
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // All questions answered, close modal
      setErrorMessage("");
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const currentQ = box.questions[currentQuestion];
  const currentAnswer = localAnswers[currentQ.id] || "";
  const isFirstQuestion = currentQuestion === 0;
  const isLastQuestion = currentQuestion === box.questions.length - 1;

  const StepIndicator = ({ totalSteps }) => {
    const currentStep = box.questions[currentQuestion].id;

    return (
      <div
        className="d-flex justify-content-center mt-4"
        style={{ gap: "10px" }}
      >
        {[...Array(totalSteps)].map((_, index) => (
          <div
            key={index}
            className={`${
              index + 1 <= currentStep ? "bg-step-active" : "bg-step"
            }`}
            style={{
              // flexBasis: "35px",
              width: "35px",
              height: "17px",
              borderRadius: "8px",
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Close Button */}
        <button className="modal-close-btn mt-4" onClick={onClose}>
          ✕
        </button>

        {/* Modal Content */}
        <QuestionBox extraStyle="bg-custom-blue">
          <div className="p-3 p-md-4">
            {/* Question */}
            <div className="d-flex gap-3 flex-column flex-md-row flex-md-nowrap align-items-start mt-4">
              <div className="d-flex flex-column flex-grow-1 min-w-0 tot-question-text">
                <h2 className="text-blue fs-5 mb-2 fw-bolder  text-center">
                  {currentQ.question}
                </h2>
                <h2 className="text-gray fs-1 mb-2 text-center">
                  {currentQ.subQuestion}
                </h2>
              </div>
            </div>

            {/* Input */}
            <BigTextBox
              handleChange={handleInputChange}
              value={currentAnswer}
            />
          </div>
        </QuestionBox>

        <StepIndicator totalSteps={2} />

        {/* Navigation Buttons */}
        <div className="d-flex justify-content-center gap-3 mt-4">
          {!isFirstQuestion && (
            <button
              // className="btn bg-transparent text-button-blue border border-blue hover-next px-4 py-2 rounded"
              className={`btn fs-5 rounded w-200px h-40px d-flex align-items-center justify-content-center bg-white text-button-blue border border-blue border-hover-2`}
              onClick={handlePrev}
            >
              {"<<<"} Prev
            </button>
          )}
          <button
            className={`btn fs-5 rounded w-200px h-40px d-flex align-items-center justify-content-center bg-button text-white border-0 hover-prev`}
            // className="btn bg-button text-white border-0 hover-prev px-4 py-2 rounded"
            onClick={handleNext}
            disabled={!currentAnswer || currentAnswer.trim() === ""}
          >
            {isLastQuestion ? " Submit >>>" : "  Next >>> "}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LadderModal;
