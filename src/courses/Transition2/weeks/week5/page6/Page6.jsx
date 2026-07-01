import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Button from "../../../components/Button";
import { selectPageData } from "@/store/navigationSlice";
import {
  userAnswer,
  saveActivity,
} from "@/store/userAnswersReducer";
import { adminData } from "@/store/adminReducer";
import SmartFrame from "./component/SmartFrame";
import "../page8/page8.css";

function Page6() {
  const dispatch = useDispatch(); // Initialize dispatch
  const pageData = useSelector(selectPageData);
  const [answers, setAnswers] = useState([]); // State to hold answers
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
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

    const stepData = answers.find((item) => item.stepId === pageData.id);
    if (!stepData?.value) {
      setErrorMessage("Oops! All inputs must be filled out.");
      return false;
    }

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

    setErrorMessage(""); // Clear error if input is valid
    const activityData = {
      page: pageData.id,
      answer: answers,
    };
    dispatch(saveActivity(activityData)); // Dispatch the saveActivity action

    return true;
  };

  return (
    <>
      <SmartFrame
        data={{
          step: pageData.id,
          question: pageData.question,
          config: pageData.config,
        }}
        setErrorMessage={setErrorMessage}
        answers={answers}
        setAnswers={setAnswers}
      />
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
