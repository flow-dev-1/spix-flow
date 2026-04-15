import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import QuestionBox from "../../../components/QuestionBox";
import BigTextBox from "../../../components/BigTextBox";
import Button from "../../../components/Button";
import CustomDropDown from "../../../components/CustomDropDown";
import TOTFeedbackModal from "../../../components/TOTFeedbackModal";
import StepIndicator from "../../../components/StepIndicator";
import {
  selectPageData,
  selectCurrentStep,
  navigateNext,
} from "@/store/navigationSlice";
import { adminData } from "@/store/adminReducer";
import {
  userAnswer,
  saveActivity,
} from "@/store/userAnswersReducer";

function Page2() {
  const dispatch = useDispatch();
  const pageData = useSelector(selectPageData);
  const currentStep = useSelector(selectCurrentStep);
  const adminDatas = useSelector(adminData);
  const userAnswers = useSelector(userAnswer);
  const [myAnswer, setMyAnswer] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  useEffect(() => {
    if (!userAnswers || !pageData) return;
    const response = userAnswers?.activities?.find(
      (item) => item.page === pageData.id,
    );

    if (response?.answer && Array.isArray(response.answer)) {
      const stepAnswer = response.answer.find((a) => a.stepId === currentStep);
      setMyAnswer(stepAnswer ? stepAnswer.value : "");
    } else {
      setMyAnswer("");
    }
  }, [userAnswers, pageData, currentStep]);

  const saveUserInput = () => {
    if (!adminDatas.isAdmin && !myAnswer) {
      setErrorMessage("Oops! Please enter a valid input!");
      return false;
    }

    setErrorMessage("");

    if (adminDatas.isAdmin) return true;

    // Hardcoded feedback logic
    if (currentStep === 1) {
      setFeedbackText(
        "Every child deserves to feel safe, valued, and capable.  Creating that environment begins with the mindset teachers bring into the classroom.",
      );
      setShowFeedback(true);
    } else if (currentStep === 2) {
      setFeedbackText(`Every teacher responds differently in challenging situations.
Inclusive teaching begins when we pause and reflect on how our mindset influences our reactions. When we shift from asking:
“Why is this learner behaving this way?” to asking: “What might this learner be experiencing?” we begin to create a more supportive and inclusive classroom.`);
      setShowFeedback(true);
    }

    // Save answer
    const currentActivities = userAnswers?.activities || [];
    const response = currentActivities.find(
      (item) => item.page === pageData.id,
    );
    let updatedAnswers = response?.answer ? [...response.answer] : [];

    const existingStepIndex = updatedAnswers.findIndex(
      (a) => a.stepId === currentStep,
    );
    if (existingStepIndex !== -1) {
      updatedAnswers[existingStepIndex] = {
        stepId: currentStep,
        value: myAnswer,
      };
    } else {
      updatedAnswers.push({ stepId: currentStep, value: myAnswer });
    }

    dispatch(
      saveActivity({
        page: pageData.id,
        answer: updatedAnswers,
      }),
    );

    return false; // Prevent immediate navigation, wait for modal close
  };

  const handleNext = () => {
    setShowFeedback(false);
    dispatch(navigateNext());
  };

  const renderStep = () => {
    if (!pageData?.steps) return null;
    const step = pageData.steps[currentStep - 1];

    if (step.type === "question" && step.inputType === "bigTextBox") {
      return (
        <>
          <div className="d-flex gap-3 flex-column flex-md-row flex-md-nowrap align-items-start mt-4">
            <h2 className="text-blue fs-1 mb-0 flex-shrink-0 tot-question-text">
              Question 1:
            </h2>
            <div className="d-flex flex-column flex-grow-1 min-w-0 tot-question-text">
              <h2 className="text-gray fs-1 mb-2 ">{step.question}</h2>
            </div>
          </div>
          <BigTextBox
            handleChange={(e) => {
              setErrorMessage("");
              setMyAnswer(e.target.value);
            }}
            value={myAnswer}
          />
        </>
      );
    }

    if (step.type === "dropdownScenario") {
      return (
        <>
          <div className="d-flex justify-content-center">
            <h2 className="text-white bg-blue p-2 rounded fs-1 mb-0 flex-shrink-0 tot-question-text">
              Question 2
            </h2>
          </div>
          <div className="d-flex gap-3 flex-column flex-md-row flex-md-nowrap align-items-start mt-4">
            <div className="d-flex flex-column flex-grow-1 min-w-0 tot-question-text">
              <h2 className="text-gray fs-1 mb-2 fw-bold">{step.question}</h2>
            </div>
          </div>
          <div className="mt-4">
            <CustomDropDown
              options={step.options.map((opt) => opt.text)}
              value={myAnswer}
              onChange={(val) => {
                setErrorMessage("");
                setMyAnswer(val);
              }}
            />
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <>
      <QuestionBox extraStyle="bg-custom-blue">{renderStep()}</QuestionBox>
      {errorMessage && <div className="text-danger">{errorMessage}</div>}
      <StepIndicator totalSteps={pageData?.steps?.length || 0} />
      <div className="d-flex justify-content-center gap-96px mt-4 gap-4">
        <Button text="Prev" />
        <Button text="Next" customOnClick={saveUserInput} />
      </div>

      <TOTFeedbackModal show={showFeedback} onHide={handleNext}>
        <div className="text-center">
          <p className="text-blue">{feedbackText}</p>
        </div>
      </TOTFeedbackModal>
    </>
  );
}

export default Page2;
