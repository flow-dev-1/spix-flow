import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import QuestionBox from "../../../components/QuestionBox";
import Dyslexia from "@/assets/tot-2-images/dyslexia.png";
import Frame from "./components/Frame";
import Button from "../../../components/Button";
import {
  selectPageData,
  selectCurrentStep,
  navigateNext,
} from "@/store/navigationSlice";
import TOTFeedbackModal from "../../../components/TOTFeedbackModal";
import StepIndicator from "../../../components/StepIndicator";
import {
  userAnswer,
  saveActivity,
} from "@/store/userAnswersReducer";
import { adminData } from "@/store/adminReducer";
import VideoComponent from "../../../components/Video";

function Page14() {
  const dispatch = useDispatch(); // Initialize dispatch
  const pageData = useSelector(selectPageData);
  const currentStep = useSelector(selectCurrentStep);
  const totalSteps = pageData?.steps?.length || 0;
  const [answers, setAnswers] = useState([]); // State to hold answers
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const step = pageData?.steps[currentStep - 1];
  const userAnswers = useSelector(userAnswer);
  const adminDatas = useSelector(adminData);

  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackInfo, setFeedbackInfo] = useState({
    isCorrect: false,
    feedback: "",
    correctOptionText: "",
  });

  // Step 7 logic
  const [isRevealed, setIsRevealed] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [hasPlayed, setHasPlayed] = useState(false);

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
  }, [userAnswers, pageData.id]);

  // Reset Step 7 state when navigating away or to Step 7
  useEffect(() => {
    if (currentStep === 7) {
      setIsRevealed(false);
      setCountdown(5);
      setHasPlayed(false);
    }
  }, [currentStep]);

  const handlePlaySequence = () => {
    if (hasPlayed) return;
    setErrorMessage("");
    setIsRevealed(true);
    setHasPlayed(true);

    let timer = 5;
    const interval = setInterval(() => {
      timer -= 1;
      setCountdown(timer);
      if (timer <= 0) {
        clearInterval(interval);
        setIsRevealed(false);
      }
    }, 1000);
  };

  const saveUserInput = () => {
    if (adminDatas.isAdmin) return true;

    // Steps 1, 2, 4, and 5 are instruction-like or text steps.
    if ([1, 2, 4, 5].includes(currentStep)) {
      return true;
    }

    // Step 8 must be played before the user can proceed.
    if (currentStep === 8) {
      if (!hasPlayed) {
        setErrorMessage(
          "Please click Play to reveal the sequence before continuing.",
        );
        return false;
      }
      setErrorMessage("");
      return true;
    }

    const stepData = answers.find((item) => item.stepId === currentStep);
    if (!stepData) {
      setErrorMessage("Oops! Please select an option.");
      return false;
    }

    const value = stepData.value;
    if (!value) {
      setErrorMessage("Please select an option!");
      return false;
    }

    setErrorMessage(""); // Clear error if input is valid

    // Hardcoded correct option for Step 8 if missing in data
    const effectiveCorrectOption =
      step.correctOption || (currentStep === 8 ? "1" : null);
    const isCorrect = value === effectiveCorrectOption;
    const correctOptionText =
      step.options.find((o) => o.id === effectiveCorrectOption)?.text || "";

    setFeedbackInfo({
      isCorrect: effectiveCorrectOption ? isCorrect : true,
      feedback: step.feedback || "",
      correctOptionText: effectiveCorrectOption ? correctOptionText : "",
    });

    const activityData = {
      page: pageData.id,
      answer: answers,
    };
    dispatch(saveActivity(activityData)); // Dispatch the saveActivity action

    // dont show feedback for step 6
    if (currentStep === 6) return true;
    // Show feedback modal instead of navigating immediately
    setShowFeedback(true);
  };

  const renderStep = () => {
    if (!step) return <div>Invalid Step</div>;

    switch (step.type) {
      case "instruction":
        if (currentStep === 8) {
          return (
            <QuestionBox extraStyle="bg-blue position-relative overflow-hidden shadow-lg border-0">
              <div className="position-absolute top-0 end-0 m3">
                <div className="bg-danger text-white px-3 py-1 rounded fw-bold shadow-sm">
                  {countdown}s
                </div>
              </div>

              <div className="text-center mb-4 mt-5">
                <h1 className="text-mute bg-white py-2 px-5 rounded d-inline week-2-question-text tot-text-instruction fw-bold">
                  Instruction
                </h1>
              </div>

              <div className="text-center mb-5 px-3">
                <h2 className="text-white py-2 px-md-5 d-inline-block text-center tot-week-2-question-text lh-base">
                  {step.text}
                </h2>
              </div>

              <div className="d-flex flex-column align-items-center gap-4 mb-5">
                <div className="d-flex align-items-center gap-4">
                  <button
                    onClick={handlePlaySequence}
                    disabled={hasPlayed}
                    className="btn btn-info text-white px-5 py-2 rounded-4 fw-bold"
                    style={{
                      background: "#329BD6",
                      border: "none",
                      transition: "all 0.3s ease",
                    }}
                  >
                    Play
                  </button>
                  <div className="display-4 fw-bold text-white d-flex gap-3 align-items-center mb-0">
                    {isRevealed ? (
                      <>
                        7 <span className="fs-2">–</span> 3{" "}
                        <span className="fs-2">–</span> 9{" "}
                        <span className="fs-2">–</span> 2{" "}
                        <span className="fs-2">–</span> 6
                      </>
                    ) : (
                      <>
                        0 <span className="fs-2">–</span> 0{" "}
                        <span className="fs-2">–</span> 0{" "}
                        <span className="fs-2">–</span> 0{" "}
                        <span className="fs-2">–</span> 0
                      </>
                    )}
                  </div>
                </div>
              </div>
            </QuestionBox>
          );
        }

        return (
          <QuestionBox extraStyle="bg-blue">
            <div className="text-center mb-5 mt-5 mt-md-4">
              <h1 className="text-mute bg-white py-2 px-5 rounded d-inline week-2-question-text tot-text-instruction">
                Instruction
              </h1>
            </div>

            <div className="text-center mb-5 mt-3 mt-md-0">
              <h2 className="text-white py-2 px-5 rounded d-inline-block text-start tot-week-2-question-text">
                {step.text}
              </h2>
            </div>
          </QuestionBox>
        );

      case "image":
        return (
          <img
            src={Dyslexia}
            alt="dyslexia"
            className="w-100 h-100 object-fit-contain"
          />
        );

      case "video":
        return <VideoComponent videoSrc={step.videoSrc} />;

      case "dropdownScenario":
        return (
          <Frame
            data={{
              step: step.stepId,
              question: step.question,
              options: step.options,
            }}
            setErrorMessage={setErrorMessage}
            answers={answers}
            setAnswers={setAnswers}
          />
        );
      default:
        return <div>Unknown step type</div>;
    }
  };

  return (
    <>
      <div className="p-2 p-md-3">
        {renderStep()}
        {errorMessage && (
          <div className="text-danger text-center ">{errorMessage}</div>
        )}
      </div>
      <StepIndicator totalSteps={totalSteps} />
      <div className="d-flex justify-content-center gap-96px mt-4 gap-4">
        <Button text="Prev" />
        <Button text="Next" customOnClick={saveUserInput} />
      </div>
      <TOTFeedbackModal show={showFeedback} onHide={handleCloseFeedback}>
        {/* {feedbackInfo.correctOptionText && (
          <div
            className={`mb-4 p-3 rounded-3 ${feedbackInfo.isCorrect ? "bg-success bg-opacity-10 border border-success" : "bg-danger bg-opacity-10 border border-danger"}`}
          >
            <p
              className={`mb-0 fw-bold fs-5 ${feedbackInfo.isCorrect ? "text-success" : "text-danger"}`}
            >
              {feedbackInfo.isCorrect
                ? "Correct!"
                : `${feedbackInfo.correctOptionText} is the right answer!`}
            </p>
          </div>
        )} */}
        <div className="p-2">
          <p className="text-blue fs-5 lh-base mb-0">{feedbackInfo.feedback}</p>
        </div>
      </TOTFeedbackModal>
    </>
  );
}

export default Page14;
