import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./page6.css";
import Button from "../../../components/Button";
import QuestionBox from "../../../components/QuestionBox";
import { selectPageData } from "@/store/navigationSlice";
import {
  userAnswer,
  saveActivity,
} from "@/store/userAnswersReducer";
import { adminData } from "@/store/adminReducer";

function Page6() {
  const pageData = useSelector(selectPageData);
  const dispatch = useDispatch();
  const [answers, setAnswers] = useState([]); // State to hold answers
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const adminDatas = useSelector(adminData);

  const userAnswers = useSelector(userAnswer);

  useEffect(() => {
    if (!userAnswers) return;
    const response = userAnswers.activities?.find(
      (item) => item.page === pageData.id
    );
    const answerCopy = response?.answer ? [...response.answer] : [];
    setAnswers(answerCopy);
    return () => {};
  }, [userAnswers]);

  const saveUserInput = () => {
    if (adminDatas.isAdmin) return true;
    if (answers.length < 5) {
      setErrorMessage("At least 5 values are required!");
      return false;
    }

    const emptyInputs = answers.filter((item) => item.value.trim() === "");

    if (emptyInputs.length > 0) {
      setErrorMessage(
        `Please fill out all inputs. ${emptyInputs?.length} input(s) are missing.`
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

  const handleInputChange = (index, value) => {
    setErrorMessage("");
    // Update answers state with the new value
    setAnswers((prevAnswers) => {
      // Check if the answer already exists
      const existingAnswerIndex = prevAnswers.findIndex(
        (answer) => answer.index === index
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
      <QuestionBox>
        <div className="d-flex gap-3 mb-md-3 flex-column flex-md-row">
          <h2 className="text-blue fs-1">Question:</h2>
          <h2 className="text-gray fs-1">{pageData.question}</h2>
        </div>

        <div className="input-container py-5 px-5">
          {[...Array(pageData.numberOfInputs || 5)].map((_, index) => (
            <div key={index}>
              <div className="d-flex gap-3 label-input-container">
                <p className="input-label">{index + 1}.</p>
                <input
                  type="text"
                  placeholder={
                    pageData.inputPlaceholder || "Type your answer here"
                  }
                  value={
                    answers.find((answer) => answer.index === index)?.value ||
                    ""
                  }
                  onChange={(e) => handleInputChange(index, e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </QuestionBox>
      {errorMessage && <div className="text-danger">{errorMessage}</div>}{" "}
      {/* Display error message */}
      <div className="d-flex justify-content-center gap-96px mt-4 gap-4">
        <Button text="Prev" />
        <Button text="Next" customOnClick={saveUserInput} />
      </div>
    </>
  );
}

export default Page6;
