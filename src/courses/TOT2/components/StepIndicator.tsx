import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentStep } from "@/store/navigationSlice";

const StepIndicator = ({ totalSteps }) => {
  const currentStep = useSelector(selectCurrentStep);

  return (
    <div className="d-flex justify-content-center mt-4" style={{ gap: "6px", flexWrap: "nowrap", overflowX: "auto" }}>
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

export default StepIndicator;
