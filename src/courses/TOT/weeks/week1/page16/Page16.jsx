import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./page16.css";
import Button from "../../../components/Button";
import QuestionBox from "../../../components/QuestionBox";
import {
  selectPageData,
  navigateNext,
  selectCurrentStep,
} from "@/store/navigationSlice";
import TOTFeedbackModal from "../../../components/TOTFeedbackModal";
import {
  userAnswer,
  saveActivity,
} from "@/store/userAnswersReducer";
import { adminData } from "@/store/adminReducer";

function Page16() {
  const pageData = useSelector(selectPageData);
  const dispatch = useDispatch();
  const [answers, setAnswers] = useState([]); // State to hold answers
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const [timeLeft, setTimeLeft] = useState(20); // 20 seconds timer
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [savedOnTimeout, setSavedOnTimeout] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const handleCloseFeedback = () => {
    setShowFeedback(false);
    dispatch(navigateNext()); // Navigate after closing the modal
  };

  const adminDatas = useSelector(adminData);

  const userAnswers = useSelector(userAnswer);

  // quick boolean: do we already have saved answers for this page?
  const hasExistingAnswers = Boolean(
    userAnswers?.activities?.find((item) => item.page === pageData.id),
  );

  useEffect(() => {
    if (!userAnswers) return;
    const response = userAnswers.activities?.find(
      (item) => item.page === pageData.id,
    );

    console.log(response, "response here!");
    setAnswers(Array.isArray(response?.answer) ? response.answer : []);
    return () => {};
  }, [userAnswers]);

  // Start timer on first load if no previous answers
  useEffect(() => {
    const hasExistingAnswers = userAnswers?.activities?.find(
      (item) => item.page === pageData.id,
    );

    // Set timer as complete if we have existing answers
    if (hasExistingAnswers) {
      setTimeLeft(0);
      setIsTimeUp(true);
      setIsTimerActive(false);
    }
    // Only start timer if no previous answers and timer hasn't been started
    else if (!isTimerActive && timeLeft === 20) {
      setIsTimerActive(true);
    }
  }, [userAnswers, pageData.id]);

  // Timer countdown effect
  useEffect(() => {
    let timer;
    if (isTimerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Only handle automatic fill/save if there were NO existing saved answers
      if (!hasExistingAnswers && !savedOnTimeout) {
        setIsTimeUp(true);
        setIsTimerActive(false);

        const numberOfInputs = pageData.numberOfInputs || 5;
        // Use functional update so we operate on latest prevAnswers
        setAnswers((prevAnswers) => {
          const newAnswers = [...prevAnswers];

          // Fill in empty fields only (don't overwrite existing values)
          for (let i = 0; i < numberOfInputs; i++) {
            const existingAnswer = newAnswers.find((ans) => ans.index === i);
            if (!existingAnswer) {
              newAnswers.push({ index: i, value: "" });
            }
          }

          // sort by index so saved payload is consistent
          newAnswers.sort((a, b) => a.index - b.index);

          // dispatch save immediately with final answers
          if (!adminDatas.isAdmin) {
            const activityData = {
              page: pageData.id,
              answer: newAnswers,
            };
            dispatch(saveActivity(activityData));
            setSavedOnTimeout(true);
          }

          return newAnswers;
        });
      } else {
        // If we already had answers saved, still mark time up and stop timer
        setIsTimeUp(true);
        setIsTimerActive(false);
      }
    }

    return () => clearInterval(timer);
  }, [
    isTimerActive,
    timeLeft,
    pageData.numberOfInputs,
    hasExistingAnswers,
    savedOnTimeout,
    adminDatas.isAdmin,
    dispatch,
    pageData.id,
  ]);

  const saveUserInput = () => {
    if (adminDatas.isAdmin) return true;
    // If time is up we've already saved on timeout; allow proceed.
    if (isTimeUp) {
      setShowFeedback(true);
    } // Allow proceeding if time is up

    if (answers.length < 5) {
      setErrorMessage("At least 5 values are required!");
      return false;
    }

    const emptyInputs = answers.filter((item) => item?.value?.trim() === "");
    if (emptyInputs.length > 0) {
      setErrorMessage(
        `Please fill out all inputs. ${emptyInputs.length} input(s) are missing.`,
      );
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

  // Modified handleInputChange to check timer
  const handleInputChange = (index, value) => {
    if (isTimeUp) return; // Prevent input if time is up

    setErrorMessage("");
    // Update answers state with the new value
    setAnswers((prevAnswers) => {
      // Check if the answer already exists
      const existingAnswerIndex = prevAnswers.findIndex(
        (answer) => answer.index === index,
      );
      if (existingAnswerIndex > -1) {
        // Update existing answer
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[existingAnswerIndex] = {
          ...updatedAnswers[existingAnswerIndex],
          value,
        };
        return updatedAnswers;
      } else {
        // Add new answer
        return [...prevAnswers, { index, value }];
      }
    });
  };

  return (
    <>
      <QuestionBox extraStyle="bg-custom-blue">
        <div className="d-flex gap-3 flex-column flex-md-row flex-md-nowrap align-items-start mt-4">
          <h2 className="text-blue fs-1 mb-0 flex-shrink-0 tot-question-text">
            Question:
          </h2>

          <div className="d-flex flex-column flex-grow-1 min-w-0 tot-question-text">
            <h2 className="text-gray fs-1 mb-5">{pageData.question}</h2>
          </div>
          <h2
            className={`text-white p-1 px-2 fs-1 mb-0 flex-shrink-0 tot-question-text ${
              timeLeft <= 5 ? "bg-danger" : "bg-primary"
            }`}
          >
            {timeLeft} s
          </h2>
        </div>

        <div className="bg-white px-4 pt-3 pb-2">
          {[...Array(pageData.numberOfInputs || 5)].map((_, index) => (
            <div key={index}>
              <div className="d-flex gap-3 label-input-container">
                <p className="input-label">{index + 1}.</p>
                <input
                  type="text"
                  className="resilience-input bg-white"
                  placeholder={
                    isTimeUp
                      ? "Time's up!"
                      : pageData.inputPlaceholder || "Type your answer here"
                  }
                  value={
                    answers.find((answer) => answer.index === index)?.value ||
                    ""
                  }
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  disabled={isTimeUp}
                />
              </div>
            </div>
          ))}
        </div>
      </QuestionBox>
      {errorMessage && <div className="text-danger">{errorMessage}</div>}
      {isTimeUp && (
        <div className="text-danger mt-2">
          Time's up! You can no longer modify your answers.
        </div>
      )}
      <div className="d-flex justify-content-center gap-96px mt-4 gap-4">
        <Button text="Prev" />
        <Button text="Next" customOnClick={saveUserInput} />
      </div>
      <TOTFeedbackModal show={showFeedback} onHide={handleCloseFeedback}>
        <p className="text-blue mb-3">How did that activity feel educators?</p>
        <p className="text-blue">
          Was it easy or difficult to list your strengths? Many of us find it
          harder to name our strengths than our weaknesses but why? If we, as
          adults, struggle with this, imagine how our students feel! Now, let’s
          explore how we can help students build their strengths through
          Strengths-Based Teaching, Gratitude, and Well-Being.{" "}
        </p>
      </TOTFeedbackModal>
    </>
  );
}

export default Page16;
