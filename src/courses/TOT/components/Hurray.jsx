// src/components/Hurray.js
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ConfettiAnimation from "./FireWork"; // Import the new component
import Button from "./Button";
import {
  hideHurray,
  selectNavigationState,
} from "@/store/navigationSlice";
import "./question.css"
import { getAssetUrl } from "../assetUrls";

const isRespectWebViewSession = () => {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return (
    params.get("respectLaunchVersion") === "1" ||
    Boolean(sessionStorage.getItem("respect-launch-params"))
  );
};

const Hurray = ({ currentWeek = 3, isRespectSession = false }) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLastWeek } = useSelector(selectNavigationState);

  const handleNext = () => {
    if (isRespectSession) {
      if (window.RespectLauncher?.close) {
        window.RespectLauncher.close();
      } else if (window.history.length > 1) {
        window.history.back();
      } else {
        window.close();
      }
      return;
    }

    sessionStorage.setItem("flow-currentPage", 1);
    sessionStorage.setItem("flow-currentStep", 1);
    if (isLastWeek) {
      navigate(isRespectWebViewSession() ? "/tot" : "/dashboard/my-courses");
    } else {
      dispatch(hideHurray());
    }
  };

  const getButtonText = () => {
    if (isRespectSession) {
      return "Back to Lessons";
    }
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
            src={getAssetUrl("weekEndHurray.png")}
            alt="Course completion celebration"
            className="text-center hurray-img"
          />
        ) : (
          weeks.map(week => (
            week === currentWeek && (
              <img
                key={week}
                src={getAssetUrl(`week${week}End.png`)}
                alt={`Week ${week} celebration`}
                className="text-center hurray-img"
              />
            )
          ))
        )}
      </div>

      <div className="d-flex justify-content-center w-1029px mt-4">
        <Button text={getButtonText()} customOnClick={handleNext} />
      </div>
    </>
  );
};

export default Hurray;
