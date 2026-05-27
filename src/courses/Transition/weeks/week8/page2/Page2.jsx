import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PaddlessQuestionBox from "../../../components/PaddlessQuestionBox";
import Button from "../../../components/Button";
import footballImage from "@/assets/footballers.png";
import checkedImage from "@/assets/checkedbox.png";
import uncheckedImage from "@/assets/uncheckedBox.png";
import { selectPageData } from "@/store/navigationSlice";
import { adminData } from "@/store/adminReducer";
import {
  userAnswer,
  saveActivity,
} from "@/store/userAnswersReducer";

function WeekEightPage2() {
  const dispatch = useDispatch();
  const pageData = useSelector(selectPageData);
  const adminDatas = useSelector(adminData);
  const userAnswers = useSelector(userAnswer);
  const [myAnswer, setMyAnswer] = useState(userAnswers);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    if (!userAnswers) return;
    const response = userAnswers?.activities?.find(
      (item) => item.page === pageData.id
    );
    setMyAnswer(response?.answer ? response.answer : "");
    setSelectedOption(response?.answer ? response.answer : "");
    return () => {};
  }, [userAnswers]);

  const handleOptionChange = (e) => {
    setErrorMessage("");
    setSelectedOption(e.target.value);
  };

  const saveUserInput = () => {
    if (adminDatas.isAdmin) return true;

    if (!selectedOption) {
      setErrorMessage("Please select an option to continue!");
      return false;
    }

    setErrorMessage("");
    dispatch(
      saveActivity({
        page: pageData.id,
        answer: selectedOption,
      })
    );
    return true;
  };

  return (
    <>
      <PaddlessQuestionBox className="transition-week8-page2-question-box">
        <div className="d-flex flex-column-reverse flex-md-row transition-week8-page2-layout">
          {/* Form Section */}
          <div className="transition-week8-page2-form-col">
            <form className="d-flex gap-2 flex-column m-2 transition-week8-page2-form">
              <h2 className="text-blue fs-1">Question:</h2>
              <div className="d-flex flex-column align-items-left transition-week8-page2-content">
                <h3 className="fs-1">{pageData.question}</h3>
                <div className="transition-week8-page2-options">
                  {pageData.options.map((option, index) => {
                    const optionKey = Object.keys(option);
                    const optionID = option[optionKey[0]];
                    const optionText = option[optionKey[1]];
                    const isChecked = selectedOption === optionID;
                    return (
                      <div
                        key={index}
                        className="d-flex gap-2 align-items-center mt-5 mb-2 mx-3 pt-md-5 transition-week8-page2-option"
                      >
                        <input
                          type="radio"
                          id={optionID}
                          name="optionID"
                          value={optionID}
                          checked={isChecked}
                          onChange={handleOptionChange}
                          style={{ display: "none" }}
                        />
                        <img
                          src={isChecked ? checkedImage : uncheckedImage}
                          alt={optionKey}
                          style={{ width: 40, height: 40, cursor: "pointer" }}
                          onClick={() => {
                            setErrorMessage("");
                            setSelectedOption(optionID);
                          }}
                        />
                        <label htmlFor={optionID} className="fs-4 fs-md-2">
                          {optionText}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </form>
          </div>

          {/* Image Section */}
          <div className="flex-grow-1">
            <img
              src={footballImage}
              alt="Football Players"
              style={{
                width: "100%",
                height: "100%",
                // objectFit: "contain",
              }}
            />
          </div>
        </div>
      </PaddlessQuestionBox>

      {errorMessage && <div className="text-danger">{errorMessage}</div>}
      <div className="d-flex justify-content-center gap-96px mt-4 gap-4">
        <Button text="Prev" />
        <Button text="Next" customOnClick={saveUserInput} />
      </div>
    </>
  );
}

export default WeekEightPage2;
