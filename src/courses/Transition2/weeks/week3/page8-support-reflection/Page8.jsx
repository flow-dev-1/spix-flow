import React, { useEffect, useState } from "react";
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

function Page8() {
  const dispatch = useDispatch();
  const pageData = useSelector(selectPageData);
  const adminDatas = useSelector(adminData);
  const userAnswers = useSelector(userAnswer);
  const [myAnswer, setMyAnswer] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!userAnswers) return;
    const response = userAnswers?.activities?.find(
      (item) => item.page === pageData.id
    );
    setMyAnswer(response?.answer ? response.answer : "");
  }, [userAnswers, pageData.id]);

  const handleInputChange = (event) => {
    setErrorMessage("");
    setMyAnswer(event.target.value);
  };

  const saveUserInput = () => {
    if (!adminDatas.isAdmin && !myAnswer.trim()) {
      setErrorMessage("Oops! Please rate yourself before moving on.");
      return false;
    }

    setErrorMessage("");
    if (adminDatas.isAdmin) return true;

    dispatch(
      saveActivity({
        page: pageData.id,
        answer: myAnswer,
      })
    );
    return true;
  };

  return (
    <>
      <QuestionBox extraStyle="bg-custom-blue">
        <div className="d-flex gap-3 flex-column flex-md-row flex-md-nowrap align-items-start mt-5 text-center">
          <h2 className="text-blue fs-1 mb-0 flex-shrink-0">Question:</h2>
          <div className="d-flex flex-column flex-grow-1 min-w-0 mb-4">
            <h2 className="text-gray fs-1 mb-2">{pageData.question}</h2>
          </div>
        </div>
        <BigTextBox handleChange={handleInputChange} value={myAnswer} />
      </QuestionBox>
      {errorMessage && <div className="text-danger">{errorMessage}</div>}
      <div className="d-flex justify-content-center gap-96px mt-4 gap-4">
        <Button text="Prev" />
        <Button text="Next" customOnClick={saveUserInput} />
      </div>
    </>
  );
}

export default Page8;
