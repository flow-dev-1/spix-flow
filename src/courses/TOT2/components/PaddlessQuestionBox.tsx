import React from "react";
import "./question.css";

export default function PaddlessQuestionBox({ children }) {
  return (
    <div className="custom-border-20  bg-worksheet question-box-container h-450px">
      {children}
    </div>
  );
}


