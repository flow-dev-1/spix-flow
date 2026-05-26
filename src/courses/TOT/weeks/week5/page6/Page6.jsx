import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../components/Button";
import {
  selectPageData,
  selectCurrentStep,
} from "@/store/navigationSlice";
import StepIndicator from "../../../components/StepIndicator";
import QuestionBox from "../../../components/QuestionBox";
import {
  userAnswer,
  saveActivity,
} from "@/store/userAnswersReducer";
import { adminData } from "@/store/adminReducer";
import "./page4.css";
import Frame from "./components/Frame";

function Page4() {
  const pageData = useSelector(selectPageData);
  const currentStep = useSelector(selectCurrentStep);
  const totalSteps = pageData?.steps?.length || 0;
  const step = pageData?.steps[currentStep - 1];
  const dispatch = useDispatch();
  const [answers, setAnswers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const adminDatas = useSelector(adminData);
  const userAnswers = useSelector(userAnswer);

  // Load user answers (normalize them to always use `id`)
  useEffect(() => {
    if (!userAnswers) return;
    const response = userAnswers.activities?.find(
      (item) => item.page === pageData.id,
    );

    setAnswers(Array.isArray(response?.answer) ? response.answer : []);
  }, [userAnswers]);

  const saveUserInput = () => {
    if (adminDatas?.isAdmin) return true;
    if (currentStep === 1) return true;

    // Find answers for the current page
    const stepData = answers.find((item) => (item.id || item.stepId) === currentStep);
    if (!stepData) {
      setErrorMessage("Oops! All inputs must be filled out.");
      return false;
    }

    // Dynamically get all question types for this page
    const requiredFields = Array.isArray(step.question)
      ? step.question.map((q) => q.type)
      : [];

    // Check if all required fields are filled
    const missingFields = requiredFields.filter(
      (field) => !stepData[field] || stepData[field].trim() === "",
    );

    if (missingFields.length > 0) {
      setErrorMessage(
        `Please fill out all inputs. Missing: ${missingFields.join(", ")}.`,
      );
      return false;
    }

    setErrorMessage("");
    const activityData = {
      page: pageData.id,
      answer: answers,
    };

    dispatch(saveActivity(activityData));
    return true;
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
              <h2 className="text-white py-2 px-5 rounded d-inline-block text-start tot-week-2-question-text">
                In this next activity, I’d like you to reflect on your subject
                and think about one SEL skill that fits naturally with it.
                <br />
                <br />
                For example, for a subject like Social Studies, Social
                awareness, fairness and justice are SEL skills that are rooted
                in it.
              </h2>
              {/* <h2 className="text-white px-5 d-inline-block text-start tot-week-2-question-text">
                </h2> */}
            </div>
          </QuestionBox>
        );
      case "question":
        return (
          <Frame
            data={{
              step: step.stepId,
              questions: step.question,
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
      {renderStep()}
      {errorMessage && <div className="text-danger">{errorMessage}</div>}
      <StepIndicator totalSteps={totalSteps} />

      <div className="d-flex justify-content-center gap-96px mt-4 gap-4">
        <Button text="Prev" />
        <Button text="Next" customOnClick={saveUserInput} />
      </div>
    </>
  );
}

export default Page4;
