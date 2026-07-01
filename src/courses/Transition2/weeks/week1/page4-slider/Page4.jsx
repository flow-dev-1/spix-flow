import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import QuestionBox from "../../../components/QuestionBox";
import ProgressBar from "../../../components/PogressBar";
import Button from "../../../components/Button";
import { selectPageData } from "@/store/navigationSlice";
import { adminData } from "@/store/adminReducer";
import {
  userAnswer,
  saveActivity,
} from "@/store/userAnswersReducer";

function Page4() {
  const dispatch = useDispatch();
  const pageData = useSelector(selectPageData);
  const adminDatas = useSelector(adminData);
  const userAnswers = useSelector(userAnswer);
  const [myAnswer, setMyAnswer] = useState(null);
  const [hasSelectedValue, setHasSelectedValue] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!userAnswers) return;

    const response = userAnswers?.activities?.find(
      (item) => item.page === pageData.id
    );
    if (response?.answer) {
      setMyAnswer(response.answer);
      setHasSelectedValue(true);
    }
  }, [userAnswers, pageData.id]);

  const saveUserInput = () => {
    if (!adminDatas.isAdmin && !hasSelectedValue) {
      setErrorMessage("Oops! Please select a value!");
      return false;
    }

    setErrorMessage("");
    dispatch(
      saveActivity({
        page: pageData.id,
        answer: myAnswer,
      })
    );
    return true;
  };

  const handleInputChange = (e) => {
    setErrorMessage("");
    setHasSelectedValue(true);
    setMyAnswer(e.target.value);
  };

  return (
    <>
      <QuestionBox>
        <div className="d-flex gap-3 align-center-lg-custom flex-column flex-md-row">
          <h2 className="text-blue fs-1">Question:</h2>
          <div>
            <h2 className="text-gray fs-1">{pageData.question}</h2>
            <h2 className="text-gray fs-1">1 = Not nervous at all.</h2>
            <h2 className="text-gray fs-1">5 = Very nervous</h2>
          </div>
        </div>
        <ProgressBar
          handleChange={handleInputChange}
          value={myAnswer}
          min={pageData.progressBarConfig?.low}
          max={pageData.progressBarConfig?.max}
          step={pageData.progressBarConfig?.step}
          labels={[1, 3, 5]}
        />
      </QuestionBox>
      {errorMessage && <div className="text-danger">{errorMessage}</div>}
      <div className="d-flex justify-content-center gap-96px mt-4 gap-4">
        <Button text="Prev" />
        <Button text="Next" customOnClick={saveUserInput} />
      </div>
    </>
  );
}

export default Page4;
