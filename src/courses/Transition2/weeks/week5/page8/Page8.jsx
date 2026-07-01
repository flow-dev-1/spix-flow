import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import Frame from "./components/Frame";
import SmartFrame from "./components/SmartFrame";
import "./page8.css";

function Page8() {
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
    return () => {};
  }, [userAnswers]);

  const saveUserInput = () => {
    setErrorMessage(""); // Clear error if input is valid
    if (adminDatas.isAdmin) return true;

    if (!Array.isArray(answers)) {
      setErrorMessage("Oops! All inputs must be filled out.");
      return false;
    }

    const stepData = answers.find((item) => item.stepId === currentStep);

    if (!stepData) {
      setErrorMessage("Oops! All inputs must be filled out.");
      return false;
    }

    if (currentStep === 1) {
      // Step 1 uses Frame component which stores value as a string
      if (
        !stepData.value ||
        typeof stepData.value !== "string" ||
        !stepData.value.trim()
      ) {
        setErrorMessage("Please answer the question");
        return false;
      }
    }
    if (currentStep === 2) {
      // Step 2 uses SmartFrame component which stores value as an object
      if (!stepData.value || typeof stepData.value !== "object") {
        setErrorMessage("Oops! All inputs must be filled out.");
        return false;
      }

      const values = Object.values(stepData.value);

      if (values.length < 5) {
        setErrorMessage("At least 5 values are required!");
        return false;
      }

      const emptyInputs = values.filter(
        (value) => !value || value.trim() === ""
      );
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

    switch (step.type) {
      case "question":
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

export default Page8;
