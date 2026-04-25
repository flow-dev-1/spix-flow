// src/components/Hurray.js
import React, { useState, useEffect } from "react";

const weekEndImages = import.meta.glob(
  "/src/assets/week*End.png",
  { eager: true, import: "default" }
);
import weekEndHurray from "@/assets/weekEndHurray.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ConfettiAnimation from "./FireWork"; // Import the new component
import Button from "./Button";
import {
  hideHurray,
  selectNavigationState,
} from "@/store/navigationSlice";
import "./question.css"

const Hurray = ({ currentWeek = 3 }) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLastWeek } = useSelector(selectNavigationState);

  const handleNext = () => {
    sessionStorage.setItem("flow-currentPage", "1");
    sessionStorage.setItem("flow-currentStep", "1");
    if (isLastWeek) {
      // In SPIX the main fallback landing page is the course root, effectively refreshing the course wrapper.
      navigate("/tot2");
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

  const weeks = [...Array(6)].map((_, i) => i + 1);

  return (
    <>
      {showConfetti && <ConfettiAnimation onComplete={() => setShowConfetti(false)} />}
      <div>
        {currentWeek === 6 ? (
          <img
            src={weekEndHurray}
            alt="Course completion celebration"
            className="text-center hurray-img"
          />
        ) : (
          weeks.map(week => (
            week === currentWeek && (
              <img
                key={week}
                src={weekEndImages[`/src/assets/week${week}End.png`] as string}
                alt={`Week ${week} celebration`}
                className="text-center hurray-img"
              />
            )
          ))
        )}
      </div>

      <div className="d-flex justify-content-center w-1029px mt-4">
        <Button text={getButtonText()} customOnClick={handleNext} loading={false} />
      </div>
    </>
  );
};

export default Hurray;