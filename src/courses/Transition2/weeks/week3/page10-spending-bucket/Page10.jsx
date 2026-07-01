import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import QuestionBox from "../../../components/QuestionBox";
import Button from "../../../components/Button";
import { selectPageData } from "@/store/navigationSlice";
import { adminData } from "@/store/adminReducer";
import {
  userAnswer,
  saveActivity,
} from "@/store/userAnswersReducer";
import checkedImage from "@/assets/checkedbox.png";
import uncheckedImage from "@/assets/uncheckedBox.png";
import "./page10.css";

function Page10() {
  const dispatch = useDispatch();
  const pageData = useSelector(selectPageData);
  const adminDatas = useSelector(adminData);
  const userAnswers = useSelector(userAnswer);
  const [selectedOption, setSelectedOption] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!userAnswers) return;
    const response = userAnswers?.activities?.find(
      (item) => item.page === pageData.id
    );
    setSelectedOption(response?.answer?.selectedOption ?? null);
  }, [userAnswers, pageData.id]);

  const handleSelect = (index) => {
    setErrorMessage("");
    setSelectedOption(index);
  };

  const saveUserInput = () => {
    if (!adminDatas.isAdmin && selectedOption === null) {
      setErrorMessage("Oops! Please select one bucket before moving on.");
      return false;
    }

    setErrorMessage("");
    if (adminDatas.isAdmin) return true;

    dispatch(
      saveActivity({
        page: pageData.id,
        answer: {
          selectedOption,
          value: pageData.options?.[selectedOption] || "",
        },
      })
    );
    return true;
  };

  return (
    <>
      <QuestionBox extraStyle="bg-custom-blue">
        <div className="transition2-week3-page10-content">
          <div className="d-flex gap-3 flex-column flex-md-row flex-md-nowrap align-items-start text-center">
            <h2 className="text-blue fs-1 mb-0 flex-shrink-0">Question:</h2>
            <div className="d-flex flex-column flex-grow-1 min-w-0">
              <h2 className="text-gray fs-1 mb-2">{pageData.question}</h2>
            </div>
          </div>

          <div className="transition2-week3-page10-options">
            {pageData.options?.map((option, index) => (
              <button
                key={option}
                type="button"
                className="transition2-week3-page10-option"
                onClick={() => handleSelect(index)}
              >
                <img
                  src={
                    selectedOption === index ? checkedImage : uncheckedImage
                  }
                  alt=""
                  className="transition2-week3-page10-checkbox"
                />
                <span>
                  {String.fromCharCode(65 + index)}. {option}
                </span>
              </button>
            ))}
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

export default Page10;
