import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectPageData,
  selectCurrentStep,
  setCurrentStep,
  navigateNext,
} from "@/store/navigationSlice";
import {
  userAnswer,
  saveActivity,
} from "@/store/userAnswersReducer";
import { adminData } from "@/store/adminReducer";
import StepIndicator from "../../../components/StepIndicator";
import Button from "../../../components/Button";
import QuestionBox from "../../../components/QuestionBox";

import CheckboxFrame from "./components/CheckboxFrame";
import TextInputFrame from "./components/TextInputFrame";
import "./page6.css";

function Page6() {
  const dispatch = useDispatch();
  const pageData = useSelector(selectPageData);
  const currentStep = useSelector(selectCurrentStep);
  const userAnswers = useSelector(userAnswer);
  const adminDatas = useSelector(adminData);

  const steps = pageData?.steps || [];
  const totalSteps = steps.length;
  const step = steps[currentStep - 1];
  const isWhyPage = pageData?.id === 6;

  const [checkboxAnswers, setCheckboxAnswers] = useState({});
  const [textAnswer, setTextAnswer] = useState("");
  const [sentenceAnswer, setSentenceAnswer] = useState({
    reason: "",
    identity: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleCheckboxAnswersChange = (nextAnswers) => {
    setCheckboxAnswers(nextAnswers);
    setErrorMessage("");

    if (adminDatas.isAdmin || isWhyPage) return;

    dispatch(
      saveActivity({
        page: pageData.id,
        answer: {
          checkboxAnswers: nextAnswers,
          textAnswer,
          sentenceAnswer,
        },
      })
    );
  };

  useEffect(() => {
    if (!userAnswers) return;
    const response = userAnswers.activities?.find(
      (item) => item.page === pageData.id
    );

    if (response?.answer) {
      const savedCheckboxAnswers = response.answer.checkboxAnswers || {};
      if (isWhyPage) {
        const selectedIndex = Object.keys(savedCheckboxAnswers).find(
          (key) => savedCheckboxAnswers[key]
        );
        setCheckboxAnswers(
          selectedIndex === undefined ? {} : { [selectedIndex]: true }
        );
      } else {
        setCheckboxAnswers(savedCheckboxAnswers);
      }
      setTextAnswer(response.answer.textAnswer || "");
      setSentenceAnswer(
        response.answer.sentenceAnswer &&
          typeof response.answer.sentenceAnswer === "object"
          ? {
              reason: response.answer.sentenceAnswer.reason || "",
              identity: response.answer.sentenceAnswer.identity || "",
            }
          : {
              reason: "",
              identity: "",
            }
      );
    }
  }, [userAnswers, pageData.id, isWhyPage]);

  const saveUserInput = () => {
    if (adminDatas.isAdmin) return true;

    // Validation for step 1 (checkbox)
    if (currentStep === 1) {
      const selectedIndexes = Object.keys(checkboxAnswers).filter(
        (key) => checkboxAnswers[key]
      );
      const selectedIndex = selectedIndexes[0];
      const selectedOption = step?.options?.[Number(selectedIndex)];

      if (selectedIndex === undefined) {
        setErrorMessage(
          isWhyPage
            ? "Oops! Please select one option before moving on."
            : "Oops! Please select at least one option."
        );
        return false;
      }

      if (!isWhyPage && selectedIndexes.length < 3) {
        setErrorMessage("Oops! Please select at least 3 choices before moving on.");
        return false;
      }

      if (isWhyPage && selectedOption !== "Others") {
        dispatch(
          saveActivity({
            page: pageData.id,
            answer: {
              checkboxAnswers,
              textAnswer: "",
            },
          })
        );
        dispatch(setCurrentStep(totalSteps));
        dispatch(navigateNext());
        return false;
      }

      return true;
    }

    if (currentStep === 2) {
      if (!textAnswer.trim()) {
        setErrorMessage(
          isWhyPage
            ? "Oops! Please type the other thing before moving on."
            : "Oops! Please enter your reason before moving on."
        );
        return false;
      }
    }

    if (currentStep === 3) {
      const hasReason = sentenceAnswer.reason.trim();
      const hasIdentity = sentenceAnswer.identity.trim();

      if (!hasReason && !hasIdentity) {
        setErrorMessage(
          "Oops! Please complete both blanks in the sentence before moving on."
        );
        return false;
      }

      if (!hasReason) {
        setErrorMessage(
          "Oops! Please fill in why you are choosing higher education or further training."
        );
        return false;
      }

      if (!hasIdentity) {
        setErrorMessage(
          "Oops! Please fill in the kind of person you want to become."
        );
        return false;
      }
    }

    setErrorMessage("");

    dispatch(
      saveActivity({
        page: pageData.id,
        answer: {
          checkboxAnswers,
          textAnswer,
          sentenceAnswer,
        },
      })
    );

    return true;
  };

  const renderStep = () => {
    if (!step) return <div>Invalid Step</div>;

    const handleSentenceChange = (field, value) => {
      setSentenceAnswer((prevAnswer) => ({
        ...prevAnswer,
        [field]: value,
      }));
      setErrorMessage("");
    };

    switch (step.type) {
      case "checkbox":
        return (
          <CheckboxFrame
            step={step}
            checkboxAnswers={checkboxAnswers}
            setCheckboxAnswers={handleCheckboxAnswersChange}
            setErrorMessage={setErrorMessage}
            singleSelect={isWhyPage}
          />
        );

      case "question":
        return (
          <TextInputFrame
            step={step}
            textAnswer={textAnswer}
            setTextAnswer={setTextAnswer}
            setErrorMessage={setErrorMessage}
          />
        );

      case "sentenceCompletion":
        return (
          <QuestionBox>
            <div className="d-flex gap-3 flex-column flex-md-row flex-md-nowrap align-items-start mt-5">
              <h2 className="text-blue fs-1 mb-0 flex-shrink-0">Question:</h2>
              <div className="d-flex flex-column flex-grow-1 min-w-0 text-gray">
                <h2 className="text-gray mb-4 transition2-sentence-copy">
                  "Complete this sentence.
                </h2>
                <p className="mb-2 transition2-sentence-copy">
                  I am choosing to pursue higher education/further training
                  because
                </p>
                <div className="d-flex align-items-end mb-3">
                  <label
                    className="flex-grow-1 d-block"
                    style={{
                      borderBottom: "3px dashed #5b616a",
                      minHeight: "56px",
                    }}
                  >
                    <input
                      aria-label="Reason for choosing higher education or further training"
                      className="w-100 bg-transparent text-gray px-2 py-1 transition2-sentence-input"
                      style={{
                        border: "none",
                        outline: "none",
                      }}
                      value={sentenceAnswer.reason}
                      onChange={(e) =>
                        handleSentenceChange("reason", e.target.value)
                      }
                    />
                  </label>
                  <span className="transition2-sentence-copy">,</span>
                </div>
                <p className="mb-2 transition2-sentence-copy">
                  and the person I want to become is someone who
                </p>
                <div className="d-flex align-items-end mb-0">
                  <label
                    className="flex-grow-1 d-block"
                    style={{
                      borderBottom: "3px dashed #5b616a",
                      minHeight: "56px",
                    }}
                  >
                    <input
                      aria-label="The person I want to become"
                      className="w-100 bg-transparent text-gray px-2 py-1 transition2-sentence-input"
                      style={{
                        border: "none",
                        outline: "none",
                      }}
                      value={sentenceAnswer.identity}
                      onChange={(e) =>
                        handleSentenceChange("identity", e.target.value)
                      }
                    />
                  </label>
                  <span className="transition2-sentence-copy">."</span>
                </div>
              </div>
            </div>
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

export default Page6;
