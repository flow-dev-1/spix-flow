import React, { useState, useEffect } from "react";
import QuestionBox from "../../../../components/QuestionBox";
import BigTextBox from "../../../../components/BigTextBox";

function LetterModal({
  letter,
  pageQuestion,
  existingAnswer,
  onClose,
  onSave,
}) {
  const [myAnswer, setMyAnswer] = useState("");

  useEffect(() => {
    setMyAnswer(existingAnswer || "");
  }, [existingAnswer, letter]);

  const handleSubmit = () => {
    if (!myAnswer || myAnswer.trim() === "") return;
    onSave(letter.key, myAnswer.trim());
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="modal-close-btn mt-4" onClick={onClose}>
          ✕
        </button>

        <QuestionBox>
          <div className="p-3 text-center">
            <div className="d-flex gap-3 flex-column flex-md-row align-items-center">
              <h2 className="text-blue fs-1 mb-0">{letter.labelFull}:</h2>
              <h2 className="text-gray fs-1 mb-0 flex-grow-1">
                {pageQuestion}
              </h2>
            </div>

            <div className="mt-4">
              <BigTextBox
                handleChange={(e) => setMyAnswer(e.target.value)}
                value={myAnswer}
              />
            </div>
          </div>
        </QuestionBox>

        <div className="d-flex justify-content-center gap-3 mt-4">
          <button
            className="fs-5 rounded w-200px h-40px d-flex align-items-center justify-content-center bg-button text-white border-0"
            onClick={handleSubmit}
            disabled={!myAnswer.trim()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default LetterModal;
