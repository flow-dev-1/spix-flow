// src/components/Hurray.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import celebrate from "@/assets/celebrate.png";
import ConfettiAnimation from "./FireWork"; // Import the new component
import Button from "./Button";
import {
  hideHurray,
  selectNavigationState,
} from "@/store/navigationSlice";

const Hurray = ({ currentWeek = 3 }) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLastWeek } = useSelector(selectNavigationState);

  const handleNext = () => {
    sessionStorage.setItem("flow-currentPage", 1);
    sessionStorage.setItem("flow-currentStep", 1);
    if (isLastWeek) {
      navigate("/dashboard/my-courses");
    } else {
      dispatch(hideHurray());
    }
  };

  const getButtonText = () => {
    if (isLastWeek) {
      return "Back to Course";
    }
    return `Proceed to Week ${currentWeek + 1}`;
  };

  return (
    <>
      {showConfetti && <ConfettiAnimation onComplete={() => setShowConfetti(false)} />}
      <div className="bg-sky-blue custom-border-20 question-box-container w-1029px d-flex justify-content-center align-items-center flex-column gap-3">
        <img src={celebrate} alt="celebrate" className="text-center" />
        <h1 className="text-white font-lg">Hurray!</h1>
        <p className="text-center fs-5">
          You have made it to the <br /> end of Week {currentWeek}
        </p>
      </div>
      <div className="d-flex justify-content-center w-1029px mt-4">
        <Button text={getButtonText()} customOnClick={handleNext} />
      </div>
    </>
  );
};

export default Hurray;