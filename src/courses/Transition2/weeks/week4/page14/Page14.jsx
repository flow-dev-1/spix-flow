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
import QuestionBox from "../../../components/QuestionBox";
import checkedImage from "@/assets/checkedbox.png";
import uncheckedImage from "@/assets/uncheckedBox.png";

import CheckboxFrame from "./components/CheckboxFrame";
import TextInputFrame from "./components/TextInputFrame";
import "./page14.css";

function Page14() {
  const dispatch = useDispatch();
  const pageData = useSelector(selectPageData);
  const currentStep = useSelector(selectCurrentStep);
  const userAnswers = useSelector(userAnswer);
  const adminDatas = useSelector(adminData);

  const totalSteps = pageData?.steps?.length || 0;
  const step = pageData?.steps[currentStep - 1];

  const [checkboxAnswers, setCheckboxAnswers] = useState({});
  const [textAnswers, setTextAnswers] = useState({});
  const [choiceAnswers, setChoiceAnswers] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  // Get the current step's text answer
  const currentTextAnswer = textAnswers[currentStep] || "";

  // Helper to update this step's text answer
  const setCurrentTextAnswer = (value) => {
    setTextAnswers((prev) => ({
      ...prev,
      [currentStep]: value,
    }));
  };

  useEffect(() => {
    if (!userAnswers) return;
    const response = userAnswers.activities?.find(
      (item) => item.page === pageData.id
    );

    if (response?.answer) {
      setCheckboxAnswers(response.answer.checkboxAnswers || {});
      setTextAnswers(response.answer.textAnswers || {});
      setChoiceAnswers(response.answer.choiceAnswers || {});
    }
  }, [userAnswers, pageData.id]);

  const saveUserInput = () => {
    if (adminDatas.isAdmin) return true;

    if (step?.type === "choice" && choiceAnswers[currentStep] === undefined) {
      setErrorMessage("Oops! Please choose an option to proceed.");
      return false;
    }

    if (step?.type === "checkbox") {
      const hasSelection = Object.values(checkboxAnswers).some((val) => val);
      if (!hasSelection) {
        setErrorMessage("Oops! Please select at least one option!");
        return false;
      }
    }

    if (step?.type === "question") {
      if (!currentTextAnswer.trim()) {
        setErrorMessage("Oops! Please enter a valid input!");
        return false;
      }
    }

    setErrorMessage("");

    dispatch(
      saveActivity({
        page: pageData.id,
        answer: {
          checkboxAnswers,
          textAnswers,
          choiceAnswers,
        },
      })
    );

    return true;
  };

  // Check if "Others" option is selected
  // const isOthersSelected = () => {
  //   if (currentStep !== 1) return false;
  //   const othersIndex = step?.options?.findIndex(
  //     (option) => option.toLowerCase() === "others"
  //   );
  //   return othersIndex !== -1 && checkboxAnswers[othersIndex];
  // };

  const renderStep = () => {
    if (!step) return <div>Invalid Step</div>;

    switch (step.type) {
      case "choice":
        return (
          <QuestionBox extraStyle="bg-custom-blue">
            <div className="transition2-week4-page14-choice-content">
              <div className="d-flex gap-3 flex-column flex-md-row flex-md-nowrap align-items-start text-center">
                <h2 className="text-blue fs-1 mb-0 flex-shrink-0">
                  Question:
                </h2>
                <div className="d-flex flex-column flex-grow-1 min-w-0">
                  <h2 className="text-gray fs-1 mb-2">{step.question}</h2>
                </div>
              </div>

              <div className="transition2-week4-page14-choice-options">
                {step.options?.map((option, index) => (
                  <button
                    key={`${option}-${index}`}
                    type="button"
                    className="transition2-week4-page14-choice-option"
                    onClick={() => {
                      setErrorMessage("");
                      setChoiceAnswers((prev) => ({
                        ...prev,
                        [currentStep]: index,
                      }));
                    }}
                  >
                    <img
                      src={
                        choiceAnswers[currentStep] === index
                          ? checkedImage
                          : uncheckedImage
                      }
                      alt=""
                      className="transition2-week4-page14-choice-checkbox"
                    />
                    <span>
                      {String.fromCharCode(65 + index)}. {option}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </QuestionBox>
        );

      case "checkbox":
        return (
          <CheckboxFrame
            step={step}
            checkboxAnswers={checkboxAnswers}
            setCheckboxAnswers={setCheckboxAnswers}
            setErrorMessage={setErrorMessage}
          />
        );

      case "question":
        return (
          <TextInputFrame
            step={step}
            textAnswer={currentTextAnswer}
            setTextAnswer={setCurrentTextAnswer}
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
      {errorMessage && <div className="text-danger mt-3">{errorMessage}</div>}

      <StepIndicator totalSteps={totalSteps} />

      <div className="d-flex justify-content-center gap-96px mt-4 gap-4">
        <Button text="Prev" />
        <Button text="Next" customOnClick={saveUserInput} />
      </div>
    </>
  );
}

export default Page14;
