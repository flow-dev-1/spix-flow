import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import QuestionBox from "../../../components/QuestionBox";
import BigTextBox from "../../../components/BigTextBox";
import Button from "../../../components/Button";
import TOTFeedbackModal from "../../../components/TOTFeedbackModal";
import {
  selectPageData,
  navigateNext,
} from "@/store/navigationSlice";
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
  const [myAnswer, setMyAnswer] = useState(userAnswers);
  const [errorMessage, setErrorMessage] = useState("");
    const [showFeedback, setShowFeedback] = useState(false);
    const handleCloseFeedback = () => {
      setShowFeedback(false);
      dispatch(navigateNext()); // Navigate after closing the modal
    };


  useEffect(() => {
    if (!userAnswers) return;
    const response = userAnswers?.activities?.find(
      (item) => item.page === pageData.id
    );
    setMyAnswer(response?.answer ? response.answer : "");
    return () => {};
  }, [userAnswers]);

  const saveUserInput = () => {
    if (!adminDatas.isAdmin && !myAnswer) {
      setErrorMessage("Oops! Please enter a valid input!");
      return false;
    }

    setErrorMessage(""); // Clear error if input is valid
    // Allow flow admin to proceed without input but do not dispatch answer
    if (adminDatas.isAdmin) return true;
    dispatch(
      saveActivity({
        page: pageData.id,
        answer: myAnswer,
      }),
    );

    // Show feedback modal instead of navigating immediately
    setShowFeedback(true);
    // return true;
  };

  const handleInputChange = (e) => {
    setErrorMessage("");
    setMyAnswer(e.target.value);
  };

  return (
    <>
      <QuestionBox extraStyle="bg-custom-blue">
        <div className="d-flex gap-3 flex-column flex-md-row flex-md-nowrap align-items-start mt-4">
          <h2 className="text-blue fs-1 mb-0 flex-shrink-0 tot-question-text">
            Question:
          </h2>

          <div className="d-flex flex-column flex-grow-1 min-w-0 tot-question-text">
            <h2 className="text-gray fs-1 mb-2 ">{pageData.question} </h2>
          </div>
        </div>
        <BigTextBox handleChange={handleInputChange} value={myAnswer} />
      </QuestionBox>
      {errorMessage && <div className="text-danger">{errorMessage}</div>}
      <div className="d-flex justify-content-center gap-96px mt-4 gap-4">
        <Button text="Prev" />
        <Button text="Next" customOnClick={saveUserInput} />
      </div>

      <TOTFeedbackModal show={showFeedback} onHide={handleCloseFeedback}>
        <p className="text-blue mb-3">Thank you for sharing!</p>
        <p className="text-blue">
          Teachers often associate inclusion with words like fairness,
          diversity, support, and belonging. Throughout this course, we will
          explore what inclusion truly means and how it can be practiced
          effectively in real classrooms
        </p>
      </TOTFeedbackModal>
    </>
  );
}

export default Page4;
