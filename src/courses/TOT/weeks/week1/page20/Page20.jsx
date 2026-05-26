import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../components/Button";
import {
  selectPageData,
  navigateNext,
} from "@/store/navigationSlice";
import TOTFeedbackModal from "../../../components/TOTFeedbackModal";

import {
  userAnswer,
  saveActivity,
} from "@/store/userAnswersReducer";
import { adminData } from "@/store/adminReducer";
import QuestionBox from "../../../components/QuestionBox";
import ColoredTextField from "../../../components/ColoredTextField";
import "./page20.css";
import BigTextBox from "../../../components/BigTextBox";

function Page20() {
  const pageData = useSelector(selectPageData);
  const dispatch = useDispatch();
  const [answers, setAnswers] = useState([]); // State to hold answers
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const adminDatas = useSelector(adminData);
  const [showFeedback, setShowFeedback] = useState(false);
  const handleCloseFeedback = () => {
    setShowFeedback(false);
    dispatch(navigateNext()); // Navigate after closing the modal
  };
  const userAnswers = useSelector(userAnswer);

  useEffect(() => {
    if (!userAnswers) return;
    const response = userAnswers.activities?.find(
      (item) => item.page === pageData.id,
    );
    const answerCopy = adminDatas.isAdmin
      ? []
      : response?.answer
        ? [...response.answer]
        : [];
    setAnswers(answerCopy);
    return () => {};
  }, [userAnswers]);

  const saveUserInput = () => {
    if (adminDatas.isAdmin) return true;

    console.log(answers);

    if (answers.length < 2) {
      setErrorMessage("At least 2 values are required!");
      return false;
    }

    const emptyInputs = answers.filter((item) => item?.value?.trim() === "");
    if (emptyInputs.length > 0) {
      setErrorMessage(
        `Please fill out all inputs. ${emptyInputs.length} input(s) are missing.`,
      );
      return false;
    }

    setErrorMessage(""); // Clear error if input is valid

    const activityData = {
      page: pageData.id,
      answer: answers,
    };
    dispatch(saveActivity(activityData)); // Dispatch the saveActivity action

    // Show feedback modal instead of navigating immediately
    setShowFeedback(true);
    // return true;
  };

  const handleInputChange = (index, value) => {
    setErrorMessage("");
    // Update answers state with the new value
    setAnswers((prevAnswers) => {
      // Check if the answer already exists
      const existingAnswerIndex = prevAnswers.findIndex(
        (answer) => answer.index === index,
      );
      if (existingAnswerIndex > -1) {
        // Update existing answer
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[existingAnswerIndex] = {
          ...updatedAnswers[existingAnswerIndex],
          value,
        };
        return updatedAnswers;
      } else {
        // Add new answer
        return [...prevAnswers, { index, value }];
      }
    });
  };

  return (
    <>
      <QuestionBox extraMobileStyle={""} extraStyle={"bg-custom-blue"}>
        <div className="container">
          <div className="row justify-content-between align-items-start g-4">
            {/* Question heading */}
            <div className="d-flex gap-3 flex-column flex-md-row flex-md-nowrap align-items-start mt-5">
              <h2 className="text-blue fs-1 mb-0 flex-shrink-0 tot-question-text">
                Question:
              </h2>

              <div className="d-flex flex-column flex-grow-1 min-w-0 tot-question-text">
                <h2 className="text-gray fs-1 mb-3">{pageData.question}</h2>
              </div>
            </div>

            {/* Fields stack on mobile, row on desktop */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start w-100 gap-3">
              {pageData.fields.map((field, index) => (
                <div
                  key={index}
                  className="px-3 bg-white"
                  // style={{ minWidth: { md: "150px" } }}
                >
                  {/* Label */}
                  <p className="bg-gray text-white p-1 mt-1 d-inline-block fs-5 rounded-1">
                    {field.number}.
                  </p>

                  <BigTextBox
                    value={
                      answers.find((answer) => answer.index === index)?.value ||
                      ""
                    }
                    handleChange={(e) =>
                      handleInputChange(index, e.target.value)
                    }
                    // value={myAnswer}
                  />

                  {/* Expanding Textarea */}
                  {/* <div className="w-100">
                    <ColoredTextField
                      index={index}
                      color={field.textFieldColor}
                      value={
                        answers.find((answer) => answer.index === index)
                          ?.value || ""
                      }
                      handleChange={(e) =>
                        handleInputChange(index, e.target.value)
                      }
                      extraMobileStyles={"week-4-textarea"}
                    />
                  </div> */}
                </div>
              ))}
            </div>
          </div>
        </div>
      </QuestionBox>
      {errorMessage && <div className="text-danger">{errorMessage}</div>}
      <div className="d-flex justify-content-center gap-96px mt-4 gap-4">
        <Button text="Prev" />
        <Button text="Next" customOnClick={saveUserInput} />
      </div>

      <TOTFeedbackModal show={showFeedback} onHide={handleCloseFeedback}>
        <p className="text-blue mb-3">
          Gratitude increases emotional resilience.
        </p>
        <p className="text-blue">
          The more frequently you practice it, the more naturally your brain
          scans for positive experiences.
        </p>
      </TOTFeedbackModal>
    </>
  );
}

export default Page20;
