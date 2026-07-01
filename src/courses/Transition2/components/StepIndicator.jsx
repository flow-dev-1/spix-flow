import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentStep } from "@/store/navigationSlice";

const StepIndicator = ({ totalSteps }) => {
  const currentStep = useSelector(selectCurrentStep);

  return (
    <div className="transition2-step-indicator d-flex justify-content-center mt-4">
      {[...Array(totalSteps)].map((_, index) => (
        <div
          key={index}
          className={`transition2-step-indicator__pill ${
            index + 1 <= currentStep ? "bg-step-active" : "bg-step"
          }`}
        />
      ))}
    </div>
  );
};

export default StepIndicator;
