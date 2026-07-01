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
import SingleCheckboxFrame from "./components/SingleCheckboxFrame";

function Page4() {
  const dispatch = useDispatch();
  const pageData = useSelector(selectPageData);
  const adminDatas = useSelector(adminData);
  const userAnswers = useSelector(userAnswer);

  const [selectedOption, setSelectedOption] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!userAnswers) return;

    const response = userAnswers.activities?.find(
      (item) => item.page === pageData.id
    );

    if (response?.answer) {
      setSelectedOption(response.answer.selectedOption ?? null);
    }
  }, [userAnswers, pageData.id]);

  const saveUserInput = () => {
    if (!adminDatas.isAdmin && selectedOption === null) {
      setErrorMessage("Oops! Please select an option!");
      return false;
    }

    setErrorMessage("");

    if (adminDatas.isAdmin) return true;

    dispatch(
      saveActivity({
        page: pageData.id,
        answer: {
          selectedOption,
        },
      })
    );

    return true;
  };

  const handleSelect = (index) => {
    setErrorMessage("");
    setSelectedOption(index);
  };

  return (
    <>
      <QuestionBox>
        <div className="d-flex gap-3 flex-column flex-md-row flex-md-nowrap align-items-start mt-5 text-center">
          <h2 className="text-blue fs-1 mb-0 flex-shrink-0">Question:</h2>
          <div className="d-flex flex-column flex-grow-1 min-w-0 mb-2">
            <h2 className="text-gray fs-1">{pageData.question}</h2>
          </div>
        </div>

        <SingleCheckboxFrame
          options={pageData.options}
          selectedOption={selectedOption}
          handleSelect={handleSelect}
        />
      </QuestionBox>

      {errorMessage && <div className="text-danger mt-3">{errorMessage}</div>}

      <div className="d-flex justify-content-center gap-96px mt-4 gap-4">
        <Button text="Prev" />
        <Button text="Next" customOnClick={saveUserInput} />
      </div>
    </>
  );
}

export default Page4;
