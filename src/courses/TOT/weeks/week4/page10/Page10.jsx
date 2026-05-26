import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import QuestionBox from "../../../components/QuestionBox";
import Button from "../../../components/Button";
import {
  selectPageData,
  navigateNext,
  selectCurrentStep,
} from "@/store/navigationSlice";
import TOTFeedbackModal from "../../../components/TOTFeedbackModal";
import StepIndicator from "../../../components/StepIndicator";
import {
  userAnswer,
  saveActivity,
} from "@/store/userAnswersReducer";
import { adminData } from "@/store/adminReducer";
import CareerLadderFrame from "./components/CareerLadderFrame";

function WeekFourPage6() {
  const dispatch = useDispatch();
  const pageData = useSelector(selectPageData);
  const currentStep = useSelector(selectCurrentStep);
  const totalSteps = pageData?.steps?.length || 0;
  const [answers, setAnswers] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const handleCloseFeedback = () => {
    setShowFeedback(false);
    dispatch(navigateNext()); // Navigate after closing the modal
  };
  const step = pageData?.steps[currentStep - 1];
  const userAnswers = useSelector(userAnswer);
  const adminDatas = useSelector(adminData);

  useEffect(() => {
    if (!userAnswers) return;
    const response = userAnswers.activities?.find(
      (item) => item.page === pageData.id,
    );

    if (response?.answer) {
      setAnswers(response.answer);
    }
  }, [userAnswers, pageData?.id]);

  const saveUserInput = () => {
    // Skip validation for instruction step
    if (currentStep === 1) return true;
    if (adminDatas.isAdmin) return true;

    // For career ladder step, validate all boxes are completed
    if (step?.type === "careerLadder") {
      const boxes = step.boxes || [];
      const allCompleted = boxes.every((box) => {
        const boxAnswers = answers[box.id];
        if (!boxAnswers) return false;

        // Check if both questions are answered
        return box.questions.every((q) => {
          const answer = boxAnswers[q.id];
          return answer && answer.trim() !== "";
        });
      });

      if (!allCompleted) {
        setErrorMessage(
          "Please complete all boxes in the career ladder before proceeding.",
        );
        return false;
      }

      setErrorMessage("");

      const activityData = {
        page: pageData.id,
        answer: answers,
      };
      dispatch(saveActivity(activityData));
    }

    if (currentStep !== 2) {
      return true;
    }

    setShowFeedback(true);
    return false;
  };

  const renderStep = () => {
    if (!step) return <div>Invalid Step</div>;

    switch (step.type) {
      case "instruction":
        return (
          <QuestionBox extraStyle="bg-blue">
            <div className="text-center mb-5 mt-5 mt-md-4">
              <h1 className="text-mute bg-white py-2 px-5 rounded d-inline week-2-question-text tot-text-instruction">
                Instruction
              </h1>
            </div>

            <div className="text-center mb-5 mt-3 mt-md-0">
              {step.instructions.map((instruction, index) => (
                <React.Fragment key={index}>
                  <h2 className="text-white py-2 px-5 rounded d-inline-block text-start tot-week-2-question-text">
                    {instruction}
                  </h2>
                  {index < step.instructions.length - 1 && (
                    <>
                      <br />
                      <br />
                    </>
                  )}
                </React.Fragment>
              ))}
            </div>
          </QuestionBox>
        );

      case "careerLadder":
        return (
          <CareerLadderFrame
            boxes={step.boxes}
            answers={answers}
            setAnswers={setAnswers}
            setErrorMessage={setErrorMessage}
          />
        );

      default:
        return <div>Unknown step type</div>;
    }
  };

  return (
    <>
      {renderStep()}
      {currentStep !== 1 && errorMessage && (
        <div className="text-danger text-center mt-3 fw-bold fs-5">
          {errorMessage}
        </div>
      )}
      <StepIndicator totalSteps={totalSteps} />
      <div className="d-flex justify-content-center gap-96px mt-4 gap-4">
        <Button text="Prev" />
        <Button text="Next" customOnClick={saveUserInput} />
      </div>
      <TOTFeedbackModal show={showFeedback} onHide={handleCloseFeedback}>
        <p className="text-blue">
          Reflecting on your teaching journey helps you recognize how challenges
          have shaped your growth and resilience as an educator.
        </p>
      </TOTFeedbackModal>
    </>
  );
}

export default WeekFourPage6;
