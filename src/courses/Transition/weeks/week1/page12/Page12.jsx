import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import QuestionBox from "../../../components/QuestionBox";
import BigTextBox from "../../../components/BigTextBox";
import Button from "../../../components/Button";
import {
  selectPageData,
  selectCurrentStep,
} from "@/store/navigationSlice";
import { adminData } from "@/store/adminReducer";
import {
  userAnswer,
  saveActivity,
} from "@/store/userAnswersReducer";
import ColoredSmallSquaredBoxFrame from "./components/ColoredSmallSquaredBoxFrame";
import StepIndicator from "../../../components/StepIndicator";

function Page12() {
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
    setAnswers(Array.isArray(response?.answer) ? response.answer : []);
  }, [userAnswers]);

  const saveUserInput = () => {
    if (adminDatas.isAdmin) return true;

    const stepData = answers.find((item) => item.stepId === currentStep);
    if (!stepData) {
      setErrorMessage("Oops! All inputs must be filled out.");
      return false;
    }

    const values = Object.values(stepData.value);
    if (values.length < 3) {
      setErrorMessage("At least 3 values are required!");
      return false;
    }

    const emptyInputs = values.filter((value) => value.trim() === "");
    if (emptyInputs.length > 0) {
      setErrorMessage(
        `Please fill out all inputs. ${emptyInputs.length} input(s) are missing.`
      );
      return false;
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
      case "multiColoredQuestionBoxes":
        return (
          <ColoredSmallSquaredBoxFrame
            data={{
              step: step.stepId,
              title: step.question,
              info: step.fields,
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

export default Page12;
