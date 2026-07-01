import React from "react";
import "./question.css";

export default function QuestionBox({ children, extraMobileStyle }) {

  return (
    <div className={`custom-border-20 bg-worksheet resilience-question-box-container ${extraMobileStyle}`}>
      {children}
    </div>
  );
}
