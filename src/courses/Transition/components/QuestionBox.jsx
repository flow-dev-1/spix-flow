import React from "react";
import "./question.css";

export default function QuestionBox({ children, className = "" }) {
  return (
    <div className={`custom-border-20 p-md-5 p-2 bg-worksheet question-box-container transition-question-box h-450px ${className}`}>
      {children}
    </div>
  );
}
