import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import QuestionBox from "../../../components/QuestionBox";
import Frame from "./components/Frame";
import SmartFrame from "./components/SmartFrame";
import MultiStarFrame from "./components/MultiStarFrame";
import SingleWhiteStarFrame from "./components/SingleWhiteStarFrame";
import Button from "../../../components/Button";
import {
  selectPageData,
  selectCurrentStep,
} from "@/store/navigationSlice";
import StepIndicator from "../../../components/StepIndicator";
import {
  userAnswer,
  saveActivity,
} from "@/store/userAnswersReducer";
import { adminData } from "@/store/adminReducer";

function WeekEightPage6() {
  const dispatch = useDispatch(); // Initialize dispatch
  const pageData = useSelector(selectPageData);
  const currentStep = useSelector(selectCurrentStep);
  const totalSteps = pageData?.steps?.length || 0;
  const [answers, setAnswers] = useState([]); // State to hold answers
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const step = pageData?.steps[currentStep - 1];
  const userAnswers = useSelector(userAnswer);
  const adminDatas = useSelector(adminData);
  // console.log(userAnswers)

  useEffect(() => {
    if (!userAnswers) return;
    const response = userAnswers.activities?.find(
      (item) => item.page === pageData.id
    );
    setAnswers(response?.answer ? response.answer : []);
    return () => {};
  }, [userAnswers]);

  const saveUserInput = () => {
    setErrorMessage(""); // Clear error if input is valid
    if (adminDatas.isAdmin) return true;

    const stepData = answers.find((item) => item.stepId === currentStep);

    if (!stepData) {
      setErrorMessage("Oops! All inputs must be filled out.");
      return false;
    }

    if (currentStep !== 3) {
      const values = Object.values(stepData.value);

      if (values.length < 5) {
        setErrorMessage("At least 5 values are required!");
        return false;
      }

      const emptyInputs = values.filter((value) => value.trim() === "");
      if (emptyInputs.length > 0) {
        setErrorMessage(
          `Please fill out all inputs. ${emptyInputs.length} input(s) are missing.`
        );
        return false;
      }
    }

    setErrorMessage(""); // Clear error if input is valid
    const activityData = {
      page: pageData.id,
      answer: answers,
    };
    dispatch(saveActivity(activityData)); // Dispatch the saveActivity action

    return true;
  };

  // console.log(answers, "Answers")

  const renderStep = () => {
    // const step = pageData?.steps[currentStep - 1];
    // console.log(currentStep, step, "step")
    if (!step) return <div>Invalid Step</div>;

    console.log(step, "Step here o");

    switch (step.type) {
      case "instruction":
        return (
          <QuestionBox>
            <div className="text-center mb-5">
              <h2 className="text-white bg-blue p-4 fs-1 rounded d-inline">
                {step.title}
              </h2>
            </div>
            <div className="d-flex gap-2">
              <h2 className="text-blue fs-1">Instructions: </h2>
              <h2 className="text-gray fs-1">{step.instructions}</h2>
            </div>
          </QuestionBox>
        );
      case "hearts":
        return (
          <Frame
            data={{
              step: step.stepId,
              question: step.question,
              expectedAnswers: step.answers,
              config: step.config,
            }}
            setErrorMessage={setErrorMessage}
            answers={answers}
            setAnswers={setAnswers}
          />
        );
      case "star":
        return (
          <MultiStarFrame
            data={{
              step: step.stepId,
              question: step.question,
              expectedAnswers: step.answers,
              config: step.config,
            }}
            setErrorMessage={setErrorMessage}
            answers={answers}
            setAnswers={setAnswers}
          />
        );
      case "singleStar":
        return (
          <SingleWhiteStarFrame
            data={{
              step: step.stepId,
              question: step.question,
            }}
            setErrorMessage={setErrorMessage}
            answers={answers}
            setAnswers={setAnswers}
          />
        );
      case "smart":
        return (
          <SmartFrame
            data={{
              step: step.stepId,
              question: step.question,
              config: step.config,
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
      {errorMessage && <div className="text-danger">{errorMessage}</div>}{" "}
      {/* Display error message */}
      <StepIndicator totalSteps={totalSteps} />
      <div className="d-flex justify-content-center gap-96px mt-4 gap-4">
        <Button text="Prev" />
        <Button text="Next" customOnClick={saveUserInput} />
      </div>
    </>
  );
}

export default WeekEightPage6;
