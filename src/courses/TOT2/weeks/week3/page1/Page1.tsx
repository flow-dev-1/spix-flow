import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import QuestionBox from "../../../components/QuestionBox";
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
import checkedImage from "@/assets/checkedbox.png";
import uncheckedImage from "@/assets/uncheckedBox.png";

function WeekThreePage1() {
  const dispatch = useDispatch();
  const pageData = useSelector(selectPageData);
  const adminDatas = useSelector(adminData);
  const userAnswers = useSelector(userAnswer);

  const [selectedOption, setSelectedOption] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const handleCloseFeedback = () => {
    setShowFeedback(false);
    dispatch(navigateNext()); // Navigate after closing the modal
  };

  const isPreAssessment = false;

  // Load saved answer
  useEffect(() => {
    if (!userAnswers?.activities || !pageData?.id) return;

    const saved = userAnswers.activities.find(
      (item) => item.page === pageData.id,
    );

    if (saved?.answer) {
      setSelectedOption(saved.answer);
    }
  }, [userAnswers, pageData?.id]);

  const handleOptionClick = (optionKey) => {
    setSelectedOption(optionKey);
    setErrorMessage("");
  };

  const saveUserInput = () => {
    if (adminDatas.isAdmin) return true;

    if (!selectedOption) {
      setErrorMessage("Please select an option before continuing.");
      return false;
    }

    dispatch(
      saveActivity({
        page: pageData.id,
        answer: selectedOption,
      }),
    );

    // Show feedback modal instead of navigating immediately
    setShowFeedback(true);
    // return true;
  };

  return (
    <>
      <QuestionBox extraStyle="bg-custom-blue">
        <div>
          <div className="text-center mb-5 mt-4 mt-md-0">
            <h2 className="text-white bg-blue py-2 px-4 fs-2 font-bold rounded-3 d-inline display-4 text-center tot-week-2-question-text fw-bold">
              Question
            </h2>
          </div>
          <div className="d-flex gap-2 flex-column flex-md-row">
            <h2 className="text-gray fs-3 fs-md-1 tot-week-2-question-text text-center">
              {pageData.question}
            </h2>
          </div>

          {pageData.options.map((option, index) => {
            // Use option.id for the key (A, B, C, D) and option.text for the display text
            const optionKey = option.id;
            const optionText = option.text;
            const isChecked = selectedOption === optionKey;
            const inputId = `${pageData.id}-${optionKey}`;

            return (
              <div
                key={index}
                className="ms-7 ms-md-5 d-flex gap-2 mb-2 align-md-items-center ps-4"
                onClick={() => handleOptionClick(optionKey)}
                style={{ cursor: "pointer" }}
              >
                <input
                  type="radio"
                  id={inputId}
                  name={`question-${pageData.id}`}
                  value={optionKey}
                  checked={isChecked}
                  onChange={() => handleOptionClick(optionKey)}
                  style={{ display: "none" }}
                />

                <img
                  src={isChecked ? checkedImage : uncheckedImage}
                  alt={`Option ${optionKey}`}
                  style={{ width: 20, height: 20 }}
                />

                <label
                  htmlFor={inputId}
                  className={`${isPreAssessment ? "text-white" : ""}`}
                  style={{ cursor: "pointer" }}
                >
                  {`${optionKey}. ${optionText}`}
                </label>
              </div>
            );
          })}
        </div>
      </QuestionBox>

      {errorMessage && (
        <div className="text-danger mt-2 ms-7 ms-md-5">{errorMessage}</div>
      )}

      <div className="d-flex justify-content-center mt-4 gap-4">
        {/* <Button text="Prev" /> */}
        <Button text="Next" customOnClick={saveUserInput} />
      </div>

      <TOTFeedbackModal show={showFeedback} onHide={handleCloseFeedback}>
        <p className="text-blue mb-3"> There is no single correct answer. </p>
        <p className="text-blue">
          However, inclusive teaching often begins by considering learners
          first, and then designing lessons around their needs.
        </p>
      </TOTFeedbackModal>
    </>
  );
}

export default WeekThreePage1;
