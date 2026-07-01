// src/components/Hurray.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ConfettiAnimation from "./FireWork"; // Import the new component
import Button from "./Button";
import {
  hideHurray,
  selectNavigationState,
} from "@/store/navigationSlice";
import "./question.css"
import week1End from "@/assets/week1End.png";
import week2End from "@/assets/week2End.png";
import week3End from "@/assets/week3End.png";
import week4End from "@/assets/week4End.png";
import week5End from "@/assets/week5End.png";

const weekEndImages = {
  1: week1End,
  2: week2End,
  3: week3End,
  4: week4End,
  5: week5End,
};

const Hurray = ({ currentWeek = 3 }) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLastWeek } = useSelector(selectNavigationState);

  const handleNext = () => {
    sessionStorage.setItem("flow-currentPage", 1);
    sessionStorage.setItem("flow-currentStep", 1);
    if (isLastWeek) {
      navigate("/courses");
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

  const weeks = [...Array(5)].map((_, i) => i + 1);

  return (
    <>
      {showConfetti && <ConfettiAnimation onComplete={() => setShowConfetti(false)} />}
      {/* <div className="bg-sky-blue custom-border-20 question-box-container w-1029px d-flex justify-content-center align-items-center flex-column gap-3 hurray-comp">
        <img src={celebrate} alt="celebrate" className="text-center" />
        <h1 className="text-white font-lg">Hurray!</h1>
        <p className="text-center fs-5">
          You have made it to the <br /> end of Week {currentWeek}
        </p>
      </div> */}
        <div>
        {weeks.map(week => (
          week === currentWeek && weekEndImages[week] && (
            <img
              key={week}
              src={weekEndImages[week]}
              alt={`Week ${week} celebration`}
              className="text-center hurray-img"
            />
          )
        ))}
      </div>

      <div className="d-flex justify-content-center w-1029px mt-4">
        <Button text={getButtonText()} customOnClick={handleNext} />
      </div>
    </>
  );
};

export default Hurray;
