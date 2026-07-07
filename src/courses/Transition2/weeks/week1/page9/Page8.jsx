import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectPageData,
  selectCurrentStep,
} from "@/store/navigationSlice";
import {
  userAnswer,
  saveActivity,
} from "@/store/userAnswersReducer";
import { adminData } from "@/store/adminReducer";
import StepIndicator from "../../../components/StepIndicator";
import Button from "../../../components/Button";

import BigTextBox from "../../../components/BigTextBox";
import QuestionBox from "../../../components/QuestionBox";

function Page8() {
  const dispatch = useDispatch();
  const pageData = useSelector(selectPageData);
  const currentStep = useSelector(selectCurrentStep);
  const userAnswers = useSelector(userAnswer);
  const adminDatas = useSelector(adminData);

  const totalSteps = pageData?.steps?.length || 0;
  const step = pageData?.steps[currentStep - 1];

  const [errorMessage, setErrorMessage] = useState("");
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    if (!userAnswers || !pageData) return;
    const response = userAnswers?.activities?.find(
      (item) => item.page === pageData?.id
    );
    setAnswers(
      response?.answer && typeof response.answer === "object"
        ? response.answer
        : {}
    );
    return () => {};
  }, [userAnswers, pageData?.id]);

  const saveUserInput = () => {
    if (adminDatas.isAdmin) return true;

    if (step?.type === "scenario") {
      return true;
    }

    if (step?.type === "question") {
      const currentAnswer = answers[step.stepId] || "";

      if (!adminDatas.isAdmin && !currentAnswer.trim()) {
        setErrorMessage("Oops! Please enter a valid input!");
        return false;
      }
    }

    setErrorMessage("");

    dispatch(
      saveActivity({
        page: pageData?.id,
        answer: answers,
      })
    );

    return true;
  };

  const handleInputChange = (e) => {
    setErrorMessage("");
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [step.stepId]: e.target.value,
    }));
  };

  const renderStep = () => {
    if (!step) return <div>Invalid Step</div>;

    switch (step.type) {
      case "scenario":
        return (
          <QuestionBox extraStyle="bg-custom-blue">
            <div className="d-flex justify-content-center ">
              <h2 className="bg-blue text-white text-center rounded-2 px-5 py-1 fs-1 mb-0 flex-shrink-0">
                Scenario {step.scenarioNumber || Math.ceil(currentStep / 2)}
              </h2>
            </div>
            <div className="d-flex gap-3 flex-column flex-md-row flex-md-nowrap align-items-start mt-5 text-center">
              <div className="d-flex flex-column flex-grow-1 min-w-0 mb-5">
                <h2 className="text-gray fs-1 mb-2 ">{step.scenarioText}</h2>
              </div>
            </div>
          </QuestionBox>
        );

      case "question":
        return (
          <QuestionBox extraStyle="bg-custom-blue">
            <div className="d-flex gap-3 flex-column flex-md-row flex-md-nowrap align-items-start mt-5 text-center">
              <h2 className="text-blue fs-1 mb-0 flex-shrink-0">
                The Challenge:
              </h2>

              <div className="d-flex flex-column flex-grow-1 min-w-0 mb-5">
                <h2 className="text-gray fs-1 mb-2 ">{step.question}</h2>
              </div>
            </div>
            <BigTextBox
              handleChange={handleInputChange}
              value={answers[step.stepId] || ""}
            />
          </QuestionBox>
        );

      default:
        return <div>Unknown step type</div>;
    }
  };

  return (
    <>
      {renderStep()}
      {errorMessage && <div className="text-danger mt-3">{errorMessage}</div>}

      <StepIndicator totalSteps={totalSteps} />

      <div className="d-flex justify-content-center gap-96px mt-4 gap-4">
        <Button text="Prev" />
        <Button text="Next" customOnClick={saveUserInput} />
      </div>
    </>
  );
}

export default Page8;
