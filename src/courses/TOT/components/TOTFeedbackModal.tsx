import React from "react";
import { Icon } from "@iconify/react";

/**
 * TOTSystemFeedbackModal - A reusable modal component for feedback and messages.
 *
 * Props:
 * @param {boolean} show - Controls whether the modal is visible.
 * @param {function} onHide - Function to call when the modal should be closed.
 * @param {React.ReactNode} children - The content to display inside the modal.
 */
export default function TOTFeedbackModal({ show, onHide, children }) {
  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        role="document"
      >
        <div
          className="modal-content border-0 shadow-lg p-4 position-relative"
          style={{ borderRadius: "1px" }}
        >
          {/* Close Button */}
          <button
            type="button"
            className="btn-close p-2 position-absolute top-0 end-0 m-3"
            aria-label="Close"
            onClick={onHide}
            style={{ fontSize: "1.2rem", zIndex: 1051 }}
          ></button>

          <div className="modal-body p-4">
            {/* Header with Sparkles */}
            <div className="d-flex align-items-center mb-4">
              <Icon
                icon="fluent:sparkle-24-filled"
                className="text-info me-2"
                style={{ fontSize: "2rem" }}
              />
              <h4
                className="text-blue tot-question-text fw-bold mb-0 text-uppercase"
                style={{ fontSize: "1.25rem" }}
              >
                Feedback
              </h4>
            </div>

            {/* Content Area */}
            <div className="feedback-content">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
