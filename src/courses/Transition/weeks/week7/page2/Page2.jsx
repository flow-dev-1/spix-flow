import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import QuestionBox from "../../../components/QuestionBox";
import Button from "../../../components/Button";
import checkedImage from "@/assets/checkedbox.png";
import uncheckedImage from "@/assets/uncheckedBox.png";
import { selectPageData } from "@/store/navigationSlice";
import { adminData } from "@/store/adminReducer";
import {
  userAnswer,
  saveActivity,
} from "@/store/userAnswersReducer";

function Page2() {
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
    const savedAnswer = response?.answer ? response.answer : "";
    setMyAnswer(savedAnswer);
    setSelectedOption(savedAnswer); // Also set the selected option
  }, [userAnswers]);

  const handleOptionChange = (e) => {
    setErrorMessage("");
    const value = e.target.value;
    setSelectedOption(value);
    setMyAnswer(value); // Set myAnswer when option changes
  };

  const saveUserInput = () => {
    if (!adminDatas.isAdmin && !selectedOption) {
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
      <QuestionBox>
        <div className="d-flex gap-2 ms-5 align-center-lg-custom">
          <div className="">
            <form className="d-flex gap-3 flex-column flex-md-row">
              <h2 className="text-blue fs-1">Question:</h2>
              <div className="d-flex flex-wrap gap-3 flex-row flex-md-column gap-md-8 align-items-center">
                <h3 className="fs-1">{pageData.question}</h3>
                {pageData.options.map((option, index) => {
                  const optionKey = Object.keys(option);
                  const optionID = option[optionKey[0]];
                  const optionText = option[optionKey[1]];
                  const isChecked = selectedOption === optionID;
                  return (
                    <div
                      key={index}
                      className="d-flex gap-3 align-items-center py-0 py-md-5"
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
                        style={{ width: 60, height: 60, cursor: "pointer" }} // Increased size
                        onClick={() => {
                          setErrorMessage("");
                          setSelectedOption(optionID);
                        }}
                      />
                      <label htmlFor={optionID} className="fs-1">
                        {optionText}
                      </label>
                    </div>
                  );
                })}
              </div>
            </form>
          </div>
        </div>
      </QuestionBox>
      {errorMessage && <div className="text-danger">{errorMessage}</div>}
      <div className="d-flex justify-content-center gap-96px mt-4 gap-4">
        <Button text="Prev" />
        <Button text="Next" customOnClick={saveUserInput} />
      </div>
    </>
  );
}

export default Page2;
