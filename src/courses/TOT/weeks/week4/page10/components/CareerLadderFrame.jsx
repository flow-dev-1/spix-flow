import React, { useState } from "react";
import QuestionBox from "../../../../components/QuestionBox";
import LadderModal from "./LadderModal";
import "./CareerLadder.css";

function CareerLadderFrame({ boxes, answers, setAnswers, setErrorMessage }) {
  const [selectedBox, setSelectedBox] = useState(null);

  const handleBoxClick = (box) => {
    const currentId = box.id;

    // Prevent user from skipping earlier boxes (based on ID)
    const previousIncomplete = boxes.some(
      (b) => b.id < currentId && !isBoxCompleted(b.id),
    );

    if (previousIncomplete) {
      const lastIncomplete = Math.min(
        ...boxes.filter((b) => !isBoxCompleted(b.id)).map((b) => b.id),
      );
      const requiredBox = boxes.find((b) => b.id === lastIncomplete);
      setErrorMessage(`Please complete "${requiredBox.text}" first.`);
      return;
    }

    setErrorMessage("");
    setSelectedBox(box);
  };

  const handleCloseModal = () => {
    setSelectedBox(null);
  };

  const isBoxCompleted = (boxId) => {
    const boxAnswers = answers[boxId];
    if (!boxAnswers) return false;

    const box = boxes.find((b) => b.id === boxId);
    if (!box) return false;

    return box.questions.every((q) => {
      const answer = boxAnswers[q.id];
      return answer && answer.trim() !== "";
    });
  };

  return (
    <>
      <QuestionBox extraStyle="bg-custom-blue">
        <div className="career-ladder-container">
          <div className="career-ladder">
            {boxes.map((box, index) => (
              <React.Fragment key={box.id}>
                {/* Box */}
                <div
                  className={`ladder-box ${
                    isBoxCompleted(box.id) ? "completed" : ""
                  }`}
                  style={{
                    backgroundColor: box.bgColor,
                    cursor: "pointer",
                  }}
                  onClick={() => handleBoxClick(box)}
                >
                  <span className="fs-4 fs-md-1 fw-bold tot-question-text">
                    {box.text}
                  </span>
                  <span className="">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15.042 21.672L13.684 16.6M13.684 16.6L11.174 18.825L11.743 9.355L16.97 17.272L13.684 16.6ZM12 2.25V4.5M17.834 4.666L16.243 6.257M20.25 10.5H18M7.757 14.743L6.167 16.333M6 10.5H3.75M7.757 6.257L6.167 4.667"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>

                  {isBoxCompleted(box.id) && (
                    <span className="completion-check">✓</span>
                  )}
                </div>

                {/* Connector */}
                {index < boxes.length - 1 && (
                  <div className="ladder-connector">
                    {index === 0 ? (
                      <div className="ladder-arrow">
                        <svg
                          width="15"
                          height="33"
                          viewBox="0 0 15 33"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.07039 0.292893C7.67986 -0.0976311 7.0467 -0.0976311 6.65617 0.292893L0.292214 6.65685C-0.0983105 7.04738 -0.0983106 7.68054 0.292214 8.07107C0.682738 8.46159 1.3159 8.46159 1.70643 8.07107L7.36328 2.41421L13.0201 8.07107C13.4107 8.46159 14.0438 8.46159 14.4343 8.07107C14.8249 7.68054 14.8249 7.04738 14.4343 6.65685L8.07039 0.292893ZM7.36328 33L8.36328 33L8.36328 17L7.36328 17L6.36328 17L6.36328 33L7.36328 33ZM7.36328 17L8.36328 17L8.36328 1L7.36328 1L6.36328 1L6.36328 17L7.36328 17Z"
                            fill="#5B616A"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div className="ladder-line"></div>
                    )}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </QuestionBox>

      {/* Modal */}
      {selectedBox && (
        <LadderModal
          box={selectedBox}
          answers={answers}
          setAnswers={setAnswers}
          onClose={handleCloseModal}
          setErrorMessage={setErrorMessage}
        />
      )}
    </>
  );
}

export default CareerLadderFrame;
