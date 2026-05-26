import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./page4.css";
import Button from "../../../components/Button";
import {
  selectPageData,
  navigateNext,
} from "@/store/navigationSlice";
import TOTFeedbackModal from "../../../components/TOTFeedbackModal";
import {
  userAnswer,
  saveActivity,
} from "@/store/userAnswersReducer";
import { adminData } from "@/store/adminReducer";
import VideoComponent from "../../../components/Video";
import Feeling from "./components/feeling";

function Page4() {
  const pageData = useSelector(selectPageData);
  const dispatch = useDispatch();
  const [answers, setAnswers] = useState([]); // State to hold answers
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const adminDatas = useSelector(adminData);

  const userAnswers = useSelector(userAnswer);
  const [showFeedback, setShowFeedback] = useState(false);
  const handleCloseFeedback = () => {
    setShowFeedback(false);
    dispatch(navigateNext()); // Navigate after closing the modal
  };

  useEffect(() => {
    if (!userAnswers) return;

    const response = userAnswers.activities?.find(
      (item) => item.page === pageData.id,
    );
    setAnswers(Array.isArray(response?.answer) ? response.answer : []);
    return () => {};
  }, [userAnswers]);

  const saveUserInput = () => {
    if (adminDatas.isAdmin) return true;

    // Check if feeling is selected
    const feelingAnswer = answers.find((a) => a.name === "feeling");
    if (!feelingAnswer) {
      setErrorMessage("Please select how you're feeling today");
      return false;
    }

    setErrorMessage(""); // Clear error if input is valid

    const activityData = {
      page: pageData.id,
      answer: answers,
    };
    dispatch(saveActivity(activityData)); // Dispatch the saveActivity action

    // Show feedback modal instead of navigating immediately
    setShowFeedback(true);
    // return true;
  };

  return (
    <>
      <div className="tot-page4-video-stage">
        <VideoComponent videoSrc={pageData.videoSrc} />
        {/* pass answers and setAnswers so Feeling can read/update selection */}
        {!showFeedback && <Feeling answers={answers} setAnswers={setAnswers} />}
      </div>
      {errorMessage && <div className="text-danger">{errorMessage}</div>}{" "}
      {/* Display error message */}
      <div className="d-flex justify-content-center gap-96px mt-4 gap-4">
        <Button text="Prev" />
        <Button text="Next" customOnClick={saveUserInput} />
      </div>
      <TOTFeedbackModal show={showFeedback} onHide={handleCloseFeedback}>
        <p className="text-blue mb-3">Thank you for sharing!</p>
        <p className="text-blue">
          Teachers experience many emotions throughout the day. Recognizing how
          we feel is the first step toward emotional awareness, which is a core
          part of Social-Emotional Learning..
        </p>
      </TOTFeedbackModal>
    </>
  );
}

export default Page4;
