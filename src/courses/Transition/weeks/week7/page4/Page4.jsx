import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import QuestionBox from "../../../components/QuestionBox";
import Frame from "./components/Frame";
import Button from "../../../components/Button";
import {
  selectPageData,
  selectCurrentStep,
} from "@/store/navigationSlice";
import StepIndicator from "../../../components/StepIndicator";
import MultiLineColoredSmallTextBox from "./components/MultiLineColoredSmallTextBox";
import ColoredSmallSquaredBoxFrame from "./components/ColoredSmallSquaredBoxFrame";
import ImageCheckBoxesFrame from "./components/ImageCheckBoxesFrame";
import ListQuestionFrame from "./components/ListQuestionFrame";
import {
  userAnswer,
  saveActivity,
} from "@/store/userAnswersReducer";
import { adminData } from "@/store/adminReducer";

function WeekSevenPage4() {
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

    if (!stepData || !stepData.value) {
      setErrorMessage("Oops! All inputs must be filled out.");
      return false;
    }

    if (currentStep === 3 || currentStep === 5) {
      dispatch(
        saveActivity({
          page: pageData.id,
          answer: answers,
        })
      );
      return true;
    }

    const valuesArray = Object.values(stepData.value);
    const emptyInputs = valuesArray.filter(
      (value) => !value || value?.trim() === ""
    );

    if (currentStep === 1 || currentStep === 6) {
      if (valuesArray.length < 5) {
        setErrorMessage("At least 5 answers are required!");
        return false;
      }
    } else if (currentStep === 2) {
      if (valuesArray.length < 3) {
        setErrorMessage("At least 3 answers are required!");
        return false;
      }
    } else if (currentStep === 4) {
      if (valuesArray.length < 6) {
        setErrorMessage("At least 6 answers are required!");
        return false;
      }
    }

    if (emptyInputs.length > 0) {
      setErrorMessage(
        `Please fill out all inputs. ${emptyInputs.length} input(s) are missing.`
      );
      return false;
    }

    setErrorMessage("");
    dispatch(
      saveActivity({
        page: pageData.id,
        answer: answers,
      })
    );
    return true;
  };

  // console.log(answers, "Answers")

  const renderStep = () => {
    // const step = pageData?.steps[currentStep - 1];
    // console.log(currentStep, step, "step")
    if (!step) return <div>Invalid Step</div>;

    switch (step.type) {
      case "listQuestion":
        return (
          <ListQuestionFrame
            data={{
              stepId: step?.stepId,
              question: step?.question,
              numberOfInputs: step?.numberOfInputs,
            }}
            setErrorMessage={setErrorMessage}
            answers={answers}
            setAnswers={setAnswers}
          />
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
      case "multiMultiColoredQuestionBoxes":
        return (
          <MultiLineColoredSmallTextBox
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
      case "checkBoxesWithImageAndTitle":
        return (
          <ImageCheckBoxesFrame
            data={{
              step: step.stepId,
              title: step.question,
              info: step.options,
            }}
            setErrorMessage={setErrorMessage}
            answers={answers}
            setAnswers={setAnswers}
          />
        );
      case "bigTextBox":
        return (
          <Frame
            data={{
              step: step.stepId,
              title: step.question,
              info: step,
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

export default WeekSevenPage4;
