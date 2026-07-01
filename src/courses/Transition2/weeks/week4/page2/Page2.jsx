import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import QuestionBox from "../../../components/QuestionBox";
import BigTextBox from "../../../components/BigTextBox";
import Button from "../../../components/Button";
import { selectPageData } from "@/store/navigationSlice";
import { adminData } from "@/store/adminReducer";
import {
  userAnswer,
  saveActivity,
} from "@/store/userAnswersReducer";

function WeekFourPage2() {
  const dispatch = useDispatch();
  const pageData = useSelector(selectPageData);
  const adminDatas = useSelector(adminData);
  const userAnswers = useSelector(userAnswer);
  const [answer, setAnswer] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!userAnswers) return;
    const response = userAnswers?.activities?.find(
      (item) => item.page === pageData.id
    );
    setAnswer(response?.answer || "");
    return () => {};
  }, [userAnswers, pageData.id]);

  const saveUserInput = () => {
    if (!adminDatas.isAdmin && !answer.trim()) {
      setErrorMessage("Oops! Please enter your answer before moving on.");
      return false;
    }

    setErrorMessage("");
    if (adminDatas.isAdmin) return true;
    dispatch(
      saveActivity({
        page: pageData.id,
        answer,
      })
    );
    return true;
  };

  const handleInputChange = (e) => {
    setErrorMessage("");
    setAnswer(e.target.value);
  };

  return (
    <>
      <QuestionBox extraStyle="bg-custom-blue">
        <div className="d-flex gap-3 flex-column flex-md-row flex-md-nowrap align-items-start mt-5 text-center">
          <h2 className="text-blue fs-1 mb-0 flex-shrink-0">Question:</h2>

          <div className="d-flex flex-column flex-grow-1 min-w-0 mb-5">
            <h2 className="text-gray fs-1 mb-2 ">{pageData.question}</h2>
          </div>
        </div>
        <BigTextBox handleChange={handleInputChange} value={answer} />
      </QuestionBox>
      {errorMessage && <div className="text-danger">{errorMessage}</div>}
      <div className="d-flex justify-content-center gap-96px mt-4 gap-4">
        <Button text="Prev" />
        <Button text="Next" customOnClick={saveUserInput} />
      </div>
    </>
  );
}

export default WeekFourPage2;
