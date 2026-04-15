import React from "react";
import "./question.css";

export default function QuestionBox({ children, extraStyle }) {

  return (
    <div className={`tot-question-box-container ${extraStyle}`}>
      {children}
    </div>
  );
}
