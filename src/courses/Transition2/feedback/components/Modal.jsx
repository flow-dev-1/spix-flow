import React, { useEffect, useState } from "react";

function Modal({ isOpen, closeModal, data, handleSubmit }) {
  const [feedback, setFeedback] = useState("")

  useEffect(() => {
    setFeedback(data)
  }, [data])
  
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-window bg-white w-50 rounded">
        <div className="d-flex justify-content-between align-items-end pt-3 px-4 border border-bottom-3">
          <h2 className="text-gray">Feedback Form</h2>
          <button
            className="border-outline-0 btn fs-3 text-gray fst-normal"
            onClick={() => {
              closeModal();
            }}
          >
            X
          </button>
        </div>

        <label
          className="text-blue fs-6 px-4 mt-5 d-flex"
          style={{ color: "#329BD6" }}
        >
          Drop a feedback based on the student response to this activity.
        </label>
        <div className="p-4">
          <textarea
            className="form-control form-control-sm no-scrollbar resize-none border-1 border-outline-0 bg-gray p-3 fs-6 border"
            rows="6"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          ></textarea>
        </div>

        <div className="d-flex justify-content-end  px-4 pt-3 pb-4 border border-bottom-3">
          <button
            className="bg-blue text-white px-5 border-0 py-2 rounded-3"
            onClick={() => {
              setFeedback("")
              handleSubmit(feedback)
            }}
          >
            Submit Feedback
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
