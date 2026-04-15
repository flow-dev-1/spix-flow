import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../components/Button";
import { selectPageData } from "@/store/navigationSlice";
import {
  userAnswer,
  saveActivity,
} from "@/store/userAnswersReducer";
import { adminData } from "@/store/adminReducer";
import Frame from "./components/Frame";

function Page6() {
  const pageData = useSelector(selectPageData);
  const dispatch = useDispatch();
  const [answers, setAnswers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const adminDatas = useSelector(adminData);
  const userAnswers = useSelector(userAnswer);

  // Load user answers (normalize them to always use `id`)
  useEffect(() => {
    if (!userAnswers) return;
    const response = userAnswers.activities?.find(
      (item) => item.page === pageData.id
    );

    if (!Array.isArray(response?.answer)) {
      setAnswers([]);
      return;
    }

    // Normalize any legacy data that might use stepId instead of id
    const normalized = response.answer.map((item) =>
      item.id
        ? item
        : item.stepId
        ? { ...item, id: item.stepId }
        : { ...item, id: pageData.id }
    );

    setAnswers(normalized);
  }, [userAnswers, pageData.id]);

  const saveUserInput = () => {
    if (adminDatas?.isAdmin) return true;

    // Find answers for the current page
    const stepData = answers.find((item) => item.id === pageData.id);

    if (!stepData) {
      setErrorMessage("Oops! All inputs must be filled out.");
      return false;
    }

    // Dynamically get all question types for this page
    const requiredFields = Array.isArray(pageData.questions)
      ? pageData.questions.map((q) => q.type)
      : [];

    // Check if all required fields are filled
    const missingFields = requiredFields.filter(
      (field) => !stepData[field] || stepData[field].trim() === ""
    );

    if (missingFields.length > 0) {
      setErrorMessage(
        `Please fill out all inputs. Missing: ${missingFields.join(", ")}.`
      );
      return false;
    }

    setErrorMessage("");
    const activityData = {
      page: pageData.id,
      answer: answers,
    };

    dispatch(saveActivity(activityData));
    return true;
  };

  return (
    <>
      <Frame
        data={{
          step: pageData.id,
          questions: pageData.questions,
          question: pageData.question,
        }}
        setErrorMessage={setErrorMessage}
        answers={answers}
        setAnswers={setAnswers}
      />
      {errorMessage && <div className="text-danger">{errorMessage}</div>}
      <div className="d-flex justify-content-center gap-96px mt-4 gap-4">
        <Button text="Prev" />
        <Button text="Next" customOnClick={saveUserInput} />
      </div>
    </>
  );
}

export default Page6;
